import { combineReducers } from "redux";
import * as requestTimeout from "./requestTimeout";
import { listings } from "./listings";
import { listingSearchResults } from "./listingSearchResults";
import { listingByCat } from "./listingByCat";
import { loading, loadingListingDetail, loadingReview } from "./loading";
import * as listingDetailAll from "./listingDetail";
import { listingFilters } from "./listingFilters";
import { homeScreen } from "./homeScreen";
import { locationList } from "./locationList";
import { categoryList } from "./categoryList";
import { locations } from "./locations";
import { translations } from "./translations";
import { scrollTo } from "./scrollTo";
import { events } from "./events";
import { eventDetail } from "./eventDetail";
import {
  eventDiscussion,
  eventDiscussionLatest,
  commentInDiscussionEvent
} from "./eventDiscussion";
import { eventSearchResults } from "./eventSearchResults";
import { articles } from "./articles";
import { articleDetail } from "./articleDetail";
import { tabNavigator, stackNavigator } from "./navigators";
import { nearByFocus } from "./nearByFocus";
import { page } from "./page";
import { settings } from "./settings";
import {
  auth,
  isTokenExpired,
  loginError,
  isLoginLoading,
  signupError,
  isSignupLoading
} from "./reducerAuth";
import {
  myFavorites,
  listIdPostFavorites,
  listIdPostFavoritesRemoved
} from "./reducerMyFavorites";
import { reportForm, reportMessage } from "./reducerReportForm";
import { accountNav } from "./reducerAccountNav";
import { myProfile, myProfileError } from "./reducerMyProfile";
import { editProfileForm } from "./reducerEditProfileForm";
import { myListings, myListingError } from "./reducerMyListings";
import { listingStatus, eventStatus } from "./reducerListingStatus";
import { postTypes } from "./reducerPostTypes";
import { myEvents, myEventError } from "./reducerMyEvents";
import {
  myNotifications,
  myNotificationError,
  deleteMyNotificationError
} from "./reducerMyNotifications";
import { signUpForm } from "./reducerSignupForm";
import { countNotify, countNotifyRealTimeFaker } from "./reducerCounts";

const reducers = combineReducers({
  countNotify,
  countNotifyRealTimeFaker,
  signUpForm,
  myNotifications,
  myNotificationError,
  deleteMyNotificationError,
  myEvents,
  myEventError,
  postTypes,
  listingStatus,
  eventStatus,
  myListings,
  myListingError,
  listings,
  listingSearchResults,
  listingByCat,
  ...listingDetailAll,
  listingFilters,
  homeScreen,
  loading,
  loadingListingDetail,
  loadingReview,
  locationList,
  categoryList,
  locations,
  translations,
  scrollTo,
  events,
  eventDetail,
  eventDiscussion,
  eventDiscussionLatest,
  commentInDiscussionEvent,
  eventSearchResults,
  articles,
  articleDetail,
  tabNavigator,
  stackNavigator,
  nearByFocus,
  page,
  settings,
  auth,
  isTokenExpired,
  loginError,
  isLoginLoading,
  signupError,
  isSignupLoading,
  myFavorites,
  listIdPostFavorites,
  listIdPostFavoritesRemoved,
  reportForm,
  reportMessage,
  accountNav,
  myProfile,
  myProfileError,
  editProfileForm,
  ...requestTimeout
});

export default reducers;
