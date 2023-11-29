import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, listAll, deleteObject, } from 'firebase/storage';
import { useLogout } from '../../../hooks/useLogout';
import { URL } from '@env';


const DeleteAccount = () => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { logout } = useLogout()

    const deleteAlert = () => {
        Alert.alert(
            "Delete Account",
            "This action is permanent and cannot be reversed",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Delete", onPress: () => deleteUser(), style: 'destructive' }
            ]
        )
    }

    //This will delete the users firebase pictures
    const deleteFromFirebase = async () => {
        try {

            let storageRef = ref(getStorage(), `${user._id}/`);
            //If these references exist
            await listAll(storageRef).then((res) => {
                res.items.forEach(async (itemRef) => {
                    await deleteObject(itemRef)
                })
                console.log("Deletion Successful");
            })
        } catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            if (!user) {
                return;
            }
            const response = await fetch(`${URL}/api/user/deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            })

            const json = await response.json()

            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                //Delete from firebase then you can logout
                deleteFromFirebase().then(() => logout())

            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }


    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.header}>Delete your account?</Text>
                <Text style={styles.paragraph}>
                    By clicking the button you will be deleting your account permanently be advised.
                </Text>
            </View>
            <TouchableOpacity onPress={deleteAlert}>
                <View style={styles.buttonContainer}>
                    {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
                        :
                        <Text style={styles.button}>Delete Account Permanently</Text>}
                </View>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default DeleteAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 30
    },
    header: {
        fontWeight: '600',
        fontSize: 20,
        paddingBottom: 25
    },
    paragraph: {
        fontSize: 14
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: 'red',
        borderRadius: 10,
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "700",
        fontSize: 16
    },
})