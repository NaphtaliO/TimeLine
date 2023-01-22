import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';
import CustomImage from './CustomImage';

const SearchItems = ({ navigation, item }) => {
    const user = useSelector((state) => state.user.value)
    return (
        <View style={{ margin: 12 }}>
            <TouchableOpacity onPress={() => { 
                user._id === item._id ? navigation.navigate('ProfileStack') :
                    navigation.navigate('UserProfileScreen', { username: item.username, id: item._id })
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        {item.avatar === null || item.avatar === "" ?
                            <Image style={styles.image} source={require('../assets/default_avatar.png')} /> :
                            <CustomImage style={styles.image} uri={item.avatar} />}
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: 7 }}>
                        <Text style={{ fontWeight: '500', fontSize: 16.5 }}>{item.name}</Text>
                        <Text style={{ color: "#606470", }}>{item.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default SearchItems

const styles = StyleSheet.create({
    image: {
        width: 65,
        height: 65,
        borderRadius: 50
    }

})