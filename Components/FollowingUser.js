import { StyleSheet, Text, TouchableWithoutFeedback, View, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import CustomImage from './CustomImage'

const FollowingUser = ({ navigation, item }) => {
    const user = useSelector((state) => state.user.value)

    return (
        <TouchableWithoutFeedback onPress={() => {
                user._id === item._id ? navigation.push('ProfileStack') :
                    navigation.push('UserProfileScreen', { username: item.username, id: item._id })
            }}>
            <View>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <View style={{}}>
                        {item.avatar === null || item.avatar === ""?
                            <Image style={styles.image} source={require('../assets/default_avatar.png')} /> :
                            <CustomImage style={styles.image} uri={item.avatar} />}
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                        <Text>{item.name}</Text>
                        <Text>{item.username}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default FollowingUser

const styles = StyleSheet.create({
    image: {
        width: 75,
        height: 75,
        borderRadius: 50
    }
})