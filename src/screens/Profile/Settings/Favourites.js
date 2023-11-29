import { StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { URL } from "@env";
import { useLogout } from "../../../hooks/useLogout";
import { useSelector } from "react-redux";
import ProfilePost from "../../../Components/ProfilePost";
import ListEmpty from "../../../Components/ListEmpty";

const Favourites = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  const [favourites, setFavorites] = useState([]);
  const { logout } = useLogout();

  useEffect(() => {
    getFavouritePosts();
  }, []);

  const getFavouritePosts = async () => {
    try {
      const response = await fetch(`${URL}/api/posts/getFavouritePosts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout();
        }
      }
      if (response.ok) {
        setFavorites(json);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={favourites}
      renderItem={({ item }) => (
        <ProfilePost navigation={navigation} item={item} />
      )}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <ListEmpty
          title={""}
          message={"Your favourite posts will appear here"}
        />
      }
    />
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
