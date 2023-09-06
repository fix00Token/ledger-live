import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { addPendingOperation } from "@ledgerhq/live-common/account/index";
import { getMainAccount } from "@ledgerhq/live-common/account/helpers";
import { getEnv } from "@ledgerhq/live-env";
import { postSwapAccepted, postSwapCancelled } from "@ledgerhq/live-common/exchange/swap/index";
import addToSwapHistory from "@ledgerhq/live-common/exchange/swap/addToSwapHistory";
import { Account } from "@ledgerhq/types-live";

export const onCompleteExchange = ({ result, exchange, transaction, exchangeRate }: any) => {
  const { operation, swapId } = result;

  /**
   * If transaction broadcast are disabled, consider the swap as cancelled
   * since the partner will never receive the funds
   */
  if (getEnv("DISABLE_TRANSACTION_BROADCAST")) {
    postSwapCancelled({
      provider: exchangeRate.provider,
      swapId,
    });
  } else {
    postSwapAccepted({
      provider: exchangeRate.provider,
      swapId,
      transactionId: operation.hash,
    });
  }

  const mainAccount =
    exchange.fromAccount && getMainAccount(exchange.fromAccount, exchange.fromParentAccount);
  if (!mainAccount) return;
  const accountUpdater = (account: Account) => {
    if (!transaction) return account;
    const accountWithUpdatedHistory = addToSwapHistory({
      account,
      operation,
      transaction,
      swap: {
        exchange,
        exchangeRate,
      },
      swapId,
    });
    return addPendingOperation(accountWithUpdatedHistory, operation);
  };
  return updateAccountWithUpdater(mainAccount.id, accountUpdater);
};
