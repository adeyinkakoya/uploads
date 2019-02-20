import React, { Component } from "react";
import { View } from "react-native";
import { FontIcon, P } from "../../";
import * as Consts from "../../../constants/styleConstants";

export const AlertError = props => {
  return (
    <View style={[{ flexDirection: "row" }, props.style]}>
      <View style={{ marginRight: 10 }}>
        <FontIcon
          name="alert-triangle"
          size={16}
          color={Consts.colorQuaternary}
        />
      </View>
      <P style={{ color: Consts.colorQuaternary }}>{props.text}</P>
    </View>
  );
};
