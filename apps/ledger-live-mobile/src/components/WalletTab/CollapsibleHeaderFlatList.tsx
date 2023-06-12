import { Flex } from "@ledgerhq/native-ui";
import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useContext, useCallback } from "react";
import {
  Dimensions,
  Animated,
  StatusBar,
  FlatList,
  FlatListProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WalletTabNavigatorScrollContext } from "./WalletTabNavigatorScrollManager";
import AnimatedProps = Animated.AnimatedProps;

function CollapsibleHeaderFlatList<T>({
  children,
  contentContainerStyle,
  testScroll,
  ...otherProps
}: AnimatedProps<FlatListProps<T>> & { testScroll?: (event: any) => void }) {
  const { scrollY, onGetRef, syncScrollOffset, tabBarHeight, headerHeight } =
    useContext(WalletTabNavigatorScrollContext);
  const windowHeight = Dimensions.get("window").height;
  const route = useRoute();
  const isFocused = useIsFocused();

  const onMomentumScrollEnd = useCallback(() => {
    syncScrollOffset(route.name);
  }, [route.name, syncScrollOffset]);

  const insets = useSafeAreaInsets();

  return (
    <Flex
      /**
       * NB: not using SafeAreaView because it flickers during navigation
       * https://github.com/th3rdwave/react-native-safe-area-context/issues/219
       */
      flex={1}
      zIndex={-1}
      mt={insets.top}
    >
      <Animated.FlatList<T>
        scrollToOverflowEnabled={true}
        ref={(ref: FlatList) => onGetRef({ key: route.name, value: ref })}
        scrollEventThrottle={16}
        onScrollEndDrag={onMomentumScrollEnd}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={[
          {
            paddingTop: headerHeight + tabBarHeight,
            minHeight: windowHeight + (StatusBar.currentHeight || 0),
            paddingBottom: tabBarHeight + (StatusBar.currentHeight || 0 / 2),
          },
          contentContainerStyle,
        ]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={
          // event.preventDefault();
          !!testScroll
            ? testScroll
            : isFocused
            ? Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                {
                  useNativeDriver: true,
                },
              )
            : undefined
        }
        {...otherProps}
      >
        {children}
      </Animated.FlatList>
    </Flex>
  );
}

export default CollapsibleHeaderFlatList;
