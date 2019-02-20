import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import {
  ViewWithLoading,
  ImageCircleAndText,
  LoadingFull,
  Toast,
  MessageError
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  getMyNotifications,
  getMyNotificationsLoadmore,
  deleteMyNotifications
} from "../../actions";
import _ from "lodash";
import he from "he";
import Swipeout from "react-native-swipeout";
import { Feather } from "@expo/vector-icons";

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class NotificationsScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    isDeleteLoading: false,
    startLoadmore: false
  };

  _getMyNotifications = async _ => {
    await this.setState({ isLoading: true });
    await this.props.getMyNotifications();
    this.setState({ isLoading: false, startLoadmore: true });
  };

  componentDidMount() {
    this._getMyNotifications();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!_.isEqual(nextProps.myNotifications, this.props.myNotifications)) {
  //     return true;
  //   }
  //   if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
  //     return true;
  //   }
  //   if (!_.isEqual(nextState.isScrollEnabled, this.state.isScrollEnabled)) {
  //     return true;
  //   }
  //   if (!_.isEqual(nextState.isDeleteLoading, this.state.isDeleteLoading)) {
  //     return true;
  //   }
  //   return false;
  // }

  _handleListItem = item => _ => {
    const { navigation } = this.props;
    navigation.navigate("SendMessageScreen", {
      uid: item.uid,
      name: item.name
    });
  };

  _deleteListItem = ID => async _ => {
    const { translations, deleteMyNotificationError } = this.props;
    await this.setState({ isDeleteLoading: true });
    await this.props.deleteMyNotifications(ID);
    this.setState({ isDeleteLoading: false });
    !!deleteMyNotificationError &&
      setTimeout(
        () => this._toast.show(translations[deleteMyNotificationError], 3000),
        500
      );
  };

  _handleEndReached = next => {
    const { startLoadmore } = this.state;
    const { getMyNotificationsLoadmore } = this.props;
    !!next && startLoadmore && getMyNotificationsLoadmore(next);
  };

  renderItem = ({ item }) => {
    const { translations } = this.props;
    return (
      <Swipeout
        right={[
          {
            text: translations.delete,
            type: "delete",
            onPress: () => {
              Alert.alert(
                translations.delete,
                translations.confirmDeleteNotification,
                [
                  {
                    text: translations.cancel,
                    style: "cancel"
                  },
                  {
                    text: translations.ok,
                    onPress: this._deleteListItem(item.ID)
                  }
                ],
                { cancelable: false }
              );
            }
          }
        ]}
        autoClose={true}
        scroll={event => this.setState({ isScrollEnabled: event })}
        style={{
          borderBottomWidth: 1,
          borderColor: Consts.colorGray1,
          backgroundColor: "#fff"
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleListItem(item)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 10
          }}
        >
          <ImageCircleAndText
            image={"https://uinames.com/api/photos/male/16.jpg"}
            title={item.name}
            message={item.message}
            time={item.time}
            horizontal={true}
            messageNumberOfLines={1}
            imageSize={44}
          />
        </TouchableOpacity>
      </Swipeout>
    );
  };

  renderContent = () => {
    const { myNotifications, translations } = this.props;
    const { oResults, next, status, msg } = myNotifications;
    const { isLoading, isDeleteLoading, startLoadmore } = this.state;
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="headerAvatar"
        avatarSize={44}
        contentLoaderItemLength={10}
        gap={0}
      >
        <FlatList
          data={[
            {
              uid: 1,
              name: "Arthur Soto",
              message: "It is a long established fact",
              time: "06:00"
            },
            {
              uid: 2,
              name: "Brenda Daniels",
              message: "That it has a more-or-less",
              time: "06:00"
            },
            {
              uid: 3,
              name: "Wayne Russell",
              message: "Various versions have evolved",
              time: "06:00"
            },
            {
              uid: 4,
              name: "Patricia Peterson",
              message: "It is a long established fact",
              time: "06:00"
            },
            {
              uid: 5,
              name: "Joe Mitchell",
              message: "That it has a more-or-less",
              time: "06:00"
            }
          ]}
          renderItem={this.renderItem}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={this.state.isScrollEnabled}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(next)}
          ListFooterComponent={() => {
            return (
              <View>
                {!!next &&
                  status === "success" &&
                  startLoadmore && (
                    <ViewWithLoading
                      isLoading={true}
                      contentLoader="headerAvatar"
                      avatarSize={44}
                      contentLoaderItemLength={1}
                      gap={0}
                    />
                  )}

                {status === "error" && (
                  <MessageError message={translations[msg]} />
                )}
                <View style={{ height: 30 }} />
              </View>
            );
          }}
        />
        <LoadingFull visible={isDeleteLoading} />
        <Toast ref={c => (this._toast = c)} />
      </ViewWithLoading>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("SearchScreen")}
            style={{ width: 25, alignItems: "flex-end" }}
          >
            <Feather name="edit" size={20} color={settings.colorPrimary} />
          </TouchableOpacity>
        )}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: "#fff"
        }}
        tintColor={Consts.colorDark1}
        colorPrimary={Consts.colorGray2}
        statusBarStyle="dark-content"
      />
    );
  }
}

const mapStateToProps = state => ({
  myNotifications: state.myNotifications,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth,
  deleteMyNotificationError: state.deleteMyNotificationError
});

const mapDispatchToProps = {
  getMyNotifications,
  deleteMyNotifications,
  getMyNotificationsLoadmore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsScreen);

// const MessageScreen = props => {
//   const { navigation, translations, settings } = props;
//   return (
//     <Layout
//       navigation={navigation}
//       headerType="headerHasBack"
//       title={translations.messages}
//       goBack={() => navigation.goBack()}
//       renderContent={this.renderContent}
//       renderRight={() => (
//         <TouchableOpacity
//           activeOpacity={0.5}
//           onPress={() => navigation.navigate("SearchScreen")}
//           style={{ width: 25, alignItems: "flex-end" }}
//         >
//           <Feather name="edit" size={20} color={settings.colorPrimary} />
//         </TouchableOpacity>
//       )}
//       scrollViewEnabled={false}
//       scrollViewStyle={{
//         backgroundColor: "#fff"
//       }}
//       tintColor={Consts.colorDark1}
//       colorPrimary={Consts.colorGray2}
//       statusBarStyle="dark-content"
//       contentHeight={CONTENT_HEIGHT}
//     />
//   );
// };
// const mapStateToProps = state => ({
//   settings: state.settings,
//   translations: state.translations
// });
// export default connect(mapStateToProps)(MessageScreen);
