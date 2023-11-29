import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import CustomImage from "./CustomImage";

const ChatItem = ({ item, navigation }) => {
  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChatScreen", { user: item })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            {item.avatar === null || item.avatar === "" ? (
              <Image
                style={styles.image}
                source={require("../assets/default_avatar.png")}
              />
            ) : (
              <CustomImage style={styles.image} uri={item.avatar} />
            )}
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingLeft: 7 }}>
            <Text style={{ fontWeight: "500", fontSize: 16.5 }}>
              {item.name}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {item.text}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{ flexWrap: "wrap" }}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  image: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },
  text: {
    flexWrap: "wrap",
    color: "#606470",
  },
});
