import { flatMap } from "lodash";
import { log } from "@ledgerhq/logs";
import BigNumber from "bignumber.js";
import { Account } from "@ledgerhq/types-live";
import { encodeAccountId } from "../../../../account";

import { GetAccountShape } from "@ledgerhq/coin-framework/bridge/jsHelpers";
import { fetchBalances, fetchNetworkStatus, fetchTxs, getAccountStateInfo } from "./api/index";
import { mapTxToOps } from "./txn";
import { NAccountBalance, ITxnHistoryData } from "./api/types";

export const getAccountShape: GetAccountShape = async info => {
  const { address, currency, derivationMode } = info;

  const accountId = encodeAccountId({
    type: "js",
    version: "2",
    currencyId: currency.id,
    xpubOrAddress: address,
    derivationMode,
  });

  log("debug", `Generation account shape for ${address}`);

  const { purseUref, accountHash } = await getAccountStateInfo(address);

  const blockHeight = await fetchNetworkStatus();

  const balance: NAccountBalance = purseUref ? await fetchBalances(purseUref) : { balance_value: "0", api_version: "", merkle_proof: "" }
  const txs: ITxnHistoryData[] = purseUref ? await fetchTxs(address) : [];

  const csprBalance = new BigNumber(balance.balance_value);
  const result: Partial<Account> = {
    id: accountId,
    balance: csprBalance,
    spendableBalance: csprBalance,
    operations: flatMap(txs, mapTxToOps(accountId, accountHash ?? "")),
    blockHeight: blockHeight.last_added_block_info.height,
  };

  return result;
};
