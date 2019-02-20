import * as types from "../constants/actionTypes";

const reducers = type => (state = [], action) => {
  switch (action.type) {
    case type:
      return action.payload;
    default:
      return state;
  }
};
export const listingDetail = reducers(types.GET_LISTING_DETAIL);
export const listingDescription = reducers(types.GET_LISTING_DESTINATION);
export const listingDescriptionAll = reducers(
  types.GET_LISTING_DESTINATION_ALL
);
export const listingListFeature = reducers(types.GET_LISTING_LIST_FEATURE);
export const listingListFeatureAll = reducers(
  types.GET_LISTING_LIST_FEATURE_ALL
);
export const listingVideos = reducers(types.GET_LISTING_VIDEOS);
export const listingVideosAll = reducers(types.GET_LISTING_VIDEOS_ALL);
export const listingReviews = reducers(types.GET_LISTING_REVIEWS);
export const listingReviewsAll = reducers(types.GET_LISTING_REVIEWS_ALL);
export const listingEvents = reducers(types.GET_LISTING_EVENTS);
export const listingEventsAll = reducers(types.GET_LISTING_EVENTS_ALL);
export const commentInReviews = reducers(types.GET_COMMENT_IN_REVIEWS);
export const listingSidebar = reducers(types.GET_LISTING_SIDEBAR);
export const listingPhotos = (state = {}, action) =>
  reducers(types.GET_LISTING_PHOTOS)(state, action);
export const listingPhotosAll = (state = { large: [], medium: [] }, action) =>
  reducers(types.GET_LISTING_PHOTOS_ALL)(state, action);

export const listingDetailNav = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_DETAIL_NAV:
      return action.detailNav;
    case types.CHANGE_LISTING_DETAIL_NAV:
      return state.map(item => {
        const condition = item.key === action.key;
        return {
          ...item,
          current: condition ? true : false,
          loaded: condition ? true : item.loaded
        };
      });
    default:
      return state;
  }
};

export const listingCustomBox = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_BOX_CUSTOM:
      return {
        ...state,
        [action.payload.key]:
          typeof action.payload.data === "object"
            ? action.payload.data
            : [action.payload.data]
      };
    case types.RESET_LISTING_BOX_CUSTOM:
      return {};
    default:
      return state;
  }
};
