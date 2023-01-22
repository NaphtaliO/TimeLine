import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '../../state_management/feedSlice';
import FeedPost from '../../Components/FeedPost';
import ItemSeparator from '../../Components/ItemSeparator';
import { useLogout } from '../../hooks/useLogout';
import ListEmpty from '../../Components/ListEmpty';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { setToken } from '../../state_management/notificationTokenSlice';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      //alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
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
    try {
      const response = await fetch(`https://timeline.herokuapp.com/api/user/setPushToken`, {
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
        console.log("Success");
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
      console.log(response);
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
      const response = await fetch(`https://timeline.herokuapp.com/api/posts/getFeed`, {
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

  // //This here auto refreshes data every what ever milliseconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     //Code that refreshes data
  //     onRefresh();
  //   }, 120000);
  //   return () => clearInterval(interval)
  // }, [])

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
          <FeedPost navigation={navigation} item={item} />
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
  },

});