import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { formatDistanceToNowStrict } from 'date-fns';
import ItemSeparator from './ItemSeparator'
import { useLogout } from '../hooks/useLogout';
import { useDeletePost } from '../hooks/useDeletePost';
import { useAddToFavourites } from '../hooks/useAddToFavourites';
import CustomText from './CustomText';
import CustomImage from './CustomImage';
import { URL } from '@env';
// import { updatePost } from '../redux/postsSlice';

const windowWidth = Dimensions.get('window').width;

const Post = ({ navigation, post, updatePostsList }) => {
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState(post.likes)
    const { logout } = useLogout()
    const { deletePostUI } = useDeletePost();
    const { addToFavourites } = useAddToFavourites();
    const { showActionSheetWithOptions } = useActionSheet();
    const user = useSelector((state) => state.user.value);

    const addPostToFavourites = async () => {
        addToFavourites(post._id)
    }

    const like = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/posts/like/${post._id}`, {
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
                setLikes(json.likes);
                updatePostsList(json);
                vibrateOnSuccess();
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    const vibrateOnSuccess = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const bottomSheet = () => {
        if (post.user._id === user._id) {
            showActionSheetWithOptions(
                {
                    options: ["Cancel", "Delete"],
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: 1,
                    userInterfaceStyle: "dark",
                },
                (selectedIndex) => {
                    switch (selectedIndex) {
                        case 0:
                            // Cancel
                            break;
                        case 1:
                            deletePostUI(post._id, post.uri);
                            break;
                    }
                }
            );
        } else {
            showActionSheetWithOptions(
                {
                    options: ["Cancel", "Report"],
                    cancelButtonIndex: 0,
                    destructiveButtonIndex: 1,
                    userInterfaceStyle: "dark",
                },
                (selectedIndex) => {
                    switch (selectedIndex) {
                        case 0:
                            // Cancel
                            break;
                        case 1:
                            navigation.navigate("ReportScreen", {
                                entityType: "Post",
                                entityId: post._id,
                            });
                            break;
                    }
                }
            );
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'row', marginHorizontal: 5, marginTop: 10 }}>
                <TouchableWithoutFeedback onPress={() => navigation.push('ProfileStack')}>
                    {/* avatar */}
                    <View style={{ flexDirection: 'row' }}>
                        <CustomImage type={"post-avatar"} uri={post.user.avatar} style={styles.avatar} />
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={styles.name}>{post.user.name}</Text>
                            <Text style={styles.timestamp}>{`${formatDistanceToNowStrict(new Date(post.createdAt))} ago`}</Text>
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
                <CustomText style={styles.caption} caption={post.caption} />
            </View>
            <View style={{ marginVertical: 10 }}>
                {/* Image  */}
                    <CustomImage type={"post-image"} uri={post.uri} style={styles.image}
                        resizeMode={''} />
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 'auto', marginRight: 7 }}>
                <TouchableWithoutFeedback onPress={() => { navigation.push("CommentsScreen", { post_id: post._id }) }}>
                    <Text style={{ paddingRight: 5 }}>{post.comments.length === 0 || post.comments.length > 1 ? `${post.comments.length} comments` : `${post.comments.length} comment`}</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { navigation.push("LikesScreen", { post_id: post._id }) }}>
                    <Text style={{ paddingRight: 5 }}>{post.likes.length === 0 || post.likes.length > 1 ? `${post.likes.length} likes` : `${post.likes.length} like`}</Text>
                </TouchableWithoutFeedback>
            </View>
            <ItemSeparator />

            <View style={styles.icons}>
                {/* Like Button */}
                <TouchableOpacity onPress={like} style={styles.touchable}>
                    {/* If the the post is liked then change the icon to red */}
                    {likes.includes(user._id) ? <AntDesign name="heart" size={24} color="red" style={styles.icon} /> :
                        <AntDesign name="hearto" size={24} color="black" style={styles.icon} />}
                    <Text style={styles.iconText}>Like</Text>
                </TouchableOpacity>
                {/* Comment Button */}
                <TouchableOpacity style={styles.touchable} onPress={() => { navigation.push("CommentsScreen", { post_id: post._id }) }}>
                    <FontAwesome name="comment-o" size={24} color="black" style={styles.icon} />
                    <Text style={styles.iconText}>Comment</Text>
                </TouchableOpacity>
                {/* Add to Favourites Button */}
                <TouchableOpacity style={styles.touchable} onPress={addPostToFavourites}>
                    {user.favourites.includes(post._id) ? <FontAwesome name="bookmark" size={24} color="black" style={styles.icon} /> :
                        <FontAwesome name="bookmark-o" size={24} color="black" style={styles.icon} />}
                    <Text style={styles.iconText}>Save</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Post

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