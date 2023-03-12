import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ActionSheetIOS, Image } from 'react-native';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Feather, FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../state_management/postsSlice';
import { formatDistanceToNowStrict } from 'date-fns';
import { updatePostInFeed } from '../state_management/feedSlice';
import { updateFavourites } from '../state_management/userSlice';
import ItemSeparator from './ItemSeparator';
import { useLogout } from '../hooks/useLogout';
import { useDeletePost } from '../hooks/useDeletePost';
import { useAddToFavourites } from '../hooks/useAddToFavourites';
import CustomText from './CustomText';
import CustomImage from './CustomImage';
import { URL } from '@env';


const windowWidth = Dimensions.get('window').width;

const FeedPost = ({ navigation, item }) => {
    const { logout } = useLogout();
    const { deletePostUI } = useDeletePost();
    const { addToFavourites } = useAddToFavourites();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value);

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
                dispatch(updatePostInFeed(json));
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
                        deletePostUI(item._id, item.uri)
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
                    user._id === item.user_id ? navigation.navigate('ProfileStack') :
                        navigation.navigate('UserProfileScreen', { username: item.username, id: item.user_id })
                }}>
                    {/* avatar */}
                    <View style={{ flexDirection: 'row' }}>
                        {item.avatar === null || item.avatar === "" ?
                            <Image style={styles.avatar} source={require('../assets/default_avatar.png')} />
                            :
                            <CustomImage style={styles.avatar} uri={item.avatar} />}
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
                {item.uri === null || item.uri === "" ? null
                    :
                    <CustomImage uri={item.uri} style={styles.image} resizeMode={''} />
                }
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 'auto', marginRight: 7 }}>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate("CommentsScreen", { post_id: item._id }) }}><Text style={{ paddingRight: 5 }}>{item.comments.length} comments</Text></TouchableWithoutFeedback>
                <Text style={{ paddingRight: 5 }}>{item.likes.length} likes</Text>
            </View>
            <ItemSeparator />

            <View style={styles.icons}>
                {/* Like Button */}
                <TouchableOpacity style={styles.touchable} onPress={() => {
                    like();
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}>
                    {/* If the the post is liked then change the icon to red */}
                    {item.likes.includes(user._id) ? <AntDesign name="heart" size={24} color="red" style={styles.icon} /> :
                        <AntDesign name="hearto" size={24} color="black" style={styles.icon} />}
                    <Text style={styles.iconText}>Like</Text>
                </TouchableOpacity>
                {/* Comment Button */}
                <TouchableOpacity style={styles.touchable} onPress={() => { navigation.navigate("CommentsScreen", { post_id: item._id }) }}>
                    <FontAwesome name="comment-o" size={24} color="black" style={styles.icon} />
                    <Text style={styles.iconText}>Comment</Text>
                </TouchableOpacity>
                {/* Add to Favourites Button */}
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

export default FeedPost

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