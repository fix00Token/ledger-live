import React, { useMemo } from "react";
import { FlatList } from "react-native";
import Animated from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";
import { Flex } from "@ledgerhq/native-ui";
import { getAccountCurrency } from "@ledgerhq/live-common/src/account";
import accountSyncRefreshControl from "../../components/accountSyncRefreshControl";
import { withDiscreetMode } from "../../context/DiscreetModeContext";
import TabBarSafeAreaView, {
  TAB_BAR_SAFE_HEIGHT,
} from "../../components/TabBar/TabBarSafeAreaView";
import { accountsSelector } from "../../reducers/accounts";
import SectionTitle from "../WalletCentricSections/SectionTitle";
import OperationsHistorySection from "../WalletCentricSections/OperationsHistory";

type RouteParams = {
  currencyId: string;
};

type Props = {
  navigation: any;
  route: { params: RouteParams };
};


const SectionContainer = styled(Flex).attrs((p: { px?: string | number }) => ({
  mt: 9,
  px: p.px ?? 6,
}))``;

const AnimatedFlatListWithRefreshControl = Animated.createAnimatedComponent(
  accountSyncRefreshControl(FlatList),
);

const AssetScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const accounts = useSelector(accountsSelector);
  const { currencyId } = route?.params;
  const cryptoAccounts = useMemo(
    () => accounts.filter(a => getAccountCurrency(a).id === currencyId),
    [accounts, currencyId],
  );

  const data = useMemo(
    () => [
      <SectionContainer px={6} mb={8}>
        <SectionTitle title={t("analytics.operations.title")} />
        <OperationsHistorySection accounts={cryptoAccounts} />
      </SectionContainer>,
    ],
    [cryptoAccounts],
  );

  return (
    <TabBarSafeAreaView edges={["bottom", "left", "right"]}>
      <AnimatedFlatListWithRefreshControl
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SAFE_HEIGHT }}
        data={data}
        renderItem={({ item }: any) => item}
        keyExtractor={(_: any, index: any) => String(index)}
        showsVerticalScrollIndicator={false}
      />
    </TabBarSafeAreaView>
  );
};

export default withDiscreetMode(AssetScreen);
