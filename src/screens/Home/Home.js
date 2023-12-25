import { StyleSheet, View, FlatList, RefreshControl, Platform, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '../../redux/feedSlice';
import ItemSeparator from '../../components/ItemSeparator';
// import FeedPost from '../../components/FeedPost';
import { useLogout } from '../../hooks/useLogout';
import ListEmpty from '../../components/ListEmpty';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { setToken } from '../../redux/notificationTokenSlice';
import { URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync());
  } else {
    // alert('Must use physical device for Push Notifications');
    return;
  }

  return token;
}

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const feed = useSelector((state) => state.feed.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch()
  const { logout } = useLogout()
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const setPushToken = async (token) => {
    if (token === null || token === "") {
      return;
    }
    try {
      const response = await fetch(`${URL}/api/user/setPushToken`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      const json = await response.json()
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        // console.log("Success");
      }
    } catch (error) {
      console.log(error.message);
    }

  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      // setExpoPushToken(token)
      setPushToken(token)
      dispatch(setToken(token))
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      let data = response.notification.request.content.data;
      if (data.type === "following") {
        navigation.push('UserProfileScreen', { username: data.username, id: data.id })
      } else if (data.type === "comment") {
        navigation.push("CommentsScreen", { post_id: data.post_id })
      } else if (data.type === "liked") {
        navigation.push("LikesScreen", { post_id: data.post_id })
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onRefresh = async () => {
    getFeed();
  }

  const getFeed = async () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    try {
      const response = await fetch(`${URL}/api/posts/getFeed`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
      });
      const json = await response.json()
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        // cache the feed data
        await AsyncStorage.setItem('feed', JSON.stringify(json))
        dispatch(setFeed(json))
      }
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // refresh data here
      getFeed();
    });
    return () => unsubscribe();

  }, [navigation])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      try {
        if (!state.isConnected) {
          const feedCached = JSON.parse(await AsyncStorage.getItem("feed"));
          if (feedCached) {
            dispatch(setFeed(feedCached))
          }
        } else {
          getFeed();
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        data={feed}
        showsVerticalScrollIndicator={true}
        ItemSeparatorComponent={<ItemSeparator />}
        renderItem={({ item }) =>
          // <FeedPost navigation={navigation} item={item} />
          <Text>Hello</Text>
        }
        keyExtractor={item => item._id}
        ListEmptyComponent={<ListEmpty title={"Welcome to TimeLine"} message={"Follow friends to add their posts to your TimeLine"} />}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});