import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Platform,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import * as Consts from "../../constants/styleConstants";
import {
  ActionSheet,
  Row,
  Col,
  Modal,
  bottomBarHeight,
  P,
  InputMaterial,
  ModalPicker,
  Toast
} from "../../wiloke-elements";
import { ParallaxListingScreen } from "../dumbs";
import {
  ListingDescriptionContainer,
  ListingListFeatureContainer,
  ListingPhotosContainer,
  ListingReviewsContainer,
  ListingDetailNavContainer,
  ListingEventsContainer,
  ListingVideosContainer,
  ListingSidebarContainer,
  AverageDetailReviewContainer
} from "../smarts";
import {
  getListingDetail,
  addMyFavorites,
  getReportForm,
  postReport
} from "../../actions";
import _ from "lodash";

class ListingDetailScreen extends Component {
  state = {
    isReviews: true,
    isVisibleReport: false,
    report: {}
  };
  async componentDidMount() {
    const { navigation, getListingDetail, getReportForm } = this.props;
    const { params } = navigation.state;
    getReportForm();
    await getListingDetail(params.id);
    const { listingDetail } = this.props;
    this.setState({
      isReviews:
        typeof listingDetail.oHomeSections !== "undefined" &&
        Object.keys(listingDetail.oHomeSections).length > 0 &&
        Object.keys(listingDetail.oHomeSections).filter(
          item => listingDetail.oHomeSections[item].category === "reviews"
        ).length > 0
    });
  }

  componentDidUpdate() {
    const { scrollTo } = this.props;
    setTimeout(
      () =>
        this._scrollView
          .getNode()
          .scrollTo({ x: 0, y: scrollTo, animated: false }),
      1
    );
  }

  _hide = key => {
    if (key) {
      return {};
    }
    return {
      opacity: 0,
      display: "none"
      // position: "absolute",
      // bottom: "100%",
      // zIndex: -999
    };
  };

