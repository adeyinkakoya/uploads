import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ViewPropTypes,
  Keyboard,
  ScrollView,
  Platform,
  StyleSheet
} from "react-native";

/**
 * Constants
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IOS = Platform.OS === "ios";

/**
 * Create Component InputAccessoryLayoutFullScreen
 */
export default class InputAccessoryLayoutFullScreen extends Component {
  /**
   * Prop Types
   */
  static propTypes = {
    renderHeader: PropTypes.func,
    renderContent: PropTypes.func.isRequired,
    renderInputAccessory: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
    keyboardDismissMode: PropTypes.oneOf(["none", "on-drag"])
  };

  /**
   * Default Props
   */
  static defaultProps = {
    renderHeader: () => {}
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      isKeyboardOpened: false,
      keyboardHeight: 0,
      headerHeight: 0,
      inputHeight: 0,
      contentHeight: 1,
      layoutHeight: 0,
      targetContentOffsetY: 0
    };

    if (IOS) {
      this.keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardHide
      );
    } else {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  /**
   * Keyboard Listener For Android
   */
  componentDidMount() {
    if (!IOS) {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardHide
      );
    }
  }

  /**
   * Configure for LayoutAnimation
   * @param {*event KeyBoard} event
   */
  _configureLayoutAnimation = event => {
    return LayoutAnimation.configureNext({
      duration: IOS ? event.duration : 300,
      create: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut
      }
    });
  };

  /**
   * Event Keyboard Show
   * @param {*event KeyBoard} event
   */
  _keyboardShow = event => {
    const { contentHeight, layoutHeight, targetContentOffsetY } = this.state;
    const isBottom =
      Math.floor(contentHeight - layoutHeight) ===
      Math.floor(targetContentOffsetY);
    this._configureLayoutAnimation(event);
    this.setState(
      {
        keyboardHeight: IOS
          ? event.startCoordinates.height
          : event.endCoordinates.height,
        isKeyboardOpened: true
      },
      () => {
        isBottom &&
          setTimeout(() => this._scrollView.scrollToEnd({ animated: true }), 0);
      }
    );
  };

  /**
   * Event Keyboard Hide
   * @param {*event KeyBoard} event
   */
  _keyboardHide = event => {
    const { keyboardHeight } = this.state;
    this._configureLayoutAnimation(event);
    this.setState({
      keyboardHeight: 0,
      isKeyboardOpened: false
    });
  };

  /**
   * Get header height
   * @param {*event Header component} event
   */
  _getHeaderHeight = event => {
    this.setState({ headerHeight: event.nativeEvent.layout.height });
  };

  /**
   * Get input wrapper height
   * @param {*event Input wrapper} event
   */
  _getInputHeight = event => {
    this.setState({ inputHeight: event.nativeEvent.layout.height });
  };

  /**
   * Get contentHeight, layoutHeight, targetContentOffsetY
   * @param {*event ScrollView Component} event
   */
  _handleScrollEndDrag = event => {
    const { nativeEvent } = event;
    this.setState({
      contentHeight: nativeEvent.contentSize.height,
      layoutHeight: nativeEvent.layoutMeasurement.height,
      targetContentOffsetY: IOS
        ? nativeEvent.targetContentOffset.y
        : nativeEvent.contentOffset.y
    });
  };

  /**
   * Remove KeyBoard Listener
   */
  componentWillUnmount() {
    if (IOS) {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    } else {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  /**
   * Update Scroll (ScrollView Component)
   * @param {*Previous props} prevProps
   * @param {*Previous state} prevState
   * @param {*} snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      contentHeight,
      layoutHeight,
      targetContentOffsetY,
      inputHeight
    } = this.state;
    const isBottom =
      Math.floor(contentHeight - layoutHeight) ===
      Math.floor(targetContentOffsetY);
    const isIncrementInputHeight = prevState.inputHeight < inputHeight;
    if (isBottom && isIncrementInputHeight) {
      setTimeout(() => this._scrollView.scrollToEnd({ animated: false }), 0);
    }
  }

  /**
   * Render Header
   */
  renderHeader() {
    return (
      <View
        style={styles.header}
        renderToHardwareTextureAndroid={true}
        onLayout={this._getHeaderHeight}
      >
        {this.props.renderHeader()}
      </View>
    );
  }

  /**
   * Render Content
   */
  renderContent() {
    const { keyboardHeight, inputHeight, headerHeight } = this.state;
    const { keyboardDismissMode, renderContent } = this.props;
    return (
      <View style={styles.content}>
        <ScrollView
          ref={ref => (this._scrollView = ref)}
          keyboardDismissMode={keyboardDismissMode}
          keyboardShouldPersistTaps="always"
          onScrollEndDrag={this._handleScrollEndDrag}
          renderToHardwareTextureAndroid={true}
          style={[
            styles.content,
            {
              height:
                SCREEN_HEIGHT - inputHeight - headerHeight - keyboardHeight
            }
          ]}
        >
          {renderContent()}
        </ScrollView>
      </View>
    );
  }

  /**
   * Render Input Accessory
   */
  renderInputAccessory() {
    const { keyboardHeight } = this.state;
    return (
      <View
        style={[styles.input, { bottom: keyboardHeight }]}
        renderToHardwareTextureAndroid={true}
        onLayout={this._getInputHeight}
      >
        {this.props.renderInputAccessory()}
      </View>
    );
  }

  /**
   * Render Component
   */
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderInputAccessory()}
      </View>
    );
  }
}

/**
 * Style for component
 */
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 99999,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff"
  },
  header: {
    position: "relative",
    zIndex: 9
  },
  content: {
    position: "relative"
  },
  input: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9
  }
});
