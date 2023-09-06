import { MsgDelegateEncodeObject } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";
import { txToMessages } from "./js-buildTransaction";
import { CosmosAccount, CosmosDelegationInfo, Transaction } from "./types";
import {
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";

import { cosmos } from "@keplr-wallet/cosmos";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";

describe("txToMessages", () => {
  const transaction: Transaction = {} as Transaction;
  const account: CosmosAccount = {
    freshAddress: "accAddress",
    currency: { units: [{ code: "atom" }, { code: "uatom" }] },
  } as CosmosAccount;

  describe("When transaction mode is send", () => {
    beforeEach(() => {
      transaction.mode = "send";
    });

    describe("Amino", () => {
      it("should return a MsgSend message if transaction is complete", async () => {
        transaction.recipient = "address";
        transaction.amount = new BigNumber(1000);
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [aminoMsg] = aminoMsgs;
        expect(aminoMsg).toBeTruthy();
        expect(aminoMsg.type).toContain("MsgSend");
        expect(aminoMsg.value.to_address).toEqual(transaction.recipient);
        expect(aminoMsg.value.from_address).toEqual(account.freshAddress);
        expect(aminoMsg.value.amount[0].amount).toEqual(transaction.amount.toString());
        expect(aminoMsg.value.amount[0].denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if recipient isn't defined", async () => {
        transaction.amount = new BigNumber(10);
        transaction.recipient = "";
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if amount is zero", async () => {
        transaction.amount = new BigNumber(0);
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if amount is negative", async () => {
        transaction.amount = new BigNumber(-10);
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if amount is negative", async () => {
        transaction.amount = new BigNumber(-10);
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });

    describe("Proto", () => {
      it("should return a MsgSend message if transaction is complete", async () => {
        transaction.recipient = "address";
        transaction.amount = new BigNumber(1000);
        const { protoMsgs } = await txToMessages(account, transaction);
        const [protoMsg] = protoMsgs;
        const value = cosmos.bank.v1beta1.MsgSend.decode(protoMsg.value);
        expect(protoMsg).toBeTruthy();
        expect(protoMsg.typeUrl).toContain("MsgSend");
        expect(value.toAddress).toEqual(transaction.recipient);
        expect(value.fromAddress).toEqual(account.freshAddress);
        expect(value.amount[0].amount).toEqual(transaction.amount.toString());
        expect(value.amount[0].denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if recipient isn't defined", async () => {
        transaction.amount = new BigNumber(10);
        transaction.recipient = "";
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if amount is zero", async () => {
        transaction.amount = new BigNumber(0);
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if amount is negative", async () => {
        transaction.amount = new BigNumber(-10);
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });

  describe("When transaction mode is delegate", () => {
    beforeEach(() => {
      transaction.mode = "delegate";
    });

    describe("Amino", () => {
      it("should return a MsgDelegate message if transaction is complete", async () => {
        transaction.amount = new BigNumber(1000);
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [message] = aminoMsgs;
        expect(message).toBeTruthy();
        expect(message.type).toContain("MsgDelegate");
        expect(message.value.validator_address).toEqual(transaction.validators[0].address);
        expect(message.value.delegator_address).toEqual(account.freshAddress);
        expect(message.value.amount?.amount).toEqual(transaction.amount.toString());
        expect(message.value.amount?.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if tx has a 0 amount", async () => {
        transaction.amount = new BigNumber(0);
        transaction.validators = [{ address: "realAddressTrustMe" } as CosmosDelegationInfo];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if tx has a negative amount", async () => {
        transaction.amount = new BigNumber(-1);
        transaction.validators = [{ address: "realAddressTrustMe" } as CosmosDelegationInfo];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validators has no address", async () => {
        transaction.validators = [{} as CosmosDelegationInfo];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validators aren't defined", async () => {
        transaction.validators = [];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });

    describe("Proto", () => {
      it("should return a MsgDelegate message if transaction is complete", async () => {
        transaction.amount = new BigNumber(1000);
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        const [message] = protoMsgs;
        expect(message).toBeTruthy();
        expect(message.typeUrl).toContain("MsgDelegate");
        const value = MsgDelegate.decode(message.value);
        expect(value.validatorAddress).toEqual(transaction.validators[0].address);
        expect(value.delegatorAddress).toEqual(account.freshAddress);
        expect(value.amount?.amount).toEqual(transaction.amount.toString());
        expect(value.amount?.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if tx has a 0 amount", async () => {
        transaction.amount = new BigNumber(0);
        transaction.validators = [{ address: "realAddressTrustMe" } as CosmosDelegationInfo];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if tx has a negative amount", async () => {
        transaction.amount = new BigNumber(-1);
        transaction.validators = [{ address: "realAddressTrustMe" } as CosmosDelegationInfo];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validators has no address", async () => {
        transaction.validators = [{} as CosmosDelegationInfo];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validators aren't defined", async () => {
        transaction.validators = [];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });

  describe("When transaction mode is undelegate", () => {
    beforeEach(() => {
      transaction.mode = "undelegate";
    });

    describe("Amino", () => {
      it("should return a MsgUndelegate message if transaction is complete", async () => {
        transaction.amount = new BigNumber(1000);
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [message] = aminoMsgs;
        expect(message).toBeTruthy();
        expect(message.type).toContain("MsgUndelegate");
        expect(message.value.validator_address).toEqual(transaction.validators[0].address);
        expect(message.value.delegator_address).toEqual(account.freshAddress);
        expect(message.value.amount?.amount).toEqual(transaction.validators[0].amount.toString());
        expect(message.value.amount?.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if validators aren't defined", async () => {
        transaction.validators = [];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validator amount is 0", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(0),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validator amount is negative", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(-10),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });

    describe("Proto", () => {
      it("should return a MsgUndelegate message if transaction is complete", async () => {
        transaction.amount = new BigNumber(1000);
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        const [message] = protoMsgs;
        expect(message).toBeTruthy();
        expect(message.typeUrl).toContain("MsgUndelegate");
        const value = MsgUndelegate.decode(message.value);
        expect(value.validatorAddress).toEqual(transaction.validators[0].address);
        expect(value.delegatorAddress).toEqual(account.freshAddress);
        expect(value.amount?.amount).toEqual(transaction.validators[0].amount.toString());
        expect(value.amount?.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if validators aren't defined", async () => {
        transaction.validators = [];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validator amount is 0", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(0),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validator amount is negative", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(-10),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });

  describe("When transaction mode is redelegate", () => {
    beforeEach(() => {
      transaction.mode = "redelegate";
    });

    describe("Amino", () => {
      it("should return a MsgBeginRedelegate message if transaction is complete", async () => {
        transaction.sourceValidator = "source";
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [message] = aminoMsgs;
        expect(message).toBeTruthy();
        expect(message.type).toContain("MsgBeginRedelegate");
        expect(message.value.validator_src_address).toEqual(transaction.sourceValidator);
        expect(message.value.validator_dst_address).toEqual(transaction.validators[0].address);
        expect(message.value.delegator_address).toEqual(account.freshAddress);
        expect(message.value.amount.amount).toEqual(transaction.validators[0].amount.toString());
        expect(message.value.amount.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if sourceValidator isn't defined", async () => {
        transaction.sourceValidator = "";
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
      it("should return no message if validator amount is 0", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(0),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
      it("should return no message if validator amount is negative", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(-10),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });

    describe("Proto", () => {
      it("should return a MsgBeginRedelegate message if transaction is complete", async () => {
        transaction.sourceValidator = "source";
        transaction.validators = [
          {
            address: "realAddressTrustMe",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        const [message] = protoMsgs;
        expect(message).toBeTruthy();
        expect(message.typeUrl).toContain("MsgBeginRedelegate");
        const value = MsgBeginRedelegate.decode(message.value);
        expect(value.validatorSrcAddress).toEqual(transaction.sourceValidator);
        expect(value.validatorDstAddress).toEqual(transaction.validators[0].address);
        expect(value.delegatorAddress).toEqual(account.freshAddress);
        expect(value.amount?.amount).toEqual(transaction.validators[0].amount.toString());
        expect(value.amount?.denom).toEqual(account.currency.units[1].code);
      });

      it("should return no message if sourceValidator isn't defined", async () => {
        transaction.sourceValidator = "";
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(100),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
      it("should return no message if validator amount is 0", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(0),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
      it("should return no message if validator amount is negative", async () => {
        transaction.validators = [
          {
            address: "address",
            amount: new BigNumber(-10),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });

  describe("When transaction mode is claimReward", () => {
    beforeEach(() => {
      transaction.mode = "claimReward";
    });

    describe("Amino", () => {
      it("should return a MsgWithdrawDelegationReward message if transaction is complete", async () => {
        transaction.validators = [
          {
            address: "iAmAValidatorAddress",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [message] = aminoMsgs;
        expect(message).toBeTruthy();
        expect(message.type).toContain("MsgWithdrawDelegationReward");
        expect(message.value.validator_address).toEqual(transaction.validators[0].address);
        expect(message.value.delegator_address).toEqual(account.freshAddress);
      });

      it("should return no message if validator isn't defined", async () => {
        transaction.validators = [];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });

    describe("Proto", () => {
      it("should return a MsgWithdrawDelegatorReward message if transaction is complete", async () => {
        transaction.validators = [
          {
            address: "iAmAValidatorAddress",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        const [message] = protoMsgs;
        expect(message).toBeTruthy();
        expect(message.typeUrl).toContain("MsgWithdrawDelegatorReward");
        const value = MsgWithdrawDelegatorReward.decode(message.value);
        expect(value.validatorAddress).toEqual(transaction.validators[0].address);
        expect(value.delegatorAddress).toEqual(account.freshAddress);
      });

      it("should return no message if validator isn't defined", async () => {
        transaction.validators = [];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });

      it("should return no message if validator address isn't defined", async () => {
        transaction.validators = [
          {
            address: "",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });

  describe("When transaction mode is claimRewardCompound", () => {
    beforeEach(() => {
      transaction.mode = "claimRewardCompound";
    });

    describe("Amino", () => {
      it("should return a MsgWithdrawDelegationReward message and a MsgDelegate if transaction is complete", async () => {
        transaction.validators = [
          {
            address: "iAmAValidatorAddress",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { aminoMsgs } = await txToMessages(account, transaction);
        const [withDrawMessage, delegateMessage] = aminoMsgs;
        expect(withDrawMessage).toBeTruthy();
        expect(withDrawMessage.type).toContain("MsgWithdrawDelegationReward");
        expect(withDrawMessage.value.validator_address).toEqual(transaction.validators[0].address);
        expect(withDrawMessage.value.delegator_address).toEqual(account.freshAddress);
        expect(delegateMessage).toBeTruthy();
        expect(delegateMessage.type).toContain("MsgDelegate");
        expect(delegateMessage.value.validator_address).toEqual(transaction.validators[0].address);
        expect(delegateMessage.value.delegator_address).toEqual(account.freshAddress);
        expect(delegateMessage.value.amount.amount).toEqual(
          transaction.validators[0].amount.toString(),
        );
        expect(delegateMessage.value.amount.denom).toEqual(account.currency.units[1].code);
      });
    });

    describe("Proto", () => {
      it("should return a MsgWithdrawDelegatorReward message and a MsgDelegate if transaction is complete", async () => {
        transaction.validators = [
          {
            address: "iAmAValidatorAddress",
            amount: new BigNumber(1000),
          } as CosmosDelegationInfo,
        ];
        const { protoMsgs } = await txToMessages(account, transaction);
        const [withDrawMessage, delegateMessage] = protoMsgs;
        expect(withDrawMessage).toBeTruthy();
        expect(withDrawMessage.typeUrl).toContain("MsgWithdrawDelegatorReward");
        const withDrawMessageValue = MsgWithdrawDelegatorReward.decode(withDrawMessage.value);
        expect(withDrawMessageValue.validatorAddress).toEqual(transaction.validators[0].address);
        expect(withDrawMessageValue.delegatorAddress).toEqual(account.freshAddress);
        expect(delegateMessage).toBeTruthy();
        expect(delegateMessage.typeUrl).toContain("MsgDelegate");
        const delegateMessageValue = MsgDelegate.decode(delegateMessage.value);
        expect(delegateMessageValue.validatorAddress).toEqual(transaction.validators[0].address);
        expect(delegateMessageValue.delegatorAddress).toEqual(account.freshAddress);
        expect(delegateMessageValue.amount?.amount).toEqual(
          transaction.validators[0].amount.toString(),
        );
        expect(delegateMessageValue.amount?.denom).toEqual(account.currency.units[1].code);
      });
    });
  });

  describe("When transaction mode isn't known", () => {
    describe("Amino", () => {
      it("should return no message", async () => {
        // @ts-expect-error Random mode that isn't listed in typescript type
        transaction.mode = "RandomModeThatICreatedMyself";
        const { aminoMsgs } = await txToMessages(account, transaction);
        expect(aminoMsgs.length).toEqual(0);
      });
    });
    describe("Proto", () => {
      it("should return no message", async () => {
        // @ts-expect-error Random mode that isn't listed in typescript type
        transaction.mode = "RandomModeThatICreatedMyself";
        const { protoMsgs } = await txToMessages(account, transaction);
        expect(protoMsgs.length).toEqual(0);
      });
    });
  });
});
