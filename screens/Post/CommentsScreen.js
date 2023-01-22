import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, RefreshControl, KeyboardAvoidingView, Text, ActivityIndicator, ActionSheetIOS } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Comment from '../../Components/Comment';
import * as Haptics from 'expo-haptics';
import { useLogout } from '../../hooks/useLogout';

export default function CommentsScreen({ route, navigation }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);
  const { post_id } = route.params;
  const { logout } = useLogout()

  const getComments = async () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    try {
      const response = await fetch(`https://timeline.herokuapp.com/api/comments/${post_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json();
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        setComments(json)
      }
    } catch (error) {
      console.log(error.message);
    }
    setRefreshing(false);
  }

  const createComment = async () => {
    if (loading) {
      return;
    }
    if (comment == "") {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://timeline.herokuapp.com/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ comment, post_id })
      })
      const json = await response.json();
      let res = { ...json, name: user.name, username: user.username, avatar: user.avatar }
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        setComments([res, ...comments])
        setComment("")
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }

  const deleteComment = async (id) => {
    try {
      const response = await fetch(`https://timeline.herokuapp.com/api/comments/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json();
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== json._id))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const actionSheet = (id, user_id) => {
    Haptics.selectionAsync()
    if (user_id === user._id ) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Delete"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark'
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            deleteComment(id)
          }
        }
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Report"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark'
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          navigation.navigate('ReportScreen', { entityType: "Comment", entityId: id })
        }
      }
    );
    }
    
  }

  useEffect(() => {
    getComments();
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} />}
        data={comments}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) =>
   
            <Comment item={item} navigation={navigation} actionSheet={actionSheet} />
          
        }
        keyExtractor={item => item._id}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={84}>
        <View style={{ marginTop: 'auto', marginHorizontal: 20 }}
        // onLayout={event => {
        //   let { height } = event.nativeEvent.layout;
        //   console.log(height);
        // }}
        // Get height of the view for keyboard avoiding view vertical offset
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <TextInput style={styles.input}
              onChangeText={text => setComment(text)}
              value={comment}
              placeholder={'Add comment...'}
              autoCorrect={false}
              multiline={true}
            />
            <TouchableOpacity onPress={createComment} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* <Ionicons name="send-outline" size={24} color="black" /> */}
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    //padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginRight: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  }

});