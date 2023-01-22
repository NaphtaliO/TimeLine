import { StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePost from '../../Components/ProfilePost';
import { follow } from '../../state_management/userSlice';
import { Tabs } from 'react-native-collapsible-tab-view';
import ItemSeparator from '../../Components/ItemSeparator';
import { useLogout } from '../../hooks/useLogout';
import ListEmpty from '../../Components/ListEmpty';
import CustomImage from '../../Components/CustomImage';

const UserProfileScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const authUser = useSelector((state) => state.user.value);
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [user, setUser] = useState(null);
    const notificationToken = useSelector((state) => state.notificationToken.value);
    const dispatch = useDispatch();
    const { logout } = useLogout()


    const getUserProfile = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`https://timeline.herokuapp.com/api/user/getUserById/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authUser.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setUser(json);
            }

        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    }

    const getUserProfilePosts = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`https://timeline.herokuapp.com/api/posts/getUserPostsById/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authUser.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setPosts(json)
            }
        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    }

    const getLikedPostsList = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`https://timeline.herokuapp.com/api/posts/getLikedPostsList/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authUser.token}`
                },
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setLikedPosts(json)
            }
        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    }

    //Get the user Profile by id
    useEffect(() => {
        getUserProfile();
        getUserProfilePosts();
        getLikedPostsList()
    }, [])

    //follow a user by their ID
    const followUser = async (userId) => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`https://timeline.herokuapp.com/api/user/follow/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authUser.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationToken })
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setUser(json.user)
                dispatch(follow(json.updatedAuthUser));
            }

        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    }

    const onRefresh = () => {
        getUserProfile();
        getUserProfilePosts();
        getLikedPostsList();
    }

    return (
        <Tabs.Container allowHeaderOverscroll={true}
            renderHeader={() =>
                <View style={styles.container}>
                    {user ?
                        <View style={{ padding: 15 }}>
                            {user.avatar === null || user.avatar === "" ?
                                <Image style={styles.image} source={require('../../assets/default_avatar.png')} />
                                :
                                <CustomImage style={styles.image} uri={user.avatar} />
                            }
                            {user.name === null || user.name === "" ? null : <Text style={styles.name}>{user.name}</Text>}
                            <Text style={styles.username}>@{user.username}</Text>
                            {user.bio === null || user.bio === "" ? null : <Text>{user.bio}</Text>}
                            {user.website === null || user.website === "" ? null : <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(user.website)}><Text style={{ color: '#2155CD' }}>{user.website}</Text></TouchableOpacity>}
                            <View style={styles.followingText}>
                                <TouchableOpacity onPress={() => { navigation.navigate('FollowingScreen', { screen: "Following", id: user._id, username: user.username }) }}><Text style={[{ paddingRight: 10 }]}><Text style={styles.number}>{user.following.length}</Text> Following</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { navigation.navigate('FollowingScreen', { screen: "Followers", id: user._id, username: user.username }) }}><Text><Text style={styles.number}>{user.followers.length}</Text> Followers</Text></TouchableOpacity>
                            </View>
                            {
                                !user.followers.includes(authUser._id) && user.following.includes(authUser._id) ?
                                    <TouchableOpacity onPress={() => followUser(user._id)}>
                                        <View style={styles.buttonContainer}>
                                            <Text style={styles.button}>Follow Back</Text>
                                        </View>
                                    </TouchableOpacity> :
                                    user.followers.includes(authUser._id) ?
                                        <TouchableOpacity onPress={() => followUser(user._id)}>
                                            <View style={styles.buttonContainer}>
                                                <Text style={styles.button}>Following</Text>
                                            </View>
                                        </TouchableOpacity> :
                                        !user.followers.includes(authUser._id) ?
                                            <TouchableOpacity onPress={() => followUser(user._id)}>
                                                <View style={styles.buttonContainer}>
                                                    <Text style={styles.button}>Follow</Text>
                                                </View>
                                            </TouchableOpacity>
                                            : null
                            }
                        </View>
                        : null}
                </View>
            }>
            <Tabs.Tab name="Posts" >
                <Tabs.FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ItemSeparatorComponent={<ItemSeparator />}
                    scrollEnabled={true}
                    data={posts}
                    style={{ backgroundColor: 'white' }}
                    renderItem={({ item }) =>
                        <ProfilePost navigation={navigation} item={item} />
                    }
                    keyExtractor={item => item._id}
                    ListEmptyComponent={<ListEmpty title={"No posts yet"} message={`@${user?.username} has not made any posts`} />}
                />
            </Tabs.Tab>
            <Tabs.Tab name="Likes">
                <Tabs.FlatList
                    ItemSeparatorComponent={<ItemSeparator />}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={likedPosts}
                    style={{ backgroundColor: 'white' }}
                    renderItem={({ item }) =>
                        <ProfilePost navigation={navigation} item={item} />
                    }
                    keyExtractor={item => item._id}
                    ListEmptyComponent={<ListEmpty title={"No liked posts"} message={`@${user?.username} has not liked any posts`} />}
                />
            </Tabs.Tab>
        </Tabs.Container>



    )
}

// //A PostList component of all the Users posts
// const PostsList = ({ navigation, route }) => {
//     const { id } = route.params;
//     const authUser = useSelector((state) => state.user.value);
//     const [loading, setLoading] = useState(false);
//     const [posts, setPosts] = useState(null);
//     return (
//         <View style={styles.container} >
//             {posts ?
//                 <FlatList
//                     scrollEnabled={true}
//                     data={posts}
//                     showsVerticalScrollIndicator={true}
//                     renderItem={({ item }) =>
//                         <View style={styles.postContainer}>
//                             <ProfilePost navigation={navigation} item={item} />
//                         </View>
//                     }
//                     keyExtractor={item => item._id} />
//                 : null}
//         </View>
//     )
// }

export default UserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    image: {
        borderRadius: 50,
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    number: {
        fontWeight: '700',
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
    },
    username: {
        fontSize: 15,
        color: "#606470",
        marginBottom: 10,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
        width: '90%',
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
    postContainer: {
        padding: 10,
        borderTopWidth: .2,
        //borderBottomWidth: .2,
        borderColor: 'black'
    },
    followingText: {
        flexDirection: 'row',
        paddingTop: 7
    }
});