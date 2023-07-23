import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View, Image, Button, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLogout } from '../../../hooks/useLogout';
import { URL } from '@env';
import CustomImage from '../../../Components/CustomImage';
import ListEmpty from '../../../Components/ListEmpty';

const BlockedUsers = ({ navigation }) => {
    const user = useSelector((state) => state.user.value);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { logout } = useLogout()

    const fetchBlockedUsers = async () => {
        if (refreshing) {
            return;
        }
        setRefreshing(true);
        try {
            const response = await fetch(`${URL}/api/user/fetchBlockedUsers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })
            const json = await response.json();

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setBlockedUsers(json);
            }
        } catch (error) {
            console.log(error.message);
        }
        setRefreshing(false)
    }

    const unBlockUser = async (id) => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/user/unBlockUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            })
            const json = await response.json();

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                const list = blockedUsers.filter(item => item._id !== json._id);
                setBlockedUsers(list);
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchBlockedUsers();
    }, [])

    const onRefresh = () => {
        fetchBlockedUsers();
    }

    return (
        <FlatList
            style={styles.container}
            scrollEnabled={true}
            data={blockedUsers}
            showsVerticalScrollIndicator={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) =>
                <View style={{ marginHorizontal: 20 }}>
                    <TouchableWithoutFeedback onPress={() => {
                            navigation.navigate('UserProfileScreen', { username: item.username, id: item._id })
                    }}>
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 12 }}>
                                <View style={{}}>
                                    {item.avatar === null || item.avatar === "" ?
                                        <Image style={styles.image} source={require('../../../assets/default_avatar.png')} /> :
                                        <CustomImage style={styles.image} uri={item.avatar} />}
                                </View>
                                <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                                    <Text>{item.name}</Text>
                                    <Text>{item.username}</Text>
                                </View>
                                <View style={{ marginLeft: 'auto', justifyContent: 'center' }}>
                                    <Button title='unblock' onPress={() => unBlockUser(item._id)}/>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
            keyExtractor={item => item._id}
            ListEmptyComponent={<ListEmpty title={"No Blocked Users"} message={``} />}
        />
    )
}

export default BlockedUsers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50
    }
})