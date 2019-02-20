import React, { PureComponent, Fragment } from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import {
  ImageCircleAndText,
  Button,
  ListItemTouchable,
  ViewWithLoading
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  logout,
  getAccountNav,
  getMyProfile,
  resetMyFavorites,
  getCountNotifications
} from "../../actions";
import { LoginFormContainer } from "../smarts";
import _ from "lodash";
import ImageProgress from "react-native-image-progress";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

class AccountScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.refreshing = false;
  }

  async componentDidMount() {
    try {
      const { auth, getMyProfile, getAccountNav } = this.props;
      const { isLoggedIn } = auth;
      isLoggedIn && getMyProfile();
      isLoggedIn && (await getAccountNav());
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  _handleRefresh = async () => {
    try {
      const { getMyProfile, getAccountNav, auth } = this.props;
      const { isLoggedIn } = auth;
      this.refreshing = true;
      this.forceUpdate();
      isLoggedIn && (await Promise.all([getMyProfile(), getAccountNav()]));
      this.refreshing = false;
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  _getFormLoginStyle = () => {
    const { auth } = this.props;
    const { isLoggedIn } = auth;
    return !isLoggedIn
      ? {
          flex: 1,
          height: SCREEN_HEIGHT - 100,
          backgroundColor: Consts.colorGray2
        }
      : {};
  };

  _renderAvatar = () => {
    const { myProfile } = this.props;
    const _myProfile = Object.values(myProfile).reduce(
      (acc, cur) => ({
        ...acc,
        ...cur
      }),
      {}
    );
    return (
      <Fragment>
        <View
          style={{
            backgroundColor: Consts.colorGray2,
            height: (50 * SCREEN_WIDTH) / 100
          }}
        >
          <ImageProgress
            source={{ uri: _myProfile.cover_image }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%"
            }}
            indicator={ActivityIndicator}
          />
        </View>
        <ImageCircleAndText
          image={_myProfile.avatar}
          title={_myProfile.display_name}
          text={_myProfile.position}
          imageSize={80}
          style={{ marginTop: -40 }}
          styleImage={{ borderWidth: 3, borderColor: "#fff" }}
        />
        <View
          style={{
            height: 20,
            borderBottomWidth: 1,
            borderBottomColor: Consts.colorGray1
          }}
        />
      </Fragment>
    );
  };

  _getNavigateName = endpoint => {
    switch (endpoint) {
      case "get-profile":
        return "ProfileScreen";
      case "get-my-favorites":
        return "FavoritesScreen";
      case "get-my-listings":
        return "MyListingsScreen";
      case "get-my-events":
        return "MyEventsScreen";
      case "get-my-notifications":
        return "NotificationsScreenInAccount";
      case "get-my-messages":
        return "MessageScreenInAccount";
      default:
        return false;
    }
  };

  _handleNavItemPress = (item, text) => _ => {
    const { navigation } = this.props;
    item.endpoint === "get-my-notifications" &&
      this.props.getCountNotifications();
    navigation.navigate(this._getNavigateName(item.endpoint), {
      endpoint: item.endpoint,
      name: text
    });
  };

  _renderNavItem = item => {
    const text = `${item.name} ${
      item.count &&
      item.count !== undefined &&
      item.endpoint !== "get-my-notifications"
        ? `(${item.count})`
        : ""
    }`;
    return (
      <ListItemTouchable
        key={item.name}
        iconName={item.icon}
        text={text}
        onPress={this._handleNavItemPress(item, text)}
      />
    );
  };

  renderContent = () => {
    const {
      navigation,
      auth,
      logout,
      accountNav,
      translations,
      resetMyFavorites
    } = this.props;
    const { isLoggedIn } = auth;
    const { isLoading } = this.state;
    return (
      <View
        style={[
          isLoggedIn ? {} : { padding: 10 },
          { ...this._getFormLoginStyle() }
        ]}
      >
        {!isLoggedIn ? (
          <LoginFormContainer navigation={navigation} />
        ) : (
          <View>
            {this._renderAvatar()}
            <ViewWithLoading
              isLoading={isLoading}
              contentLoader="header"
              contentLoaderItemLength={5}
              gap={0}
            >
              {!_.isEmpty(accountNav) &&
                accountNav
                  .filter(item => item.endpoint !== "get-my-messages")
                  .map(this._renderNavItem)}
              {!_.isEmpty(accountNav) && (
                <ListItemTouchable
                  iconName="user-x"
                  text={translations.logout}
                  onPress={() => {
                    Alert.alert(translations.logout, translations.logoutDesc, [
                      {
                        text: translations.cancel,
                        style: "cancel"
                      },
                      {
                        text: translations.logout,
                        onPress: () => {
                          logout();
                          resetMyFavorites();
                          setTimeout(
                            () =>
                              this._scrollView.scrollTo({
                                x: 0,
                                y: 0,
                                animated: false
                              }),
                            1
                          );
                        }
                      }
                    ]);
                  }}
                  style={{ marginBottom: 20 }}
                />
              )}
            </ViewWithLoading>
          </View>
        )}
      </View>
    );
  };
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollViewRef={c => (this._scrollView = c)}
        refreshControl={
          <RefreshControl
            refreshing={this.refreshing}
            onRefresh={this._handleRefresh}
            tintColor={settings.colorPrimary}
            progressBackgroundColor={Consts.colorGray1}
          />
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  settings: state.settings,
  translations: state.translations,
  accountNav: state.accountNav,
  myProfile: state.myProfile
});

const mapDispatchToProps = {
  logout,
  getAccountNav,
  getMyProfile,
  resetMyFavorites,
  getCountNotifications
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScreen);
