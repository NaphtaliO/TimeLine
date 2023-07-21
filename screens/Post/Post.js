import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { createPosts } from '../../state_management/postsSlice';
import { addToFeed } from '../../state_management/feedSlice';
import { useLogout } from '../../hooks/useLogout';
import { URL } from '@env';

export default function Post({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const hasUnsavedChanges = Boolean(caption || image);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const { logout } = useLogout()

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges) {
                return;
            }

            e.preventDefault();

            Alert.alert(
                "Discard Post?",
                "You have unsaved changes, would you like to discard post?",
                [
                    {
                        text: "Keep Editing",
                        onPress: () => { }
                    },
                    {
                        text: "Discard Post",
                        onPress: () => navigation.dispatch(e.data.action),
                        style: "destructive"
                    }
                ]
            );
        })
    }, [navigation, hasUnsavedChanges]);

    //Handles picking images from Gallery
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
        }

        if (result.canceled) {
            setImage(null);
            setSelected(false);
        }
    };

    // Handles opening camera/taking pictures
    let openCameraAsync = async () => {

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setSelected(true);
        }

        if (result.canceled) {
            setImage(null);
            setSelected(false);
        }
    };

    const handleCreate = async () => {
        if (loading) {
            return;
        }
        setLoading(true)
        try {
            if (user == null) {
                console.log("You need to be logged in");
                return;
            }
            let uri = null;
            if (selected) {
                uri = await handleImagePicked(image);
            }
            const post = { uri, caption }
            const response = await fetch(`${URL}/api/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(post)
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                dispatch(createPosts(json));
                dispatch(addToFeed({ name: user.name, username: user.username, avatar: user.avatar, ...json }))
            }
            navigation.navigate('Home');
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false)
    }

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
        try {
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
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <ScrollView style={styles.container} scrollEnabled={true}>
            <View>
                <TextInput
                    style={styles.textInput}
                    placeholder="what's on your mind?"
                    onChangeText={text => setCaption(text)}
                    multiline={true}
                    value={caption}
                    maxLength={500}

                />
                <View style={styles.icon} >
                    <TouchableOpacity onPress={openImagePickerAsync} style={{}}><FontAwesome name="image" size={30} color="black" /></TouchableOpacity>
                    <TouchableOpacity onPress={openCameraAsync} style={{ paddingLeft: 10 }}><FontAwesome name="camera" size={30} color="black" /></TouchableOpacity>
                </View>
                {/* {selectedImage && <Image source={{ uri: selectedImage.localUri }}
                style={styles.thumbnail} />} */}
                <View style={styles.imageContainer}>
                    {image === null ? null:
                        <Image source={{ uri: image }}
                            style={[{}, styles.thumbnail]} />}
                </View>
            </View>
            <View style={{
                paddingBottom: 30
            }}>
            {image !== null || caption !== "" ?
                <TouchableOpacity onPress={handleCreate}>
                    <View style={styles.buttonContainer}>
                        {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
                            :
                            <Text style={styles.button}>Share Post</Text>}
                    </View>
                </TouchableOpacity>
                    : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    textInput: {
        fontSize: 20,
        letterSpacing: 1,
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    imageContainer: {

    },
    thumbnail: {
        width: '100%',
        height: 500,
        resizeMode: "contain",
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
});
