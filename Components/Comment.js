import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, TouchableWithoutFeedback, FlatList } from 'react-native';
import React, { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useSelector } from 'react-redux';
import CustomImage from './CustomImage';

const Comment = ({ item, navigation, actionSheet }) => {
  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([])
  const [showReplies, setShowReplies] = useState(false);

  // const DATA = [
  //   {
  //     _id: 1,
  //     username: "Naphtali",
  //     avatar: "https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/advice/maps-satellite-images/satellite-image-of-globe.jpg",
  //     comment: "What's good homies"
  //   }
  // ]
  // async function wait() {
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  // }


  // const loadReplies = async () => {
  //   setLoading(true)
  //   try {
  //     await wait().then(() => console.log('Hello!'));
  //     setShowReplies(true);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  //   setLoading(false)
  // }

  

  return (
    <>
      <TouchableOpacity onLongPress={() => actionSheet(item._id, item.user_id)}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => {
            user._id === item._id ? navigation.navigate('ProfileStack') :
              navigation.navigate('UserProfileScreen', { username: item.username, id: item._id })
          }}>
            <View style={styles.imageContainer}>
              {item.avatar === null || item.avatar === "" ?
                <Image
                  style={styles.image}
                  source={require('../assets/default_avatar.png')}
                /> :
                <CustomImage
                  style={styles.image}
                  uri={item.avatar}
                />}
            </View>
          </TouchableWithoutFeedback>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: "#606470", fontSize: 13 }}>{item.username}</Text>
            <Text style={styles.text}>{item.comment}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: "#606470", fontSize: 13 }}>{formatDistanceToNowStrict(new Date(item.createdAt)) + " ago"}</Text>
              {/* <TouchableOpacity><Text style={styles.replyButton}>reply</Text></TouchableOpacity> */}
            </View>
            {/* <View style={{ marginTop: 10 }}>
              {loading ? <ActivityIndicator style={styles.activityIndicator} size="small" color="black" /> :
                DATA.length > 0 ?
                  <TouchableOpacity onPress={loadReplies}>
                    <Text>View {DATA.length} replies</Text>
                  </TouchableOpacity>
                  : null}
            </View> */}
            {/* <FlatList
          data={DATA}
          renderItem={({ item }) =>
            <TouchableOpacity
              // onLongPress={() => actionSheet(item._id, item.user_id)}
            >
              <Text>xx</Text>
            </TouchableOpacity>
          }
          keyExtractor={item => item._id}
          scrollEnabled={false}
        /> */}

          </View>
        </View>
      </TouchableOpacity>
      {/* {
        DATA.map((comment) =>
          <Text key={comment._id}>Hello</Text>)
      } */}
    </>
  )
}

export default Comment;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    flexDirection: 'row'
  },
  text: {
    fontSize: 17,
    letterSpacing: 1,
    //lineHeight: 25,
  },
  image: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  imageContainer: {
    paddingRight: 10,
    alignSelf: 'center'
  },
  replyButton: {
    color: "#606470",
    fontSize: 13,
    paddingLeft: 17,
    fontWeight: '600',
    alignSelf: 'center'
  },
  activityIndicator: {
    marginRight: 'auto',
    marginLeft: 30
  }
})