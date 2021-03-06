import { createStackNavigator } from "react-navigation";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import MenuScreen from "../components/screens/MenuScreen";
import EventScreen from "../components/screens/EventScreen";
import ListingScreen from "../components/screens/ListingScreen";
import BlogScreen from "../components/screens/ArticleScreen";
import PageScreen from "../components/screens/PageScreen";

const menuStack = createStackNavigator(
  {
    MenuScreen: {
      screen: MenuScreen
      // navigationOptions: {
      //   title: "Wilcity",
      //   headerStyle: {
      //     backgroundColor: Consts.colorDark
      //   },
      //   headerTintColor: Consts.colorPrimary,
      //   headerTitleStyle: {
      //     fontWeight: "400",
      //     fontSize: 14
      //   }
      // }
      // navigationOptions: ({ navigation }) => ({
      // 	header: false
      // })
    },
    MenuEventScreen: {
      screen: EventScreen
    },
    MenuListingScreen: {
      screen: ListingScreen
    },
    MenuBlogScreen: {
      screen: BlogScreen
    },
    MenuPageScreen: {
      screen: PageScreen
    }
  },
  stackOpts
);

export default menuStack;