  renderHeaderLeft = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather name="chevron-left" size={26} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <Text style={{ color: "#fff" }} numberOfLines={1}>
        {params.name}
      </Text>
    );
  };

  _actionSheetMoreOptions = () => {
    return {
      // options: ["Cancel", "Remove", "Report", "Write a review"],
      options: ["Cancel", "Report"],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      onPressButtonItem: () => {
        console.log("press");
      },
      onAction: buttonIndex => {
        switch (buttonIndex) {
          // case 1:
          //   return false;
          case 1:
            this.setState({ isVisibleReport: true });
          default:
            break;
        }
      }
    };
  };

  renderHeaderRight = () => {
    return (
      <ActionSheet
        {...this._actionSheetMoreOptions()}
        renderButtonItem={() => (
          <View
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Feather name="more-horizontal" size={24} color="#fff" />
          </View>
        )}
      />
    );
  };

  _handleShare = () => {
    const { navigation } = this.props;
    const { link } = navigation.state.params;
    Share.share(
      {
        ...Platform.select({
          ios: {
            message: "",
            url: link
          },
          android: {
            message: link
          }
        }),
        title: "Wow, did you see that?"
      }
      // {
      //   ...Platform.select({
      //     ios: {
      //       // iOS only:
      //       excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"]
      //     },
      //     android: {
      //       // Android only:
      //       dialogTitle: "Share : " + "this.props.title"
      //     }
      //   })
      // }
    );
  };

  _handleAddFavorite = () => {
    const { navigation, addMyFavorites } = this.props;
    const { id } = navigation.state.params;
    addMyFavorites(id);
  };

  _renderReportFormItem = (item, index) => {
    const { settings, translations } = this.props;
    switch (item.type) {
      case "text":
        return (
          <InputMaterial
            key={item.key}
            placeholder={item.label}
            colorPrimary={settings.colorPrimary}
            onChangeText={text => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: text
                }
              });
            }}
          />
        );
      case "select":
        return (
          <ModalPicker
            key={item.key}
            label={item.label}
            options={item.options}
            cancelText={translations.cancel}
            matterial={true}
            colorPrimary={settings.colorPrimary}
            onChangeOptions={(name, isChecked) => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: isChecked.length > 0 ? isChecked[0].id : ""
                }
              });
            }}
          />
        );
      case "textarea":
        return (
          <InputMaterial
            key={item.key}
            placeholder={item.label}
            multiline={true}
            numberOfLines={4}
            colorPrimary={settings.colorPrimary}
            onChangeText={text => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: text
                }
              });
            }}
          />
        );
      default:
        return false;
    }
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  renderActions = () => {
    const {
      navigation,
      listIdPostFavorites,
      listIdPostFavoritesRemoved,
      settings,
      translations,
      reportForm,
      listingDetail,
      auth
    } = this.props;
    const { isLoggedIn } = auth;
    const { id } = navigation.state.params;
    const listIdPostFavoritesFilter = listIdPostFavorites.filter(
      item => item.id === id
    );
    const isListingFavorite =
      !_.isEmpty(listingDetail) && listingDetail.oFavorite.isMyFavorite;
    const condition =
      listIdPostFavoritesFilter.length > 0 ||
      (listIdPostFavoritesFilter.length > 0 &&
        !_.isEmpty(listingDetail) &&
        isListingFavorite) ||
      (listIdPostFavoritesRemoved.length === 0 && isListingFavorite);
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Consts.colorGray1,
          paddingVertical: 15,
          paddingBottom: 15,
          backgroundColor: "#fff",
          marginBottom: 10,
          marginTop: -10,
          marginHorizontal: -10
        }}
      >
        <Row>
          <Col column={4}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={
                isLoggedIn ? this._handleAddFavorite : this._handleAccountScreen
              }
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Feather
                name="heart"
                size={22}
                color={condition ? Consts.colorQuaternary : Consts.colorDark3}
              />
              <View style={{ height: 4 }} />
              <Text
                style={{
                  color: condition ? Consts.colorQuaternary : Consts.colorDark2,
                  fontSize: 12
                }}
              >
                {translations.favorite}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col column={4}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this._handleShare}
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Feather name="share" size={22} color={Consts.colorDark3} />
              <View style={{ height: 4 }} />
              <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                {translations.share}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col column={4}>
            <Modal
              isVisible={this.state.isVisibleReport}
              headerIcon="alert-triangle"
              headerTitle="Report"
              colorPrimary={settings.colorPrimary}
              cancelText={translations.cancel}
              submitText={translations.submit}
              onBackdropPress={() => this.setState({ isVisibleReport: false })}
              renderButtonTextToggle={() => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Feather
                    name="alert-triangle"
                    size={22}
                    color={Consts.colorDark3}
                  />
                  <View style={{ height: 4 }} />
                  <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                    {translations.report}
                  </Text>
                </View>
              )}
              onSubmitAsync={async () => {
                await this.props.postReport(id, this.state.report);
                setTimeout(() => {
                  this._toast.show(this.props.reportMessage, 3000);
                }, 500);
              }}
            >
              <View>
                {!_.isEmpty(reportForm) && (
                  <View>
                    <P>{reportForm.description}</P>
                    {!_.isEmpty(reportForm.aFields) &&
                      reportForm.aFields.map(this._renderReportFormItem)}
                  </View>
                )}
              </View>
            </Modal>
          </Col>
          <Col column={4}>
            <ActionSheet
              {...this._actionSheetMoreOptions()}
              renderButtonItem={() => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Feather
                    name="more-horizontal"
                    size={22}
                    color={Consts.colorDark3}
                  />
                  <View style={{ height: 4 }} />
                  <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                    {translations.more}
                  </Text>
                </View>
              )}
            />
          </Col>
        </Row>
      </View>
    );
  };

  renderDescription = type => (id, item, max) => (
    <ListingDescriptionContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderListFeatures = type => (id, item, max) => (
    <ListingListFeatureContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderPhotos = type => (id, item, max) => (
    <ListingPhotosContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderReviews = type => (id, item, max) => {
    const { navigation, settings, listingDetail } = this.props;
    const { isReviews } = this.state;
    const isAverage =
      !_.isEmpty(listingDetail.oReview) && listingDetail.oReview.average !== 0;
    return (
      <View key={item.key}>
        {isReviews && isAverage && type !== null && this.renderAverageRating()}
        {/* {type !== null && (
          <View style={{ marginBottom: 10 }}>
            <Button
              size="lg"
              block={true}
              backgroundColor="primary"
              style={{
                paddingVertical: 0,
                height: 50,
                justifyContent: "center"
              }}
              onPress={() => {}}
            >
              Add a review
            </Button>
          </View>
        )} */}
        <ListingReviewsContainer
          navigation={navigation}
          params={{ id, item, max }}
          type={type}
          colorPrimary={settings.colorPrimary}
        />
      </View>
    );
  };

  renderEvents = type => (id, item, max) => {
    const { navigation } = this.props;
    return (
      <ListingEventsContainer
        key={item.key}
        navigation={navigation}
        params={{ id, item, max }}
        type={type}
      />
    );
  };

  renderVideos = type => (id, item, max) => (
    <ListingVideosContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  _checkRenderDetailBox = (id, item, index) => {
    const { category, maximumItemsOnHome: max } = item;
    switch (category) {
      case "content":
      case "text":
        return this.renderDescription(null)(id, item, max);
      case "tags":
      case "boxIcon":
        return this.renderListFeatures(null)(id, item, max);
      case "photos":
        return this.renderPhotos(null)(id, item, max);
      case "reviews":
        return this.renderReviews(null)(id, item, max);
      case "events":
        return this.renderEvents(null)(id, item, max);
      case "videos":
        return this.renderVideos(null)(id, item, max);
      default:
        return false;
    }
  };

  _checkRenderTabContent = (item, index) => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { id } = params;
    switch (item.category) {
      case "home":
        return this.renderDetailHomeContent();
      case "content":
      case "text":
        return this.renderDescription("all")(id, item, null);
      case "tags":
      case "boxIcon":
        return this.renderListFeatures("all")(id, item, null);
      case "photos":
        return this.renderPhotos("all")(id, item, null);
      case "reviews":
        return this.renderReviews("all")(id, item, null);
      case "videos":
        return this.renderVideos("all")(id, item, null);
      case "events":
        return this.renderEvents("all")(id, item, null);
      default:
        return false;
    }
  };

  renderAverageRating = () => {
    const { translations } = this.props;
    return <AverageDetailReviewContainer />;
  };

  renderDetailHomeContent = () => {
    const { navigation, listingDetail } = this.props;
    const { params } = navigation.state;
    const { id } = params;
    const { isReviews } = this.state;
    const isAverage =
      !_.isEmpty(listingDetail.oReview) && listingDetail.oReview.average !== 0;
    return (
      <View>
        {isReviews && isAverage && this.renderAverageRating()}
        {typeof listingDetail.oHomeSections !== "undefined" &&
          Object.keys(listingDetail.oHomeSections).length > 0 &&
          Object.keys(listingDetail.oHomeSections).map((item, index) => {
            const _item = listingDetail.oHomeSections[item];
            return this._checkRenderDetailBox(id, _item, index);
          })}
        <ListingSidebarContainer
          listingId={params.id}
          navigation={navigation}
        />
      </View>
    );
  };

  renderContent = () => {
    const { listingDetailNav } = this.props;
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: Consts.colorGray2,
          marginBottom: bottomBarHeight
        }}
      >
        {this.renderActions()}
        <Toast ref={c => (this._toast = c)} />

        {listingDetailNav.length > 0 &&
          listingDetailNav.map((item, index) => (
            <View
              key={index.toString()}
              style={this._hide(item.current && true)}
            >
              {this._checkRenderTabContent(item, index)}
            </View>
          ))}
      </View>
    );
  };

  renderNavigation = () => {
    const { navigation, translations, listingDetail, settings } = this.props;
    const { params } = navigation.state;
    const itemFirst = [
      {
        name: translations.home,
        category: "home",
        key: "home",
        icon: "home",
        current: true,
        loaded: true
      }
    ];
    const navArr =
      typeof listingDetail.oNavigation !== "undefined"
        ? Object.values(listingDetail.oNavigation).map(item => ({
            name: item.name,
            category: item.category,
            key: item.key,
            icon: item.icon,
            current: false,
            loaded: false
          }))
        : [];
    const newData = [...itemFirst, ...navArr];
    return (
      <ListingDetailNavContainer
        data={newData}
        listingId={params.id}
        colorPrimary={settings.colorPrimary}
      />
    );
  };

  render() {
    const { navigation, settings } = this.props;
    const { params } = navigation.state;
    return (
      <ParallaxListingScreen
        scrollViewRef={ref => (this._scrollView = ref)}
        headerImageSource={params.image}
        logo={params.logo}
        title={params.name}
        tagline={params.tagline ? params.tagline : null}
        renderNavigation={this.renderNavigation}
        overlayRange={[0, 1]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderCenter={this.renderHeaderCenter}
        renderHeaderRight={this.renderHeaderRight}
        renderContent={this.renderContent}
        navigation={navigation}
      />
    );
  }
}

const mapStateToProps = state => ({
  listingDetailNav: state.listingDetailNav,
  listingDetail: state.listingDetail,
  translations: state.translations,
  scrollTo: state.scrollTo,
  settings: state.settings,
  listIdPostFavorites: state.listIdPostFavorites,
  listIdPostFavoritesRemoved: state.listIdPostFavoritesRemoved,
  reportForm: state.reportForm,
  auth: state.auth,
  reportMessage: state.reportMessage
});

const mapDispatchToProps = {
  getListingDetail,
  addMyFavorites,
  getReportForm,
  postReport
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDetailScreen);
