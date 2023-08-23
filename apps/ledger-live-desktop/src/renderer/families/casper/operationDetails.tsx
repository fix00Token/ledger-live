import React from "react";
import { Trans } from "react-i18next";
import {
  OpDetailsTitle,
  OpDetailsData,
  OpDetailsSection,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import Ellipsis from "~/renderer/components/Ellipsis";
import type { OperationDetailsExtraProps } from "../types";

import { CasperAccount } from "@ledgerhq/live-common/families/casper/types";

const OperationDetailsExtra = ({ extra }: OperationDetailsExtraProps<CasperAccount>) => {
  return (
    <>
      {Object.keys(extra).map(key => {
        if (["transferId"].includes(key)) {
          return (
            <OpDetailsSection key={key}>
              <OpDetailsTitle>
                <Trans i18nKey={`families.casper.${key}`} defaults={key} />
              </OpDetailsTitle>
              <OpDetailsData>
                <Ellipsis>{extra[key] ?? "-"}</Ellipsis>
              </OpDetailsData>
            </OpDetailsSection>
          );
        }

        return null;
      })}
    </>
  );
};

export default {
  OperationDetailsExtra,
};
