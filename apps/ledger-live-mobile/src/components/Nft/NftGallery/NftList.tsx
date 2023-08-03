import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatListProps, Text } from "react-native";
import { ProtoNFT } from "@ledgerhq/types-live";
import { Button, Flex } from "@ledgerhq/native-ui";
import { BigNumber } from "bignumber.js";
import { Stop } from "react-native-svg";
import styled, { useTheme } from "styled-components/native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import NftListItem from "./NftListItem";
import { AddNewItem } from "./AddNewItemList";
import CollapsibleHeaderFlatList from "../../WalletTab/CollapsibleHeaderFlatList";
import globalSyncRefreshControl from "../../globalSyncRefreshControl";
import { TrackScreen, track } from "../../../analytics";
import { useNftList } from "./NftList.hook";
import BackgroundGradient from "../../TabBar/BackgroundGradient";
import NftFilterDrawer from "./NftFilterDrawer";
import EmptyState from "./EmptyState";
import ScrollToTopButton from "./ScrollToTopButton";
import NftFilterChip from "./NftFilterChip";
import FiltersIcon from "../../../icons/Filters";
import { ScreenName } from "../../../const";
import { withDiscreetMode } from "../../../context/DiscreetModeContext";
import SpamFeatureInfoDrawer from "./SpamFeatureInfoDrawer";

const RefreshableCollapsibleHeaderFlatList = globalSyncRefreshControl<FlatListProps<ProtoNFT>>(
  CollapsibleHeaderFlatList,
  { progressViewOffset: 64 },
);

type Props = {
  readonly data: ProtoNFT[];
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
  readonly isLoading: boolean;
  readonly error: unknown;
  readonly refetch: () => void;
};

// Fake ProtoNFT to be able to display "Add new" button at the end of the list
const ADD_NEW: ProtoNFT = {
  id: "addNew",
  tokenId: "",
  amount: new BigNumber(0),
  contract: "",
  standard: "ERC721",
  currencyId: "",
};

const NB_COLUMNS = 2;

const keyExtractor = (item: ProtoNFT) => item.id;

