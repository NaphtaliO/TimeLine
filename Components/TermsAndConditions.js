import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLogout } from '../hooks/useLogout';
import { URL } from '@env';
import { update } from '../state_management/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
//     const paddingToBottom = 20;
//     return layoutMeasurement.height + contentOffset.y >=
//         contentSize.height - paddingToBottom;
// };

const TermsAndConditions = () => {
    const user = useSelector((state) => state.user.value)
    //const [state, setState] = useState({ accepted: false });
    const dispatch = useDispatch();
    const { logout } = useLogout()
    const [loading, setLoading] = useState(false);

    const acceptTerms = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/user/acceptTerms`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
                alert(json.message)
            }
            if (response.ok) {
                let updatedUser = { ...json, token: user.token }
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
                dispatch(update(updatedUser))
            }

        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>Terms and conditions</Text>
                <ScrollView
                    style={styles.tcContainer}
                // onScroll={({ nativeEvent }) => {
                //     if (isCloseToBottom(nativeEvent)) {
                //         setState({
                //             accepted: true
                //         })
                //     }
                // }}
                >
                    <Text style={styles.tcP}>Welcome to TimeLine. If you continue to use this application, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern TimeLine's relationship with you in relation to this app. If you disagree with any part of these terms and conditions, please do not use our application.</Text>
                    <Text style={styles.tcP}>The term 'TimeLine' or 'us' or 'we' refers to the owner of the app 'Naphtali Odinakachi'.</Text>
                    <Text style={styles.tcL}>{'\u2022'} The content of the pages of this app is for your general information and use only. It is subject to change without notice.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Your use of any information or materials on this application is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this application meet your specific requirements.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Your use of this application and any dispute arising out of such use of the application is subject to the laws of Ireland.</Text>
                    <Text style={styles.tcP}>You may not access or use services for any other pupose other than that for which we make the services available. As a user of this application you agree not to </Text>
                    <Text style={styles.tcL}>{'\u2022'} No tolerance for abusive users. Do not abuse users on this platform as it is meant to be a safe space</Text>
                    <Text style={styles.tcL}>{'\u2022'} No tolerance for objectionable content. Such as sexual content or any other content deemed to be objectionable</Text>
                    <Text style={styles.tcL}>{'\u2022'}Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</Text>
                    <Text style={styles.tcL}>{'\u2022'}Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</Text>
                    <Text style={styles.tcL}>{'\u2022'}Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</Text>
                    <Text style={styles.tcL}>{'\u2022'}Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</Text>
                    <Text style={styles.tcL}>{'\u2022'}Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</Text>


                    <Text style={styles.tcP}>The use of this application is subject to the following terms of use</Text>
                </ScrollView>

                <TouchableOpacity onPress={acceptTerms} style={styles.button}>
                    {loading ? <ActivityIndicator color={'white'} /> : <Text style={styles.buttonLabel}>Accept</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const { width, height } = Dimensions.get('window');

export default TermsAndConditions;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontSize: 22,
        alignSelf: 'center'
    },
    tcP: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcP: {
        marginTop: 10,
        fontSize: 12
    },
    tcL: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcContainer: {
        marginTop: 15,
        marginBottom: 15,
        height: height * .7
    },
    button: {
        backgroundColor: '#136AC7',
        borderRadius: 5,
        padding: 10
    },
    buttonDisabled: {
        backgroundColor: '#999',
        borderRadius: 5,
        padding: 10
    },
    buttonLabel: {
        fontSize: 14,
        color: '#FFF',
        alignSelf: 'center'
    }
})

