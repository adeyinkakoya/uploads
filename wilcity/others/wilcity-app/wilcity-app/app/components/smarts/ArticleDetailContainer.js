import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getArticleDetail } from "../../actions";
import { isEmpty, ViewWithLoading, IconTextSmall } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import HTMLView from "react-native-htmlview";

class EventDetailContainer extends PureComponent {
  state = {
    isLoading: true
  };

  _getArticleDetail = async () => {
    try {
      const { navigation } = this.props;
      const { params } = navigation.state;
      await this.props.getArticleDetail(params.id);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getArticleDetail();
  }

  renderMeta = () => {
    const { articleDetail, translations, settings } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingTop: 8,
          backgroundColor: "#fff"
        }}
      >
        <IconTextSmall
          iconName="calendar"
          text={articleDetail.postDate}
          iconSize={14}
          textSize={12}
          iconColor={settings.colorPrimary}
        />
        <View style={{ width: 10 }} />
        <IconTextSmall
          iconName="message-square"
          text={`${articleDetail.countComments} ${translations.comments}`}
          iconSize={14}
          textSize={12}
          iconColor={settings.colorPrimary}
        />
      </View>
    );
  };

  render() {
    const { articleDetail } = this.props;
    const { isLoading } = this.state;
    console.log(articleDetail.postContent);
    return (
      <View
        style={{
          marginHorizontal: -10
        }}
      >
        <ViewWithLoading isLoading={isLoading} contentLoader="content">
          {this.renderMeta()}
          {!isEmpty(articleDetail) && (
            <View style={{ padding: 10, backgroundColor: "#fff" }}>
              <HTMLView
                value={`<div>${articleDetail.postContent.replace(
                  /<img/g,
                  "\n\n<img"
                )}</div>`}
                stylesheet={styles}
              />
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  articleDetail: state.articleDetail,
  translations: state.translations,
  settings: state.settings
});

const mapDispatchToProps = {
  getArticleDetail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailContainer);
