import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes } from "react-native";

const MAX_COLUMN = 6;
export const Row = props => (
  <View
    {...props}
    style={[
      {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        margin: -props.gap / 2,
        marginVertical: -props.gapVertical / 2,
        marginHorizontal: -props.gapHorizontal / 2
      },
      props.style
    ]}
  >
    {props.children}
  </View>
);
Row.defaultProps = {
  gap: 10
};
Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.bool
  ]),
  gap: PropTypes.number,
  style: ViewPropTypes.style
};

export const Col = props => (
  <View
    {...props}
    style={[
      {
        width: `${100 / props.column}%`,
        padding: props.gap / 2,
        paddingVertical: props.gapVertical / 2,
        paddingHorizontal: props.gapHorizontal / 2
      },
      props.style
    ]}
  >
    {props.children}
  </View>
);
Col.defaultProps = {
  column: 1,
  gap: 10
};
Col.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.bool
  ]),
  column: PropTypes.number,
  gap: PropTypes.number,
  style: ViewPropTypes.style
};
