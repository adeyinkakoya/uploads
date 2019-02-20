import React, { Component } from "react";
import { View, RefreshControl, FlatList, Dimensions } from "react-native";
import { WithLoading, RequestTimeoutWrapped } from "../../wiloke-elements";
import stylesBase from "../../stylesBase";
import {
  Heading,
  Hero,
  Layout,
  ListingLayoutHorizontal,
  ListingLayoutPopular,
  ListingLayoutCat,
  ListingCat,
  EventItem
} from "../dumbs";
import he from "he";
import { connect } from "react-redux";
import { getHomeScreen, getTabNavigator } from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.refreshing = false;
  }

  _getHomeAPIRequestTimeout = () => {
    this.props.getHomeScreen();
    this.props.getTabNavigator();
  };

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
    if (!_.isEqual(nextProps.auth, this.props.auth)) {
      return true;
    }
    return false;
  }

  _handleRefresh = async () => {
    try {
      this.refreshing = true;
      this.forceUpdate();
      await this.props.getHomeScreen();
      await this.props.getTabNavigator();
      this.refreshing = false;
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  renderHero = (data, index) => (
    <Hero
      key={index.toString()}
      src={data.image_bg}
      title={data.heading}
      text={data.description}
      titleColor={data.heading_color}
      textColor={data.description_color}
      overlayColor={data.overlay_color}
    />
  );

  renderHeading = (data, index) => (
    <View
      key={index.toString()}
      style={[
        stylesBase.bgGray,
        {
          paddingTop: 20,
          paddingHorizontal: 10
        }
      ]}
    >
      <Heading
        title={data.heading}
        text={data.description}
        mb={2}
        titleColor={data.heading_color}
        textColor={data.description_color}
      />
    </View>
  );

  renderListing = (data, orderby, index) => {
    const { navigation, settings } = this.props;
    return (
      <View
        style={[
          stylesBase.bgGray,
          {
            paddingBottom: 20
          }
        ]}
        key={index.toString()}
      >
        {orderby === "best_rated" ? (
          <ListingLayoutPopular
            data={data}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <ListingLayoutHorizontal
            data={data}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        )}
      </View>
    );
  };

  renderCategories = (data, taxonomy, index) => {
    const { navigation } = this.props;
    return (
      <View
        style={[
          stylesBase.bgGray,
          {
            paddingTop: 5,
            paddingBottom: 20
          }
        ]}
        key={index.toString()}
      >
        <ListingLayoutCat
          data={data}
          renderItem={({ item }) => (
            <View style={{ margin: 5 }}>
              <ListingCat
                image={item.oTerm.featuredImg}
                name={he.decode(item.oTerm.name)}
                onPress={() =>
                  navigation.navigate("ListingCategories", {
                    categoryId: item.oTerm.term_id,
                    name: he.decode(item.oTerm.name),
                    taxonomy
                  })
                }
              />
            </View>
          )}
        />
      </View>
    );
  };

  renderEvent = (data, index) => {
    const { translations, navigation } = this.props;
    return (
      <View
        style={[
          stylesBase.bgGray,
          {
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 5
          }
        ]}
        key={index.toString()}
      >
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                style={{ width: SCREEN_WIDTH / 1.8 + 10, paddingHorizontal: 5 }}
              >
                <EventItem
                  image={item.oFeaturedImg.medium}
                  name={he.decode(item.postTitle)}
                  date={
                    item.oCalendar
                      ? `${item.oCalendar.oStarts.date} - ${
                          item.oCalendar.oStarts.hour
                        }`
                      : null
                  }
                  address={he.decode(item.oAddress.address)}
                  hosted={`${translations.hostedBy} ${
                    item.oAuthor.displayName
                  }`}
                  interested={`${item.oFavorite.totalFavorites} ${
                    item.oFavorite.text
                  }`}
                  style={{
                    width: "100%"
                  }}
                  onPress={() =>
                    navigation.navigate("EventDetailScreen", {
                      id: item.ID,
                      name: he.decode(item.postTitle),
                      image:
                        SCREEN_WIDTH > 420
                          ? item.oFeaturedImg.large
                          : item.oFeaturedImg.medium,
                      address: he.decode(item.oAddress.address),
                      hosted: `${translations.hostedBy} ${
                        item.oAuthor.displayName
                      }`,
                      interested: `${item.oFavorite.totalFavorites} ${
                        item.oFavorite.text
                      }`
                    })
                  }
                />
              </View>
            );
          }}
          keyExtractor={item => item.ID.toString()}
          numColumns={1}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  renderContent = () => {
    const { homeScreen, translations, isHomeRequestTimeout } = this.props;
    const ViewWithLoading = WithLoading(View);
    return (
      <RequestTimeoutWrapped
        isTimeout={isHomeRequestTimeout && _.isEmpty(homeScreen)}
        onPress={this._getHomeAPIRequestTimeout}
        fullScreen={true}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading isLoading={homeScreen}>
          {homeScreen.map((section, index) => {
            if (section) {
              switch (section.TYPE) {
                case "HERO":
                  return this.renderHero(section, index);
                case "HEADING":
                  return this.renderHeading(section, index);
                case "LISTINGS":
                  return this.renderListing(
                    section.oResults,
                    section.oSettings.orderby,
                    index
                  );
                case "MODERN_TERM_BOXES":
                  return this.renderCategories(
                    section.oResults,
                    section.oSettings.taxonomy,
                    index
                  );
                case "EVENTS":
                  return this.renderEvent(section.oResults, index);
                default:
                  return false;
              }
            }
          })}
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  };
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        colorPrimary={settings.colorPrimary}
        renderContent={this.renderContent}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
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
  homeScreen: state.homeScreen,
  translations: state.translations,
  isHomeRequestTimeout: state.isHomeRequestTimeout,
  settings: state.settings,
  tabNavigator: state.tabNavigator,
  auth: state.auth
});

const mapDispatchToProps = {
  getHomeScreen,
  getTabNavigator
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
