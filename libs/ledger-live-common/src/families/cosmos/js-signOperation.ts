import type { Transaction } from "./types";
import { Observable } from "rxjs";
import { withDevice } from "../../hw/deviceAccess";
import { encodeOperationId } from "../../operation";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { buildTransaction, postBuildTransaction } from "./js-buildTransaction";
import BigNumber from "bignumber.js";
import { AminoSignResponse, makeSignDoc, StdSignDoc } from "@cosmjs/launchpad";
import { HdPath, Secp256k1Signature } from "@cosmjs/crypto";

import type { Account, Operation, OperationType, SignOperationEvent } from "@ledgerhq/types-live";
import { CosmosAPI } from "./api/Cosmos";
import cryptoFactory from "./chain/chain";
import { sortObjectKeysDeeply } from "./helpers";
import { CosmosApp } from "@zondax/ledger-cosmos-js";

const signOperation = ({
  account,
  deviceId,
  transaction,
}: {
  account: Account;
  deviceId: any;
  transaction: Transaction;
}): Observable<SignOperationEvent> =>
  withDevice(deviceId)(transport =>
    Observable.create(o => {
      let cancelled;

      async function main() {
        const chainInstance = cryptoFactory(account.currency.id);
        const cosmosAPI = new CosmosAPI(account.currency.id);
        const { accountNumber, sequence, pubKey } = await cosmosAPI.getAccount(
          account.freshAddress,
          account.currency.id === "injective",
        );
        o.next({ type: "device-signature-requested" });
        const { aminoMsgs, protoMsgs } = await buildTransaction(account, transaction);
        if (!transaction.gas) {
          throw new Error("transaction.gas is missing");
        }
        if (!transaction.fees) {
          throw new Error("transaction.fees is missing");
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
        let signDoc = makeSignDoc(
          aminoMsgs,
          feeToEncode,
          chainId,
          transaction.memo || "",
          accountNumber.toString(),
          sequence.toString(),
        );

        if (account.currency.id === "injective") {
          signDoc = sortObjectKeysDeeply(signDoc) as StdSignDoc;
        }

        const tx = Buffer.from(JSON.stringify(signDoc), "utf-8");

        const app = new CosmosApp(transport);

        const path =
          account.currency.id === "injective"
            ? [44, 60, 0, 0, account.index]
            : [44, 118, 0, 0, account.index];

        const resp_add = await app.getAddressAndPubKey(path, chainInstance.prefix);

        let signResponseApp;

        if (account.currency.id === "injective") {
          signResponseApp = await app.sign(path, tx, chainInstance.prefix);
        } else {
          signResponseApp = await app.sign(path, tx);
        }

        const signResponse: AminoSignResponse = {
          signed: signDoc,
          signature: {
            pub_key: {
              value: Buffer.from(resp_add.compressed_pk).toString("base64"),
              type: pubKey.typeUrl,
            },
            signature: Buffer.from(
              Secp256k1Signature.fromDer(signResponseApp.signature).toFixedLength(),
            ).toString("base64"),
          },
        };

        const tx_bytes = await postBuildTransaction(signResponse, protoMsgs);

        const signed = Buffer.from(tx_bytes).toString("hex");

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
            expirationDate: null,
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
