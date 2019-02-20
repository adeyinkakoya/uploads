import { Linking, Platform } from "react-native";

const searcher = str => s => str.search(s) !== -1;

const replacer = str => str.replace(/(\/|\?.*)$/g, "").replace(/^.*\//g, "");

const checkYoutubeTypeAccount = url =>
  searcher(url)("/user/") ? "user" : "chanel";

const getUrl = url => {
  if (searcher(url)("instagram.com")) {
    return {
      ios: `instagram://user?username=${replacer(url)}`,
      android: `intent://instagram.com/_u/${replacer(
        url
      )}/#Intent;package=com.instagram.android;scheme=https;end`,
      browser: url
    };
  } else if (searcher(url)("plus.google.com")) {
    return {
      ios: `gplus://plus.google.com/u/0/${replacer(url)}`,
      android: `gplus://plus.google.com/u/0/${replacer(url)}`,
      browser: url
    };
  } else if (searcher(url)("facebook.com")) {
    return {
      ios: `fb://profile/${replacer(url)}`,
      android: `intent://#Intent;package=com.facebook.katana;scheme=fb://profile/${replacer(
        url
      )};end`,
      browser: url
    };
  } else if (searcher(url)("twitter.com")) {
    return {
      ios: `twitter://user?screen_name=${replacer(url)}`,
      android: `intent://twitter.com/${replacer(
        url
      )}#Intent;package=com.twitter.android;scheme=https;end`,
      browser: url
    };
  } else if (searcher(url)("youtube.com")) {
    return {
      ios: `vnd.youtube://www.youtube.com/${checkYoutubeTypeAccount(
        url
      )}/${replacer(url)}`,
      android: `intent://www.youtube.com/${checkYoutubeTypeAccount(
        url
      )}/${replacer(
        url
      )}#Intent;package=com.google.android.youtube;scheme=https;end`,
      browser: url
    };
  } else if (searcher(url)("pinterest.com")) {
    return {
      ios: `pinterest://user/${replacer(url)}`,
      android: `pinterest://www.pinterest.com/${replacer(url)}`,
      browser: url
    };
  } else {
    return {
      ios: url,
      android: url,
      browser: url
    };
  }
};

export const DeepLinkingSocial = url => {
  Linking.openURL(
    Platform.OS === "ios" ? getUrl(url).ios : getUrl(url).android
  ).catch(err => {
    Linking.openURL(getUrl(url).browser);
  });
};