const NftList = ({ data, fetchNextPage, hasNextPage, isLoading, error, refetch }: Props) => {
  const { space, colors } = useTheme();
  const dataWithAdd = data.concat(ADD_NEW);

  const {
    t,
    triggerMultiSelectMode,
    navigateToNftViewer,
    onPressMultiselect,
    onPressHide,
    onCancelHide,
    handleSelectableNftPressed,
    nftsToHide,
    multiSelectModeEnabled,
    closeFilterDrawer,
    openFilterDrawer,
    chainFilters,
    toggleChainFilter,
    isFilterDrawerVisible,
    spamFilter,
    toggleSpamFilter,
    infoDrawerVisible,
    closeInfoDrawer,
  } = useNftList({ nftList: data });

  const gradient = {
    height: 145,
    opacity: 1,
    stops: [
      <Stop key="0%" offset="0%" stopOpacity={0} stopColor={colors.background.main} />,
      <Stop key="25%" offset="25%" stopOpacity={0.5} stopColor={colors.background.main} />,
      <Stop key="50%" offset="50%" stopOpacity={1} stopColor={colors.background.main} />,
    ],
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ProtoNFT; index: number; count?: number }) => (
      <Flex
        flex={item.id === ADD_NEW.id && (index + 1) % NB_COLUMNS !== 0 ? 1 / NB_COLUMNS : 1}
        mr={(index + 1) % NB_COLUMNS > 0 ? 6 : 0}
        testID={`wallet-nft-gallery-list-item-${index}`}
      >
        {item.id === ADD_NEW.id ? (
          <>{!multiSelectModeEnabled && <AddNewItem />}</>
        ) : (
          <NftListItem
            nft={item}
            onPress={() =>
              multiSelectModeEnabled ? handleSelectableNftPressed(item) : navigateToNftViewer(item)
            }
            onLongPress={() => {
              triggerMultiSelectMode();
              handleSelectableNftPressed(item);
            }}
            selectable={multiSelectModeEnabled}
            isSelected={nftsToHide.map(n => n.contract).includes(item.contract)}
          />
        )}
      </Flex>
    ),
    [
      multiSelectModeEnabled,
      nftsToHide,
      handleSelectableNftPressed,
      navigateToNftViewer,
      triggerMultiSelectMode,
    ],
  );

  const total = useMemo(() => [...new Set(nftsToHide.map(n => n.contract))].length, [nftsToHide]);

  return (
    <>
      <TrackScreen category="NFT Gallery" NFTs_owned={data.length} />
      <SpamFeatureInfoDrawer isOpen={infoDrawerVisible} onClose={closeInfoDrawer} />
      {error ? (
        // TODO: Get real designs/UX
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>{t("errors.NFtGalleryRequest.title")}</Text>
          <Button onPress={() => refetch()}>{t("errors.NFtGalleryRequest.button")}</Button>
        </Flex>
      ) : isLoading ? (
        // TODO: Get real designs/UX
        <Flex flex={1} justifyContent="center">
          <ActivityIndicator />
        </Flex>
      ) : (
        <>
          <RefreshableCollapsibleHeaderFlatList
            numColumns={2}
            ListHeaderComponent={
              <Animated.View>
                {!multiSelectModeEnabled && (
                  <Animated.View entering={FadeInDown}>
                    <StyledFilterBar
                      width="100%"
                      flexDirection="row"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                    >
                      {data.length > 0 ? (
                        <NftFilterChip
                          onPress={onPressMultiselect}
                          testID="wallet-nft-gallery-select-and-hide"
                        >
                          {t("wallet.nftGallery.filters.select")}
                        </NftFilterChip>
                      ) : null}
                      <NftFilterChip
                        onPress={() => {
                          track("button_clicked", {
                            button: "Open Filter",
                            page: ScreenName.WalletNftGallery,
                          });
                          openFilterDrawer();
                        }}
                      >
                        <FiltersIcon
                          active={Object.values(chainFilters).some(val => !val)}
                          dotColor={colors.constant.purple}
                          size={20}
                          color={colors.neutral.c100}
                        />
                      </NftFilterChip>
                    </StyledFilterBar>
                  </Animated.View>
                )}
              </Animated.View>
            }
            ListFooterComponent={
              hasNextPage ? (
                <Flex paddingBottom={100} paddingTop={50}>
                  <ActivityIndicator />
                </Flex>
              ) : null
            }
            ListHeaderComponentStyle={{
              marginBottom: multiSelectModeEnabled ? 0 : space[3],
            }}
            ListEmptyComponent={
              <EmptyState
                onPress={() => {
                  track("button_clicked", {
                    button: "Reset Filters",
                    page: ScreenName.WalletNftGallery,
                  });
                  openFilterDrawer();
                }}
              />
            }
            data={data.length > 0 ? dataWithAdd : data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={11}
            contentContainerStyle={{ marginTop: 0, marginHorizontal: space[6] }}
            testID={"wallet-nft-gallery-list"}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.2}
          />
          {data.length > 12 ? <ScrollToTopButton /> : null}
          <Animated.View>
            {multiSelectModeEnabled && (
              <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
                <BackgroundGradient {...gradient} />

                <ButtonsContainer width="100%" justifyContent={"space-between"}>
                  <StyledButton
                    testID="wallet-nft-gallery-confirm-hide"
                    onPress={onPressHide}
                    type="main"
                    iconName="EyeNone"
                    iconPosition="left"
                    size="large"
                    flexGrow={1}
                    disabled={nftsToHide.length === 0}
                  >
                    {t("wallet.nftGallery.filters.hide", {
                      count: total,
                    })}
                  </StyledButton>
                  <StyledButton
                    onPress={onCancelHide}
                    type="default"
                    iconPosition="left"
                    size="large"
                    flexGrow={1}
                  >
                    {t("common.cancel")}
                  </StyledButton>
                </ButtonsContainer>
              </Animated.View>
            )}
          </Animated.View>
        </>
      )}
      <NftFilterDrawer
        filters={chainFilters}
        isOpen={isFilterDrawerVisible}
        toggleFilter={toggleChainFilter}
        onClose={closeFilterDrawer}
        spamFilter={spamFilter}
        toggleSpamFilter={toggleSpamFilter}
      />
    </>
  );
};

export default withDiscreetMode(NftList);

const StyledButton = styled(Button)`
  padding: 0;
  margin: 0;
`;

const ButtonsContainer = styled(Flex)`
  position: absolute;
  bottom: ${props => props.theme.space[6]}px;
  z-index: 5;
  padding: 0 ${props => props.theme.space[6]}px;
`;

const StyledFilterBar = styled(Flex)`
  margin-bottom: ${props => props.theme.space[2]}px;
  gap: ${props => props.theme.space[3]}px;
`;
