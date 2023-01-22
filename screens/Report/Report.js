import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { useSelector } from 'react-redux';

const Report = ({ navigation, route }) => {
    const { entityType, entityId } = route.params;
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const user = useSelector((state) => state.user.value);
    const { logout } = useLogout();

    const report = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`https://timeline.herokuapp.com/api/report/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ entityType, entityId, reason: text })
            });
            const json = await response.json()
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                showAlert(json.message)
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    const showAlert = (message) => {
        Alert.alert('Report', `${message}`, [
            { text: 'OK', onPress: () => navigation.goBack() },
        ])
    }


    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Enter your reason for reporting'
                multiline={true}
                numberOfLines={7}
                onChangeText={text => setText(text)}
                autoCapitalize="none"
                autoCorrect={false}
                defaultValue={text}
                clearTextOnFocus={false}
            />

            <TouchableOpacity onPress={report}>
                <View style={styles.buttonContainer}>
                    {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
                        :
                        <Text style={styles.button}>Report</Text>}
                </View>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default Report

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    input: {
        //backgroundColor: 'grey',
        color: 'black',
        padding: 15,
        fontSize: 20,
        alignSelf: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 150,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
        width: '90%',
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
})