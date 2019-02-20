import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { FontIcon } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

const Icon = props => {
  const { size, borderRadius, name, fontSize, color, backgroundColor } = props;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderRadius,
        backgroundColor
      }}
    >
      <FontIcon name={name} size={fontSize} color={color} />
    </View>
  );
};
Icon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string
};
Icon.defaultProps = {
  size: 36,
  borderRadius: 2,
  fontSize: 14,
  color: Consts.colorDark2,
  backgroundColor: Consts.colorGray1
};

export default Icon;
