import React, { useMemo } from "react";
import styled from "styled-components";
import toPairs from "lodash/toPairs";
import { Trans } from "react-i18next";
import { AccountLike, NFTMetadataResponse, Operation } from "@ledgerhq/types-live";
import { useNftMetadata } from "@ledgerhq/live-common/nft/index";
import { decodeAccountId } from "@ledgerhq/live-common/account/index";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import Skeleton from "~/renderer/components/Nft/Skeleton";
import Text from "~/renderer/components/Text";
import {
  OpDetailsTitle,
  OpDetailsData,
  OpDetailsSection,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import Ellipsis from "~/renderer/components/Ellipsis";

type OperationDetailsExtraProps = {
  extra: {
    [key: string]: string;
  };
  type: string;
  account: AccountLike | undefined | null;
};

const OperationDetailsExtra = ({ extra }: OperationDetailsExtraProps) => {
  const entries = toPairs(extra);
  const jsx = entries.map(([key, value]) => (
    <OpDetailsSection key={key}>
      <OpDetailsTitle>
        <Trans i18nKey={`operationDetails.extra.${key}`} defaults={key} />
      </OpDetailsTitle>
      <OpDetailsData>
        <Ellipsis>{value}</Ellipsis>
      </OpDetailsData>
    </OpDetailsSection>
  ));
  return <>{jsx}</>;
};

const Cell = styled(Box).attrs(() => ({
  horizontal: false,
  alignItems: "flex-end",
}))`
  flex: 0 0 auto;
  text-align: right;
  justify-content: center;
  min-width: 150px;
`;

type NFTAmountFieldProps = {
  operation: Operation;
};

const NFTAmountField = ({ operation }: NFTAmountFieldProps) => {
  const { currencyId } = decodeAccountId(operation.accountId);
  const { status, metadata } = useNftMetadata(operation.contract, operation.tokenId, currencyId);
  const show = useMemo(() => status === "loading", [status]);
  return (
    <Cell>
      <Skeleton show={show} width={170} minHeight={24} barHeight={10}>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
          {(metadata as NFTMetadataResponse["result"])?.nftName || "-"}
        </Text>
      </Skeleton>
      <Skeleton show={show} width={200} minHeight={24} barHeight={6}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade100">
          {centerEllipsis(operation?.tokenId)}
        </Text>
      </Skeleton>
    </Cell>
  );
};

const amountCell = {
  NFT_OUT: NFTAmountField,
  NFT_IN: NFTAmountField,
};

export default {
  OperationDetailsExtra,
  amountCell,
};
