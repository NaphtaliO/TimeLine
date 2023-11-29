import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, RefreshControl } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../redux/postsSlice';
import { Tabs } from 'react-native-collapsible-tab-view';
import Post from '../../components/Post';
import ItemSeparator from '../../components/ItemSeparator';
import { logIn } from '../../redux/userSlice';
import { useLogout } from '../../hooks/useLogout';
import ListEmpty from '../../components/ListEmpty';
import LikedPost from '../../components/LikedPost';
import CustomImage from '../../components/CustomImage';
import { URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_COLOUR } from '../../constants/colors';

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state) => state.user.value);
    const posts = useSelector((state) => state.posts.value);
    const [likedPosts, setLikedPosts] = useState([]);
    const { logout } = useLogout();

    const onRefresh = async () => {
        getPosts();
        getLikedPostsList();
        refreshUser();
    }

    const refreshUser = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            if (!user) {
                return;
            }
            const response = await fetch(`${URL}/api/user/refresh`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })

            const json = await response.json()
            const refreshedUser = { ...json, token: user.token }

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(refreshedUser))
                dispatch(logIn(refreshedUser))
            }
        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false);
    }

    const getPosts = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            if (!user) {
                return;
            }
            const response = await fetch(`${URL}/api/posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                dispatch(setPosts(json))
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
            if (!user) {
                return;
            }
            const response = await fetch(`${URL}/api/posts/getLikedPostsList/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
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

    const updateLikedPostsList = (id) => {
        let newList = likedPosts.filter(obj => obj._id !== id)
        setLikedPosts(newList)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // refresh data here
            getPosts();
            getLikedPostsList();
            refreshUser();
        });
        return () => unsubscribe();

    }, [navigation])

    return (
        <Tabs.Container allowHeaderOverscroll={true}
            renderHeader={() =>
                <View style={styles.container} pointerEvents={"box-none"}>
                    <View style={{ padding: 15 }} pointerEvents={"auto"}>
                        {user.avatar === null || user.avatar === "" ? <Image
                            style={styles.image}
                            source={require('../../assets/default_avatar.png')}
                        />
                            :
                            <CustomImage
                                style={styles.image}
                                uri={user.avatar}
                            />

                        }
                        {user.name === null || user.name === "" ? null : <Text style={styles.name}>{user.name}</Text>}
                        <Text style={styles.username}>@{user.username}</Text>
                        {user.bio === null || user.bio === "" ? null : <Text>{user.bio}</Text>}
                        {user.website === null || user.website === "" ? null : <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(user.website)} ><Text style={{ color: '#2155CD' }}>{user.website}</Text></TouchableOpacity>}
                        <View style={styles.followingText} pointerEvents="auto">
                            <TouchableOpacity pointerEvents={"auto"} onPress={() => { navigation.push('FollowingScreen', { screen: "Following", id: user._id, username: user.username }) }}><Text style={[{ paddingRight: 10 }]}><Text style={styles.number}>{user.following.length}</Text> Following</Text></TouchableOpacity>
                            <TouchableOpacity pointerEvents={"auto"} onPress={() => { navigation.push('FollowingScreen', { screen: "Followers", id: user._id, username: user.username }) }}><Text><Text style={styles.number}>{user.followers.length}</Text> Followers</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { user: user })}>
                            <View style={styles.buttonContainer}>
                                <Text style={styles.button}>Edit Profile</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            }>
            <Tabs.Tab name="Posts" >
                <Tabs.FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={posts}
                    style={{ backgroundColor: 'white' }}
                    ItemSeparatorComponent={<ItemSeparator />}
                    renderItem={({ item }) =>
                        <Post navigation={navigation} user={user} item={item} />
                    }
                    keyExtractor={item => item._id}
                    ListEmptyComponent={<ListEmpty title={"You have no posts"} message={"Create Posts and add them to your TimeLine"} />}
                />
            </Tabs.Tab>
            <Tabs.Tab name="Likes">
                <Tabs.FlatList
                    ItemSeparatorComponent={<ItemSeparator />}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={likedPosts}
                    style={{ backgroundColor: 'white' }}
                    renderItem={({ item }) =>
                        <LikedPost navigation={navigation} item={item} updateLikedPostsList={updateLikedPostsList} />
                    }
                    keyExtractor={item => item._id}
                    ListEmptyComponent={<ListEmpty title={"No liked posts"} message={"Like some posts and they will appear here"} />}
                />
            </Tabs.Tab>
        </Tabs.Container>
    )
}

export default Profile;

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
        backgroundColor: THEME_COLOUR,
        borderRadius: 10,
        width: '90%',
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
    followingText: {
        flexDirection: 'row',
        paddingTop: 7
    }
})