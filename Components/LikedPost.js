import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ActionSheetIOS, Image } from 'react-native';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { formatDistanceToNowStrict } from 'date-fns';
import ItemSeparator from './ItemSeparator';
import { useLogout } from '../hooks/useLogout';
import { useAddToFavourites } from '../hooks/useAddToFavourites';
import { useDeletePost } from '../hooks/useDeletePost';
import CustomText from './CustomText';
import CustomImage from './CustomImage';
import { URL } from '@env';


const windowWidth = Dimensions.get('window').width;

const LikedPost = ({ navigation, item, updateLikedPostsList }) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value);
    const [likes, setLikes] = useState(item.likes)
    const [comments, setComments] = useState(item.comments)
    const { logout } = useLogout()
    const { addToFavourites } = useAddToFavourites()
    const { deletePostUI } = useDeletePost()

    const addPostToFavourites = async () => {
        addToFavourites(item._id)
    }

    const like = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/posts/like/${item._id}`, {
                method: 'PUT',
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
                setLikes(json.likes)
                setComments(json.comments)
                updateLikedPostsList(json._id)
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    const bottomSheet = () => {
        if (item.user_id === user._id) {
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
                        deletePostUI(item._id, item.uri).then(() => updateLikedPostsList(item._id))
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
                        navigation.navigate('ReportScreen', { entityType: "Post", entityId: item._id })
                    }
                }
            );
        }

    }

    return (
        <>
            <View style={{ flexDirection: 'row', marginHorizontal: 5, marginTop: 10 }}>
                <TouchableWithoutFeedback onPress={() => {
                    user._id === item._id ? navigation.navigate('ProfileStack') :
                        navigation.navigate('UserProfileScreen', { username: item.username, id: item.user_id })
                }}>
                    {/* avatar */}
                    <View style={{ flexDirection: 'row' }}>
                        {item.avatar === null || item.avatar === "" ?
                            <Image style={styles.avatar} source={require('../assets/default_avatar.png')} />
                            : 
                         <CustomImage uri={item.avatar} style={styles.avatar} /> }
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(item.createdAt))} ago`}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback >
                {/* Three Dots on the Right */}
                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={bottomSheet}>
                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                </TouchableOpacity>

            </View>
            {/* caption */}
            <View style={styles.captionContainer}>
                <CustomText style={styles.caption} caption={item.caption} />
            </View>
            <View style={{ marginVertical: 10 }}>
                {/* Image  */}
                {/* If image is null do nothing else return image */}
                {item.uri === null || item.uri === "" ? null :
                    <CustomImage uri={item.uri} style={styles.image}
                        resizeMode={''} />
                }
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 'auto', marginRight: 7 }}>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate("CommentsScreen", { post_id: item._id }) }}><Text style={{ paddingRight: 5 }}>{item.comments.length === 0 || item.comments.length > 1 ? `${item.comments.length} comments` : `${item.comments.length} comment`}</Text></TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate("LikesScreen", { post_id: item._id }) }}><Text style={{ paddingRight: 5 }}>{item.likes.length === 0 || item.likes.length > 1 ? `${item.likes.length} likes` : `${item.likes.length} like`}</Text></TouchableWithoutFeedback>
            </View>
            <ItemSeparator />

            <View style={styles.icons}>

                <TouchableOpacity style={styles.touchable} onPress={() => {
                    like();
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}>
                    {/* If the the post is liked then change the icon to red */}
                    {likes.includes(user._id) ? <AntDesign name="heart" size={24} color="red" style={styles.icon} /> :
                        <AntDesign name="hearto" size={24} color="black" style={styles.icon} />}
                    <Text style={styles.iconText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={() => { navigation.navigate("CommentsScreen", { post_id: item._id }) }}>
                    <FontAwesome name="comment-o" size={24} color="black" style={styles.icon} />
                    <Text style={styles.iconText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable} onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    addPostToFavourites();
                }}>{user.favourites.includes(item._id) ? <FontAwesome name="bookmark" size={24} color="black" style={styles.icon} /> :
                    <FontAwesome name="bookmark-o" size={24} color="black" style={styles.icon} />}
                    <Text style={styles.iconText}>Save</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default LikedPost

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 50,
        width: 50,
        height: 50,
        margin: 5,
    },
    name: {
        fontWeight: '500',
    },
    timestamp: {
        fontSize: 13,
        color: '#606470'
    },
    captionContainer: {
        marginHorizontal: 15
    },
    caption: {
        letterSpacing: 1.2,
        fontSize: 15,
        fontWeight: '400',
    },
    image: {
        width: windowWidth,
        height: 400
    },
    icons: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconText: {

    },
    icon: {
        marginRight: 7
    }
})