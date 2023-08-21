import React, { useEffect, useMemo } from "react";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";

import { useTheme } from "styled-components/native";
import { useFeature } from "@ledgerhq/live-common/featureFlags/index";
import { ScreenName, NavigatorName } from "../../const";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import type { EarnLiveAppNavigatorParamList } from "./types/EarnLiveAppNavigator";
import type { StackNavigatorProps } from "./types/helpers";
import { EarnScreen } from "../../screens/PTX/Earn";
import { BaseNavigatorStackParamList } from "./types/BaseNavigator";
import { getAccountIdFromWalletAccountId } from "@ledgerhq/live-common/wallet-api/converters";
import { accountsSelector } from "../../reducers/accounts";
import { EarnInfoDrawer } from "../../screens/PTX/Earn/EarnInfoDrawer";

const Stack = createStackNavigator<EarnLiveAppNavigatorParamList>();

const Earn = (props: StackNavigatorProps<EarnLiveAppNavigatorParamList, ScreenName.Earn>) => {
  // Earn dashboard feature flag
  const ptxEarn = useFeature("ptxEarn");
  const paramAction = props.route.params?.action;
  const navigation = useNavigation<StackNavigationProp<BaseNavigatorStackParamList>>();
  const accounts = useSelector(accountsSelector);
  const route = useRoute();

  useEffect(() => {
    if (!ptxEarn?.enabled) {
      return navigation.pop();
    }
    if (!paramAction) {
      return;
    }

    async function deeplinkRouting() {
      switch (paramAction) {
        case "stake":
          navigation.navigate(NavigatorName.StakeFlow, {
            screen: ScreenName.Stake,
            params: {
              parentRoute: route,
            },
          });
          break;
        case "stake-account": {
          const walletId = props.route.params?.accountId;

          if (!walletId) {
            // eslint-disable-next-line no-console
            console.log("accountId required for 'stake-account' action.");
            return;
          }

          const accountId = getAccountIdFromWalletAccountId(walletId);
          const account = accounts.find(acc => acc.id === accountId);
          if (account) {
            navigation.navigate(NavigatorName.StakeFlow, {
              screen: ScreenName.Stake,
              params: {
                account, // NB: we do not use non-serialisable values, but could pass id instead to suppress warning
                parentRoute: route,
              },
            });
          } else {
            // eslint-disable-next-line no-console
            console.log("no matching account found for given id.");
          }
          break;
        }
        case "get-funds": {
          const currencyId = props.route.params?.currencyId;

          if (!currencyId) {
            // eslint-disable-next-line no-console
            console.log('currencyId required for "get-funds" action.');
          } else {
            navigation.navigate(NavigatorName.StakeFlow, {
              screen: ScreenName.Stake,
              params: {
                currencies: [currencyId],
              },
            });
          }
          break;
        }
        default: {
          // eslint-disable-next-line no-console
          console.log(`EarnLiveAppNavigator: No route for action "${paramAction}"`);
        }
      }
    }

    deeplinkRouting();
    // Reset params so that it will retrigger actions if a new deeplink is used
    return navigation.setParams({ action: null, accountId: null, currencyId: null });
  }, [paramAction, ptxEarn?.enabled, props.route.params, accounts, navigation, route]);

  return (
    <>
      <EarnScreen
        navigation={props.navigation}
        route={{
          ...props.route,
          params: {
            platform: ptxEarn?.params?.liveAppId || "earn",
          },
        }}
      />
      <EarnInfoDrawer />
    </>
  );
};

export default function EarnLiveAppNavigator() {
  const { colors } = useTheme();

  const stackNavigationConfig = useMemo(() => getStackNavigatorConfig(colors, true), [colors]);

  return (
    <Stack.Navigator {...stackNavigationConfig}>
      <Stack.Screen
        name={ScreenName.Earn}
        options={{
          headerShown: false,
        }}
        component={Earn} // route props are passed automatically
      />
    </Stack.Navigator>
  );
}
