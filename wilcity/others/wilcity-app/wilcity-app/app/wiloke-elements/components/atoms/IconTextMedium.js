import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { FontIcon } from "../../";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";
import he from "he";

export default class IconTextMedium extends PureComponent {
  static propTypes = {
    iconSize: PropTypes.number,
    texNumberOfLines: PropTypes.number,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    text: PropTypes.string,
    iconBackgroundColor: PropTypes.string
  };
  static defaultProps = {
    iconSize: 36,
    iconName: "map",
    iconColor: Consts.colorDark2,
    iconBackgroundColor: Consts.colorGray2
  };
  render() {
    const {
      iconSize,
      texNumberOfLines,
      iconName,
      iconColor,
      textStyle,
      text,
      iconBackgroundColor
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          { paddingLeft: iconSize, minHeight: iconSize }
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
              backgroundColor: iconBackgroundColor
            }
          ]}
        >
          <FontIcon
            name={iconName}
            size={iconSize * (18 / 36)}
            color={iconColor}
          />
        </View>
        <Text
          style={[
            {
              fontSize: 12,
              color: Consts.colorDark2,
              marginLeft: 8
            },
            textStyle
          ]}
          numberOfLines={texNumberOfLines}
        >
          {he.decode(text)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    width: "100%"
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0
  }
});
