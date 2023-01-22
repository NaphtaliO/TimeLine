import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ListEmpty = ({ title, message }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    )
}

export default ListEmpty

const styles = StyleSheet.create({
    container: {
        
    },
    title: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 100,
        fontWeight: '600',
        fontSize: 24
    },
    message: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 10,
        fontSize: 16,
        color: "#606471",
        fontWeight: '500'
    }
})