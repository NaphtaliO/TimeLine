import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState } from 'react';


const ImageScreen = ({ route, navigation }) => {
    //const [image, setImage] = useState(null);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const image = route.params.image;
    //setImage(photo);

    if (image === null  || image === "") {
        return (
            <View>
                <Text>Null</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, }}>
            <Image
                style={{
                    height: (90 / 100) * windowHeight,
                    width: windowWidth,
                }}
                source={{
                    uri: image.uri
                }} />
            <View style={{
                 
            }}>
                <Text>Hello</Text>
            </View>
        </View>
    )
}

export default ImageScreen

const styles = StyleSheet.create({})