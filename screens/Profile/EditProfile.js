import { Button, Image, StyleSheet, Text, View, ActionSheetIOS, TouchableWithoutFeedback, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../../state_management/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useLogout } from '../../hooks/useLogout';
import validator from 'validator';
import CustomImage from '../../Components/CustomImage';


const EditProfile = ({ navigation, route }) => {
  const { logout } = useLogout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.value);
  const id = user._id;
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [image, setImage] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  //const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.website);

  const DATA = [
    {
      id: 1,
      title: "Name",
      component: (
        <TextInput
          style={styles.input}
          placeholder={"Name"}
          defaultValue={name}
          onChangeText={newValue => setName(newValue)}
          autoCapitalize="none"
        />
      )
    },
    {
      id: 2,
      title: "Username",
      component: (
        // <TextInput
        //   style={styles.input}
        //   placeholder={"Username"}
        //   defaultValue={username}
        //   onChangeText={newValue => setUsername(newValue)}
        //   autoCapitalize="none"
        //   autoCorrect={false}
        //   clearTextOnFocus={false}
        // />
        <Text style={styles.input}>{user.username}</Text>
      )
    },
    {
      id: 3,
      title: "Bio",
      component: (
        <TextInput
          style={styles.input}
          placeholder={"Bio"}
          defaultValue={bio}
          onChangeText={newValue => setBio(newValue)}
          autoCapitalize="none"
          multiline={true}
          maxLength={200}
          numberOfLines={1}
          autoCorrect={false}
          clearTextOnFocus={false}
        />
      )
    },
    {
      id: 4,
      title: "Website",
      component: (
        <TextInput
          style={styles.input}
          placeholder={"Website"}
          defaultValue={website}
          onChangeText={newValue => setWebsite(newValue)}
          autoCapitalize="none"
          autoCorrect={false}
          clearTextOnFocus={false}
        />
      )
    },
  ]

  const actionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Upload from library", "Delete current photo"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
        userInterfaceStyle: 'dark'
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          openImagePickerAsync();
        } else if (buttonIndex === 2) {
          setImage("")
          setDeleteImage(true);
        }
      }
    );
  }

  const deleteProfilePicture = async () => {
    if (user.avatar === null || user.avatar === "") {
      null
    } else {

      try {
        let pictureRef = ref(getStorage(), user.avatar);
        await deleteObject(pictureRef).then(() => {
          console.log("Deletion Successful");
        })
      } catch (error) {
        console.log(error.message);
      }


    }
  }

  //Handles picking profile image from gallery
  let openImagePickerAsync = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setSelected(true);
      setDeleteImage(false);
    }
  };

  const handleImagePicked = async (pickerResult) => {
    let avatar;
    try {
      if (pickerResult.cancelled) {
        alert("Upload cancelled");
        return;
      } else {
        const uploadUrl = await uploadImage(pickerResult);
        avatar = uploadUrl;
      }
    } catch (e) {
      console.log(e.message);
      alert("Upload failed");
    }
    return avatar;
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), `${user._id}/${uuidv4()}`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  const updateProfile = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!website.startsWith("https://")) {
      setError('Website must start with "https://"');
      setLoading(false);
      return;
    }

    if (website === "" || website === null) {
      null
    } else {
      if (!validator.isURL(website)) {
        setError("Website must be a valid URL")
        setLoading(false);
        return;
      }
    }
    try {
      let avatar;
      if (deleteImage) {
        await deleteProfilePicture();
      }
      if (selected) {
        //Delete any picture that exists first
        await deleteProfilePicture().then(async () => avatar = await handleImagePicked(image))
        //then upload the new one

      } else {
        avatar = image
      }
      let body = { id, name, bio, website, avatar };
      let updatedBody = {
        id: body.id,
        name: body.name ? body.name : "",
        bio: body.bio ? body.bio : "",
        website: body.website ? body.website : "",
        avatar: body.avatar ? body.avatar : ""
      }
      const response = await fetch('https://timeline.herokuapp.com/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedBody)
      })

      const json = await response.json()
      const updatedUser = { ...json, token: user.token }

      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
        setError(json.error)
      }
      if (response.ok) {
        //save user to react native local storage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
        //update redux state
        dispatch(update(updatedUser));
        navigation.goBack();
      }

    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }


  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableWithoutFeedback onPress={actionSheet}>
                {image === null || image === "" ? <Image
                  style={styles.image}
                  source={require('../../assets/default_avatar.png')}
                />
                  : <CustomImage
                    style={styles.image}
                    uri={image}
                  />}
              </TouchableWithoutFeedback>
              <Button title='Change photo' onPress={actionSheet} />
            </View>
          </>
        }
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <View style={styles.boxContainer}>
            <View style={{}}>
              <Text style={{ fontSize: 20, alignSelf: 'flex-end', fontWeight: '500' }}>{item.title}</Text>
            </View>
            <View style={styles.inputContainer}>
              {item.component}
            </View>
          </View>
        }
        ListFooterComponent={
          <>
            {error !== "" ?
              <Text style={styles.error}>{error}</Text>
              : null}

            <TouchableOpacity onPress={updateProfile}>
              <View style={styles.buttonContainer}>
                {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
                  :
                  <Text style={styles.button}>Save</Text>}
              </View>
            </TouchableOpacity>
          </>
        }
      />


    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    borderRadius: 50,
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  boxContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginHorizontal: 10,
  },
  value: {
    marginLeft: 'auto',
    marginRight: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#3AB0FF',
    borderRadius: 10,
    width: '90%',
  },
  button: {
    padding: 10,
    color: 'white',
    fontWeight: "600",
  },
  inputContainer: {
    marginLeft: 'auto',
    width: '70%',
  },
  input: {
    //backgroundColor: 'black'
    fontSize: 15,
  },
  bio: {

  },
  error: {
    color: 'red',
    fontSize: 20,
    alignSelf: 'center',

  }
})