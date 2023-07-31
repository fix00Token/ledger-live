import React from "react";
import { Button, Flex, IconsLegacy, Link } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import DrawerFooter from "./DrawerFooter";
import { withV3StyleProvider } from "~/renderer/styles/StyleProviderV3";
import ErrorDisplay from "../../../ErrorDisplay";
import { createCustomErrorClass } from "@ledgerhq/errors";
import useEnv from "~/renderer/hooks/useEnv";
import { useHistory } from "react-router";
import { DeviceBlocker } from "../../../DeviceAction/DeviceBlocker";
import { setDrawer } from "~/renderer/drawers/Provider";
import TrackPage from "~/renderer/analytics/TrackPage";
import { track } from "~/renderer/analytics/segment";

export type Props = {
  error: Error;
  onClickRetry: () => void;
};

const NotFoundEntityError = createCustomErrorClass("NotFoundEntityError");

const GenuineCheckErrorDrawer: React.FC<Props> = ({ error, onClickRetry }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isNotFoundEntityError = error.message === "not found entity";
  const forcedProvider = useEnv("FORCE_PROVIDER");

  const displayedError = isNotFoundEntityError
    ? { ...new NotFoundEntityError(), providerNumber: forcedProvider }
    : error;

  const drawerAnalyticsName = `Error: ${
    isNotFoundEntityError ? "couldn't check if the device was genuine" : error.name
  }`;

  const goToExperimentalSettings = () => {
    setDrawer();
    history.push("/settings/experimental");
  };

  const exit = () => {
    setDrawer();
    history.push("/onboarding/select-device");
  };

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
      <TrackPage category={drawerAnalyticsName} type="drawer" refreshSource={false} />
      <Flex px={13} flex={1}>
        <ErrorDisplay
          error={displayedError}
          Icon={({ size }) => <IconsLegacy.InfoAltFillMedium size={size} color={"primary.c80"} />}
        />
      </Flex>
      <DrawerFooter>
        <Link
          mr={8}
          size="large"
          type="shade"
          onClick={() => {
            track("button_clicked", { button: "Quit setup", drawer: drawerAnalyticsName });
            exit();
          }}
        >
          {t("syncOnboarding.manual.softwareCheckContent.genuineCheckErrorDrawer.quitSetupCTA")}
        </Link>
        {isNotFoundEntityError ? (
          <Button
            size="large"
            variant="main"
            onClick={() => {
              track("button_clicked", { button: "Go to settings", drawer: drawerAnalyticsName });
              goToExperimentalSettings();
            }}
          >
            {t(
              "syncOnboarding.manual.softwareCheckContent.genuineCheckErrorDrawer.goToSettingsCTA",
            )}
          </Button>
        ) : (
          <Button
            size="large"
            variant="main"
            onClick={() => {
              track("button_clicked", { button: "Retry", drawer: drawerAnalyticsName });
              onClickRetry();
            }}
          >
            {t("syncOnboarding.manual.softwareCheckContent.genuineCheckErrorDrawer.retryCTA")}
          </Button>
        )}
      </DrawerFooter>
      <DeviceBlocker />
    </Flex>
  );
};

export default withV3StyleProvider(GenuineCheckErrorDrawer);
