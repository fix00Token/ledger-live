import type { CosmosAccount, Transaction } from "./types";
import { Observable } from "rxjs";
import { withDevice } from "../../hw/deviceAccess";
import { encodeOperationId } from "../../operation";
import { txToMessages, buildTransaction } from "./js-buildTransaction";
import BigNumber from "bignumber.js";
import { makeSignDoc, StdSignDoc } from "@cosmjs/launchpad";
import type {
  Account,
  Operation,
  OperationType,
  SignOperationFnSignature,
} from "@ledgerhq/types-live";
import { CosmosAPI } from "./api/Cosmos";
import cryptoFactory from "./chain/chain";
import { sortObjectKeysDeeply } from "./helpers";
import { Secp256k1Signature } from "@cosmjs/crypto";
import { CosmosApp } from "@zondax/ledger-cosmos-js";
import { calculateFees, getEstimatedFees } from "./js-prepareTransaction";

const signOperation: SignOperationFnSignature<Transaction> = ({ account, deviceId, transaction }) =>
  withDevice(deviceId)(
    transport =>
      new Observable(o => {
        let cancelled;

        async function main() {
          const cosmosAPI = new CosmosAPI(account.currency.id);
          const { accountNumber, sequence, pubKeyType } = await cosmosAPI.getAccount(
            account.freshAddress,
          );
          const chainInstance = cryptoFactory(account.currency.id);
          o.next({ type: "device-signature-requested" });
          const { aminoMsgs, protoMsgs } = txToMessages(account, transaction);
          if (transaction.fees == null || transaction.gas == null) {
            throw new Error("Transaction misses gas information");
          }
          const feeToEncode = {
            amount: [
              {
                denom: account.currency.units[1].code,
                amount: transaction.fees.toString(),
              },
            ],
            gas: transaction.gas.toString(),
          };
          // Note:
          // Cosmos Nano App sign data in Amino way only, not Protobuf.
          // This is a legacy outdated standard and a long-term blocking point.
          const chainId = await cosmosAPI.getChainId();
          const signDoc = makeSignDoc(
            aminoMsgs,
            feeToEncode,
            chainId,
            transaction.memo || "",
            accountNumber.toString(),
            sequence.toString(),
          );
          const tx = Buffer.from(JSON.stringify(sortObjectKeysDeeply(signDoc)), "utf-8");
          const app = new CosmosApp(transport);
          const path = account.freshAddressPath.split("/").map(p => parseInt(p.replace("'", "")));

          const { compressed_pk } = await app.getAddressAndPubKey(path, chainInstance.prefix);
          const pubKey = Buffer.from(compressed_pk).toString("base64");

          // HRP is only needed when signing for ethermint chains
          const signResponseApp =
            path[1] === 60
              ? await app.sign(path, tx, chainInstance.prefix)
              : await app.sign(path, tx);

          const signature = Buffer.from(
            Secp256k1Signature.fromDer(signResponseApp.signature).toFixedLength(),
          );

          const txBytes = buildTransaction({
            protoMsgs,
            memo: transaction.memo || "",
            pubKeyType,
            pubKey,
            feeAmount: signDoc.fee.amount as any,
            gasLimit: signDoc.fee.gas,
            sequence: signDoc.sequence,
            signature,
          });

          const signed = Buffer.from(txBytes).toString("hex");

          if (cancelled) {
            return;
          }

          o.next({ type: "device-signature-granted" });

          const hash = ""; // resolved at broadcast time
          const accountId = account.id;
          const fee = transaction.fees || new BigNumber(0);
          const extra = {};

          const type: OperationType =
            transaction.mode === "undelegate"
              ? "UNDELEGATE"
              : transaction.mode === "delegate"
              ? "DELEGATE"
              : transaction.mode === "redelegate"
              ? "REDELEGATE"
              : ["claimReward", "claimRewardCompound"].includes(transaction.mode)
              ? "REWARD"
              : "OUT";

          const senders: string[] = [];
          const recipients: string[] = [];

          if (transaction.mode === "send") {
            senders.push(account.freshAddress);
            recipients.push(transaction.recipient);
          }

          if (transaction.mode === "redelegate") {
            Object.assign(extra, {
              sourceValidator: transaction.sourceValidator,
            });
          }

          if (transaction.mode !== "send") {
            Object.assign(extra, {
              validators: transaction.validators,
            });
          }

          // build optimistic operation
          const operation: Operation = {
            id: encodeOperationId(accountId, hash, type),
            hash,
            type,
            value:
              type === "REWARD"
                ? new BigNumber(0)
                : transaction.useAllAmount
                ? account.spendableBalance
                : transaction.amount.plus(fee),
            fee,
            extra,
            blockHash: null,
            blockHeight: null,
            senders,
            recipients,
            accountId,
            date: new Date(),
            transactionSequenceNumber: sequence,
          };

          o.next({
            type: "signed",
            signedOperation: {
              operation,
              signature: signed,
            },
          });
        }

        main().then(
          () => o.complete(),
          e => o.error(e),
        );

        return () => {
          cancelled = true;
        };
      }),
  );

export default signOperation;
