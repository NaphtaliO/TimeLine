import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import FollowingUser from '../../Components/FollowingUser';
import { useLogout } from '../../hooks/useLogout';
import { URL } from '@env';

const Tab = createMaterialTopTabNavigator();

const TopTabs = ({ id }) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Followers" component={Followers} initialParams={{ id: id }} />
            <Tab.Screen name="Following" component={Following} initialParams={{ id: id }} />
        </Tab.Navigator>
    )
}

const FollowingScreen = ({ route }) => {
    const { id } = route.params;

    return (
        <TopTabs id={id} />
    )
}

const Followers = ({ navigation, route }) => {
    const { id } = route.params;
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value)
    const { logout } = useLogout()

    useEffect(() => {
        const fetchFollowers = async () => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`${URL}/api/user/getFollowers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                })

                const json = await response.json()
                setFollowers(json);

                if (!response.ok) {
                    if (json.error === "Request is not authorized") {
                        logout()
                    }
                }
                if (response.ok) {

                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        fetchFollowers();
    }, [])

    return (
        <View style={styles.container}>
            {followers.length !== 0 ?
                <FlatList
                    scrollEnabled={true}
                    data={followers}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) =>
                        <View style={{ marginHorizontal: 20 }}>
                            <FollowingUser navigation={navigation} item={item} />
                        </View>
                    }
                    keyExtractor={item => item._id} />
                : null}
        </View>
    );
}

const Following = ({ navigation, route }) => {
    const { id } = route.params;
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value)
    const { logout } = useLogout()

    useEffect(() => {
        const fetchFollowing = async () => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`${URL}/api/user/getFollowing/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                })

                const json = await response.json()
                setFollowing(json);

                if (!response.ok) {
                    if (json.error === "Request is not authorized") {
                        logout()
                    }
                }
                if (response.ok) {

                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        fetchFollowing();
    }, [])

    return (
        <View style={styles.container}>
            {following.length !== 0 ?
                <FlatList
                    scrollEnabled={true}
                    data={following}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) =>
                        <View style={{ marginHorizontal: 15 }}>
                            <FollowingUser navigation={navigation} item={item} />
                        </View>
                    }
                    keyExtractor={item => item._id} />
                : null}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
})

export default FollowingScreen;

