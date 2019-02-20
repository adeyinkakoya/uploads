import React, { Component } from "react";
import {
  Platform,
  Image,
  AsyncStorage,
  Dimensions,
  Linking,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Permissions, Location, Constants, IntentLauncherAndroid } from "expo";
import he from "he";
import _ from "lodash";
import axios from "axios";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import ListingDetailScreen from "../components/screens/ListingDetailScreen";
import CommentListingScreen from "../components/screens/CommentListingScreen";
import EventDetailScreen from "../components/screens/EventDetailScreen";
import EventDiscussionAllScreen from "../components/screens/EventDiscussionAllScreen";
import EventCommentDiscussionScreen from "../components/screens/EventCommentDiscussionScreen";
import WebViewScreen from "../components/screens/WebViewScreen";
import ArticleDetailScreen from "../components/screens/ArticleDetailScreen";
import SearchScreen from "../components/screens/SearchScreen";
import ListingSearchResultScreen from "../components/screens/ListingSearchResultScreen";
import EventSearchResultScreen from "../components/screens/EventSearchResultScreen";
import MessageScreen from "../components/screens/MessageScreen";
import SendMessageScreen from "../components/screens/SendMessageScreen";
import NotificationsScreen from "../components/screens/NotificationsScreen";

import {
  getHomeScreen,
  getTabNavigator,
  getTranslations,
  getLocations,
  getSettings,
  checkToken,
  getCountNotificationsRealTimeFaker
} from "../actions";

import rootTabNavOpts from "./rootTabNavOpts";
import homeStack from "./homeStack";
import listingStack from "./listingStack";
import eventStack from "./eventStack";
import accountStack from "./accountStack";
import menuStack from "./menuStack";
import blogStack from "./articleStack";
import pageStack from "./pageStack";

import { FontIcon } from "../wiloke-elements";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const navigationOptions = {
  gesturesEnabled: true
  // gestureResponseDistance: {
  //   horizontal: SCREEN_WIDTH
  // }
};

class RootStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null
    };

    const { auth } = this.props;
    const { token } = auth;
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  _getLocationAsync = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      console.log(status);
      // if (status !== "granted") {
      //   await this.setState({
      //     errorMessage: "Permission to access location was denied"
      //   });
      // }
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        this.props.getLocations(location);
      } else {
        throw new Error("Location permission not granted");
      }

      // const location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      const { translations } = await this.props;
      Platform === "android"
        ? IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
          )
        : Alert.alert(
            he.decode(translations.askForAllowAccessingLocationTitle),
            he.decode(translations.askForAllowAccessingLocationDesc),
            [
              {
                text: translations.cancel,
                style: "cancel"
              },
              {
                text: translations.ok,
                onPress: () => Linking.openURL("app-settings:")
              }
            ],
            { cancelable: false }
          );
    }
  };

  _checkToken = _ => {
    const { checkToken } = this.props;
    checkToken();
    this._checkTokenFaker = setInterval(_ => {
      if (this.props.auth.isLoggedIn) {
        checkToken();
      }
    }, 60000);
  };

  _getCountNotifications = _ => {
    const { getCountNotificationsRealTimeFaker } = this.props;
    if (this.props.auth.isLoggedIn) {
      getCountNotificationsRealTimeFaker();
    }
    this._getCountNotificationFaker = setInterval(_ => {
      if (this.props.auth.isLoggedIn) {
        getCountNotificationsRealTimeFaker();
      }
    }, 10000);
  };

  async componentDidMount() {
    const {
      getSettings,
      getTranslations,
      getHomeScreen,
      getTabNavigator
    } = this.props;
    await getSettings();
    await getTranslations();
    getHomeScreen();
    getTabNavigator();
    this._checkToken();
    this._getCountNotifications();
    // if (Platform.OS === "android" && !Constants.isDevice) {
    //   this.setState({
    //     errorMessage:
    //       "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
    //   });
    // } else {
    //   this._getLocationAsync();
    // }
  }

  componentWillUnmount() {
    clearInterval(this._checkTokenFaker);
    clearInterval(this._getCountNotificationFaker);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.homeScreen, this.props.homeScreen)) {
      return true;
    }
    if (!_.isEqual(nextProps.translations, this.props.translations)) {
      return true;
    }
    if (!_.isEqual(nextProps.settings, this.props.settings)) {
      return true;
    }
    if (!_.isEqual(nextProps.tabNavigator, this.props.tabNavigator)) {
      return true;
    }
    return false;
  }

  _checkScreen = screen => {
    switch (screen) {
      case "listingStack":
        return listingStack;
      case "eventStack":
        return eventStack;
      case "blogStack":
        return blogStack;
      case "accountStack":
        return accountStack;
      case "pageStack":
        return pageStack;
      case "menuStack":
        return menuStack;
      default:
        return homeStack;
    }
  };

  renderTabItem = ({ tabBarLabel, iconType, iconName }) => () => {
    const { tabNavigator } = this.props;
    // const tabBarListing = tabNavigator
    //   .filter(item => item.screen === "listingStack")
    //   .map(item => item.key);
    return {
      tabBarLabel,
      tabBarIcon: ({ tintColor }) => {
        switch (iconType) {
          case "image":
            return (
              typeof iconName !== "undefined" && (
                <Image
                  source={iconName}
                  style={{ width: 20, height: 20, tintColor: tintColor }}
                />
              )
            );
          default:
            return (
              typeof iconName !== "undefined" && (
                <FontIcon name={iconName} size={22} color={tintColor} />
              )
            );
        }
      }
      // tabBarOnPress: ({ navigation, defaultHandler }) => {
      //   // const parentNavigation = navigation.dangerouslyGetParent();
      //   // const prevRoute =
      //   //   parentNavigation.state.routes[parentNavigation.state.index];
      //   const nextRoute = navigation.state;
      //   const { routeName } = nextRoute;
      //   //   if (isLoggedIn) {
      //   //     defaultHandler();
      //   //   } else {
      //   //     togglePopupLogin();
      //   //   }
      //   // } else {
      //   //   defaultHandler();
      //   // }
      //   defaultHandler();

      //   // AsyncStorage.setItem(
      //   //   "nextKey",
      //   //   tabBarListing.length > 1 ? nextRoute.key : ""
      //   // );
      //   // AsyncStorage.setItem(
      //   //   "prevKey",
      //   //   tabBarListing.length > 1 ? prevRoute.key : ""
      //   // );
      //   // routeName === "ListingScreen" &&
      //   //   AsyncStorage.setItem("postTypeFocus", nextRoute.key);
      // }
    };
  };

  render() {
    const { tabNavigator, settings } = this.props;
    const RootStack = createStackNavigator(
      {
        RootTab: {
          screen: createBottomTabNavigator(
            tabNavigator.length > 0
              ? tabNavigator.reduce((acc, cur) => {
                  return {
                    ...acc,
                    [cur.key]: {
                      screen: this._checkScreen(cur.screen),
                      navigationOptions: this.renderTabItem({
                        tabBarLabel: cur.name,
                        iconType: "font",
                        iconName: cur.iconName
                      })
                    }
                  };
                }, {})
              : {
                  home: {
                    screen: homeStack,
                    navigationOptions: this.renderTabItem({
                      tabBarLabel: " "
                    })
                  }
                },
            rootTabNavOpts(settings.colorPrimary)
          )
        },
        MessageScreen: {
          screen: MessageScreen,
          navigationOptions
        },
        SendMessageScreen: {
          screen: SendMessageScreen,
          navigationOptions
        },
        NotificationsScreen: {
          screen: NotificationsScreen,
          navigationOptions
        },
        SearchScreen: {
          screen: SearchScreen,
          navigationOptions
        },
        ListingSearchResultScreen: {
          screen: ListingSearchResultScreen,
          navigationOptions
        },
        EventSearchResultScreen: {
          screen: EventSearchResultScreen,
          navigationOptions
        },
        ListingDetailScreen: {
          screen: ListingDetailScreen,
          navigationOptions
        },
        CommentListingScreen: {
          screen: CommentListingScreen,
          navigationOptions
        },
        EventDetailScreen: {
          screen: EventDetailScreen,
          navigationOptions
        },
        WebViewScreen: {
          screen: WebViewScreen,
          navigationOptions
        },
        EventDiscussionAllScreen: {
          screen: EventDiscussionAllScreen,
          navigationOptions
        },
        EventCommentDiscussionScreen: {
          screen: EventCommentDiscussionScreen,
          navigationOptions
        },
        ArticleDetailScreen: {
          screen: ArticleDetailScreen,
          navigationOptions
        }
      },
      {
        transitionConfig: getSlideFromRightTransition,
        headerMode: "none"
      }
    );
    return <RootStack {...this.props} />;
  }
}
const mapStateToProps = state => ({
  tabNavigator: state.tabNavigator,
  translations: state.translations,
  settings: state.settings,
  auth: state.auth,
  isTokenExpired: state.isTokenExpired
});
const mapDispatchToProps = {
  getTabNavigator,
  getTranslations,
  getLocations,
  getSettings,
  getHomeScreen,
  checkToken,
  getCountNotificationsRealTimeFaker
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootStack);
