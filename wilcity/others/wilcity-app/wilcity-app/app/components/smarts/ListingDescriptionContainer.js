import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";
import {
  getListingBoxCustom,
  resetListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
} from "../../actions";
import stylesBase from "../../stylesBase";
import {
  ViewWithLoading,
  ContentBox,
  isEmpty,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import HTMLView from "react-native-htmlview";
import * as Consts from "../../constants/styleConstants";

class ListingDescriptionContainer extends Component {
  state = {
    isLoading: true
  };

  _getListingDescription = async () => {
    try {
      const {
        params,
        getListingDescription,
        getListingBoxCustom,
        type
      } = this.props;
      const { id, item, max } = params;
      type === null &&
        (await (item.key === "content"
          ? getListingDescription(id, item.key, max)
          : getListingBoxCustom(id, item.key, max)));
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListingDescription();
  }

  componentWillUnmount() {
    this.props.resetListingBoxCustom();
  }

  renderContent = (id, item, isLoading, descriptions, type) => {
    const {
      isListingDetailDesRequestTimeout,
      translations,
      settings
    } = this.props;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(descriptions) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="file-text"
            style={{ marginBottom: type !== "all" ? 10 : 50 }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item.key)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailDesRequestTimeout}
              onPress={this._getListingDescription}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              {descriptions[0].search(/<(img|div|p|span|strong|i|a)/g) !==
              -1 ? (
                <HTMLView
                  value={`<div>${descriptions[0].replace(
                    /<img/g,
                    "\n<img"
                  )}</div>`}
                  stylesheet={htmlViewStyles}
                />
              ) : (
                <Text style={stylesBase.text}>
                  {he.decode(descriptions[0])}
                </Text>
              )}
            </RequestTimeoutWrapped>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (listingId, key) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingDescription,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingDescription(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingCustomBox,
      listingDescription,
      listingDescriptionAll,
      loadingListingDetail,
      type,
      params
    } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          loadingListingDetail,
          item.key === "content"
            ? listingDescriptionAll
            : listingCustomBox[item.key],
          "all"
        )
      : this.renderContent(
          id,
          item,
          isLoading,
          item.key === "content"
            ? listingDescription
            : listingCustomBox[item.key]
        );
  }
}

const htmlViewStyles = StyleSheet.create({
  div: {
    fontSize: 13,
    color: Consts.colorDark2,
    lineHeight: 19
  },
  a: {
    textDecorationLine: "underline"
  },
  blockquote: {
    fontSize: 14,
    fontStyle: "italic",
    color: Consts.colorDark3,
    marginVertical: 10
  },
  strong: {
    display: "flex"
  }
});

const mapStateToProps = state => ({
  translations: state.translations,
  listingCustomBox: state.listingCustomBox,
  listingDescription: state.listingDescription,
  listingDescriptionAll: state.listingDescriptionAll,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailDesRequestTimeout: state.isListingDetailDesRequestTimeout,
  settings: state.settings
});

const mapDispatchToProps = {
  getListingBoxCustom,
  resetListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDescriptionContainer);
