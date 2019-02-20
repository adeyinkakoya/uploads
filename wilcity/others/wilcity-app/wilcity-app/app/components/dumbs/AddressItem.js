import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, ViewPropTypes, Modal } from "react-native";
import { IconTextMedium } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

export const AddressItem = props => {
  const { address, navigation, style, iconColor, iconBackgroundColor } = props;
  const { name } = navigation.state.params;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={_ => {
        navigation.navigate("WebViewScreen", {
          url: {
            title: name,
            description: address.address,
            lat: address.lat,
            lng: address.lng
          }
        });
      }}
      style={style}
    >
      <IconTextMedium
        iconName="map-pin"
        iconSize={30}
        iconColor={iconColor}
        iconBackgroundColor={iconBackgroundColor}
        text={address.address}
      />
    </TouchableOpacity>
  );
};
AddressItem.propTypes = {
  address: PropTypes.object,
  style: ViewPropTypes.style
};
AddressItem.defaultProps = {
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorSecondary
};
