import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View, RefreshControl, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { URL } from '@env';
import { useSelector } from 'react-redux';
import CustomImage from '../../Components/CustomImage';
import ListEmpty from '../../Components/ListEmpty';

const LikesScreen = ({route, navigation}) => {
    const { post_id } = route.params;
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [likes, setLikes] = useState([])
    const { logout } = useLogout()

    const getLikes = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`${URL}/api/posts/getLikes/${post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })
            const json = await response.json();

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setLikes(json);
            }
        } catch (error) {
            console.log(error);
        }
        setRefreshing(false)
    }

    useEffect(() => {
        getLikes();
    }, [])

    const onRefresh = () => {
        getLikes();
    }
    
  return (
      <FlatList
          style={styles.container}
          scrollEnabled={true}
          data={likes}
          showsVerticalScrollIndicator={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) =>
              <View style={{ marginHorizontal: 20 }}>
                  <TouchableWithoutFeedback onPress={() => {
                      navigation.navigate('UserProfileScreen', { username: item.username, id: item._id })
                  }}>
                      <View>
                          <View style={{ flexDirection: 'row', marginTop: 12 }}>
                              <View style={{}}>
                                  {item.avatar === null || item.avatar === "" ?
                                      <Image style={styles.image} source={require('../../assets/default_avatar.png')} /> :
                                      <CustomImage style={styles.image} uri={item.avatar} />}
                              </View>
                              <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                                  <Text>{item.name}</Text>
                                  <Text>{item.username}</Text>
                              </View>
                          </View>
                      </View>
                  </TouchableWithoutFeedback>
              </View>
          }
          keyExtractor={item => item._id}
          ListEmptyComponent={<ListEmpty title={"No Likes yet"} message={`People who like your post will show up here`} />}
      />
  )
}

export default LikesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50
    }
})