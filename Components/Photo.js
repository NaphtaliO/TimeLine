import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const Photo = ({ image, setImage, navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: image.uri }} />
        </View>
    )
}

export default Photo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 26,
        marginBottom: 90
    },
    image: {
        // height: (90 / 100) * windowHeight,
        // width: windowWidth,
        height: '100%',
        width: '100%'
    }
})