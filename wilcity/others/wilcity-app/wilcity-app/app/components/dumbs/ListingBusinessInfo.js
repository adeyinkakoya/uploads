import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { WebItem, PhoneItem, AddressItem } from "./";

// const PhoneItem = phone => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() => Communications.phonecall(phone, true)}
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="phone-call"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorTertiary}
//       text={phone}
//     />
//   </TouchableOpacity>
// );

// const WebItem = (url, navigation) => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() => navigation.navigate("WebViewScreen", { url })}
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="globe"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorQuaternary}
//       text={url}
//     />
//   </TouchableOpacity>
// );

// const AddressItem = (address, navigation) => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() =>
//       navigation.navigate("WebViewScreen", {
//         url: `https://www.google.com/maps/place/${address.address.replace(
//           /\s+/g,
//           "+"
//         )}/@${address.lat},${address.lng},6z`
//       })
//     }
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="map-pin"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorSecondary}
//       text={address.address}
//     />
//   </TouchableOpacity>
// );

const ListingBusinessInfo = props => {
  const { data, navigation } = props;
  return (
    <View>
      {data.oAddress && (
        <AddressItem
          address={data.oAddress}
          navigation={navigation}
          style={{ marginBottom: 14 }}
        />
      )}
      {(data.phone || data.phone !== "") && (
        <PhoneItem phone={data.phone} style={{ marginBottom: 14 }} />
      )}
      {(data.website || data.website !== "") && (
        <WebItem
          url={data.website}
          navigation={navigation}
          style={{ marginBottom: 14 }}
        />
      )}
    </View>
  );
};

ListingBusinessInfo.propTypes = {
  data: PropTypes.object
};

export default ListingBusinessInfo;
