import { CacheRes, makeLRUCache } from "@ledgerhq/live-network/cache";
import { log } from "@ledgerhq/logs";
import type { Account } from "@ledgerhq/types-live";
import BigNumber from "bignumber.js";
import { getEnv } from "@ledgerhq/live-env";
import { CosmosAPI } from "./api/Cosmos";
import cryptoFactory from "./chain/chain";
import { txToMessages, buildTransaction } from "./js-buildTransaction";
import { getMaxEstimatedBalance } from "./logic";
import { CosmosAccount, Transaction } from "./types";

export const calculateFees: CacheRes<
  Array<{
    account: Account;
    transaction: Transaction;
  }>,
  {
    estimatedFees: BigNumber;
    estimatedGas: BigNumber;
  }
> = makeLRUCache(
  async ({
    account,
    transaction,
  }): Promise<{
    estimatedFees: BigNumber;
    estimatedGas: BigNumber;
  }> => {
    return await getEstimatedFees(account as CosmosAccount, transaction);
  },
  ({ account, transaction }) =>
    `${account.id}_${account.currency.id}_${transaction.amount.toString()}_${
      transaction.recipient
    }_${String(transaction.useAllAmount)}_${transaction.mode}_${
      transaction.validators
        ? transaction.validators.map(v => `${v.address}-${v.amount}`).join("_")
        : ""
    }_${transaction.memo ? transaction.memo.toString() : ""}_${
      transaction.sourceValidator ? transaction.sourceValidator : ""
    }`,
  {
    ttl: 1000 * 60, // 60 sec
  },
);

export const getEstimatedFees = async (
  account: CosmosAccount,
  transaction: Transaction,
): Promise<{ estimatedFees: BigNumber; estimatedGas: BigNumber }> => {
  const chainInstance = cryptoFactory(account.currency.id);
  let estimatedGas = new BigNumber(chainInstance.defaultGas);

  const cosmosAPI = new CosmosAPI(account.currency.id);
  const { protoMsgs } = await txToMessages(account, transaction);
  const { sequence, pubKeyType, pubKey } = await cosmosAPI.getAccount(account.freshAddress);
  const signature = new Uint8Array(Buffer.from(account.seedIdentifier, "hex"));

  if (protoMsgs && protoMsgs.length > 0) {
    const txBytes = await buildTransaction({
      protoMsgs,
      memo: transaction.memo || "",
      pubKeyType,
      pubKey,
      feeAmount: undefined,
      gasLimit: undefined,
      sequence: String(sequence),
      signature,
    });

    const txToSimulate = Array.from(Uint8Array.from(txBytes));

    try {
      const gasUsed = await cosmosAPI.simulate(txToSimulate);
      estimatedGas = gasUsed
        .multipliedBy(new BigNumber(getEnv("COSMOS_GAS_AMPLIFIER")))
        .integerValue(BigNumber.ROUND_CEIL);
    } catch (e) {
      log("cosmos/simulate", "failed to estimate gas usage during tx simulation", {
        e,
      });
    }
  }

  const estimatedFees = estimatedGas
    .times(chainInstance.minGasPrice)
    .integerValue(BigNumber.ROUND_CEIL);

  return { estimatedFees, estimatedGas };
};

export const prepareTransaction = async (
  account: Account,
  transaction: Transaction,
): Promise<Transaction> => {
  let memo = transaction.memo;
  let amount = transaction.amount;

  if (transaction.mode !== "send" && !transaction.memo) {
    memo = "Ledger Live";
  }

  const { estimatedFees, estimatedGas } = await calculateFees({
    account,
    transaction: {
      ...transaction,
      amount: transaction.useAllAmount
        ? account.spendableBalance.minus(new BigNumber(2500))
        : amount,
      memo,
    },
  });

  if (transaction.useAllAmount) {
    amount = getMaxEstimatedBalance(account as CosmosAccount, estimatedFees);
  }

  if (
    transaction.memo !== memo ||
    !estimatedFees.eq(transaction.fees || new BigNumber(0)) ||
    !estimatedGas.eq(transaction.gas || new BigNumber(0)) ||
    !amount.eq(transaction.amount)
  ) {
    return {
      ...transaction,
      memo,
      fees: estimatedFees,
      gas: estimatedGas,
      amount,
    };
  }

  return transaction;
};

export default prepareTransaction;
