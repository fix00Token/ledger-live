import React from "react";
import { Button, Divider, Flex, IconsLegacy, Text } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import { ErrorBody } from "~/renderer/components/DeviceAction/rendering";
import Link from "~/renderer/components/Link";

type Props = {
  onContinue: () => void;
  onCancel: () => void;
};

const Cancel = ({ onContinue, onCancel }: Props) => {
  const { t } = useTranslation();

  return (
    <Flex flex={1} flexDirection="column">
      <Flex flex={1} alignItems="center" justifyContent="center" flexDirection="column" px={100}>
        <ErrorBody
          Icon={() => <IconsLegacy.WarningMedium color={"warning.c50"} size={24} />}
          title={t("manager.firmware.updateInProgress")}
          description={t("manager.firmware.cancelUpdateWarning")}
        />
      </Flex>
      <Divider />
      <Flex
        px={12}
        alignSelf="stretch"
        flexDirection="row"
        justifyContent="space-between"
        paddingTop={4}
        paddingBottom={1}
      >
        <Flex alignItems="center" justifyContent="center">
          <Link onClick={onCancel}>
            <Text fontWeight="600">{t("manager.firmware.cancelUpdate")}</Text>
          </Link>
        </Flex>
        <Flex flex={1} />
        <Button data-test-id="modal-continue-button" variant="main" onClick={onContinue}>
          {t("manager.firmware.continueUpdate")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Cancel;
