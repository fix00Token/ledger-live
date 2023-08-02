import { Action, ReducerMap, handleActions } from "redux-actions";
import type { NftState, State } from "./types";

import type {
  NftStateGalleryFilterDrawerVisiblePayload,
  NftStateGalleryChainFiltersPayload,
  NftStateGallerySpamFilterPayload,
  NftStatePayload,
} from "../actions/types";
import { NftStateActionTypes } from "../actions/types";

export const INITIAL_STATE: NftState = {
  filterDrawerVisible: false,
  spamFilter: false,
  galleryChainFilters: {
    ethereum: true,
    polygon: true,
  },
};

const handlers: ReducerMap<NftState, NftStatePayload> = {
  [NftStateActionTypes.SET_SPAM_FILTER]: (state, action) => ({
    ...state,
    spamFilter: (action as Action<NftStateGallerySpamFilterPayload>).payload,
  }),
  [NftStateActionTypes.SET_GALLERY_FILTER_DRAWER_VISIBLE]: (state, action) => ({
    ...state,
    filterDrawerVisible: (action as Action<NftStateGalleryFilterDrawerVisiblePayload>).payload,
  }),
  [NftStateActionTypes.SET_GALLERY_CHAIN_FILTER]: (state, action) => {
    const a = action as Action<NftStateGalleryChainFiltersPayload>;
    return {
      ...state,
      galleryChainFilters: {
        ...state.galleryChainFilters,
        [a.payload[0]]: a.payload[1],
      },
    };
  },
};

export const galleryChainFiltersSelector = (state: State) => state.nft.galleryChainFilters;
export const galleryFilterDrawerVisibleSelector = (state: State) => state.nft.filterDrawerVisible;
export const gallerySpamFilterSelector = (state: State) => state.nft.spamFilter;

export default handleActions<NftState, NftStatePayload>(handlers, INITIAL_STATE);
