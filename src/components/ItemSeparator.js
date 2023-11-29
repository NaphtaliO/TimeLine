import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ItemSeparator = () => {
    return (
        <View style={styles.itemSeparator}></View>
    )
}

export default ItemSeparator

const styles = StyleSheet.create({
    itemSeparator: {
        borderColor: '#B2B2B2',
        borderWidth: 1,
        borderStyle: 'solid',
        width: '95%',
        alignSelf: 'center',
        marginBottom: 10
    }
})