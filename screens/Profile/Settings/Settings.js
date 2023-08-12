import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useLogout } from '../../../hooks/useLogout';


const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    const { logout } = useLogout()

    const DATA = [
        {
            id: 1,
            title: "Account Information",
            description: "See and update account information, change your password.",
            onPress: () => navigation.navigate('Account Information')
        },
        {
            id: 2,
            title: "Favourites",
            description: "View your favourite posts.",
            onPress: () => navigation.navigate('Favourites')
        },
        {
            id: 3,
            title: "Blocked Users",
            // description: "View posts you Favourited.",
            onPress: () => navigation.navigate('BlockedUsers')
        },
        {
            id: 4,
            title: "Sign Out",
            description: "",
            color: 'red',
            onPress: () => logout()
        }
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity onPress={item.onPress}>
                        {/* </TouchableOpacity> */}
                        <View style={styles.boxContainer}>
                            <View>
                                <Text style={{ fontSize: 20, alignSelf: 'flex-start', fontWeight: '500', color: item.color }}>{item.title}</Text>
                                <Text style={{ fontSize: 15, color: '#606470' }}>{item.description}</Text>
                            </View>
                            <MaterialCommunityIcons name="greater-than" size={24} color="black" style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 15 }} />
                        </View>
                    </TouchableOpacity>
                }
            />
        </View>
    )
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    boxContainer: {
        margin: 20,
        padding: 10,
        flexDirection: 'row',
    }
});