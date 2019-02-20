import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { Button, P, ViewWithLoading } from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  login,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import { Form } from "../dumbs";
import _ from "lodash";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class LoginFormContainer extends Component {
  static propTypes = {
    // onPressRegister: PropTypes.func
  };
  static defaultProps = {
    // onPressRegister: () => {}
  };
  state = {
    formTypeFocus: "login",
    animation: new Animated.Value(0),
    isLoading: true
  };

  async componentDidMount() {
    await this.props.getSignUpForm();
    this.setState({ isLoading: false });
  }

  _handleLogin = async (results, status) => {
    const { login, getAccountNav, getMyProfile } = this.props;
    await login(results);
    getAccountNav();
    getMyProfile();
  };

  _handleRegister = async (results, status) => {
    const {
      register,
      getAccountNav,
      getMyProfile
    } = this.props;
    status === "success" && (await register(results));
    getAccountNav();
    getMyProfile();
  };

  _handleTab = type => async () => {
    Animated.timing(this.state.animation, {
      toValue:
        type === "login" ? 10 - (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) : 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        formTypeFocus: type
      });
    });
  };

  _renderFormLogin() {
    const { settings, loginError, translations } = this.props;
    return (
      <View style={{ width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20 }}>
        <Form
          headerTitle={translations.login}
          headerIcon="lock"
          colorPrimary={settings.colorPrimary}
          validationData={translations.validationData}
          renderTopComponent={() =>
            loginError && (
              <P style={{ color: Consts.colorQuaternary }}>
                {translations[loginError]}
              </P>
            )
          }
          data={[
            {
              type: "text",
              name: "username",
              label: translations.username,
              required: true,
              validationType: "username"
            },
            {
              type: "password",
              name: "password",
              label: translations.password
            }
          ]}
          renderButtonSubmit={(results, status) => {
            const { isLoginLoading } = this.props;
            return (
              <View>
                <Button
                  backgroundColor="primary"
                  colorPrimary={settings.colorPrimary}
                  size="lg"
                  radius="round"
                  block={true}
                  isLoading={isLoginLoading}
                  onPress={async () => this._handleLogin(results, status)}
                >
                  {translations.login}
                </Button>
                {settings.isAllowRegistering === "yes" && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this._handleTab("login")}
                    style={{ alignItems: "center", marginTop: 15 }}
                  >
                    <P>{translations.register}</P>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      </View>
    );
  }

  _renderFormRegister() {
    const { settings, translations, signUpForm, signupError } = this.props;
    const _signUpForm =
      !_.isEqual(signUpForm) &&
      signUpForm.map(item => ({
        type: item.type,
        label: !!translations[item.label]
          ? translations[item.label]
          : item.label,
        name: item.key,
        ...(item.required ? { required: item.required } : {}),
        ...(!!item.validationType
          ? { validationType: item.validationType }
          : {}),
        ...(item.link ? { link: item.link } : {})
      }));
    return (
      <View
        style={{
          position: "relative",
          left: 10,
          width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20
        }}
      >
        <ViewWithLoading
          isLoading={this.state.isLoading}
          contentLoader="contentHeader"
        >
          <Form
            headerTitle={translations.register}
            headerIcon="check-square"
            colorPrimary={settings.colorPrimary}
            validationData={translations.validationData}
            renderTopComponent={() =>
              signupError && (
                <P style={{ color: Consts.colorQuaternary }}>
                  {translations[signupError]}
                </P>
              )
            }
            data={_signUpForm}
            renderButtonSubmit={(results, status) => {
              const { translations, isSignupLoading, settings } = this.props;
              return (
                <View>
                  <Button
                    backgroundColor="primary"
                    colorPrimary={settings.colorPrimary}
                    size="lg"
                    radius="round"
                    block={true}
                    isLoading={isSignupLoading}
                    onPress={async () => this._handleRegister(results, status)}
                  >
                    {translations.register}
                  </Button>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this._handleTab("register")}
                    style={{ alignItems: "center", marginTop: 15 }}
                  >
                    <P>{translations.login}</P>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </ViewWithLoading>
      </View>
    );
  }

  render() {
    const { settings } = this.props;
    return (
      <Animated.View
        style={{
          flexDirection: "row",
          width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) * 2,
          transform: [
            {
              translateX: this.state.animation
            }
          ]
        }}
      >
        {this._renderFormLogin()}
        {settings.isAllowRegistering === "yes" && this._renderFormRegister()}
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  auth: state.auth,
  loginError: state.loginError,
  isLoginLoading: state.isLoginLoading,
  translations: state.translations,
  signUpForm: state.signUpForm,
  signupError: state.signupError,
  isSignupLoading: state.isSignupLoading
});
const mapDispatchToProps = {
  login,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm
  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormContainer);
