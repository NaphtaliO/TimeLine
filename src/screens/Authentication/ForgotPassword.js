import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState } from "react";
import { THEME_COLOUR } from "../../Constants";
import { URL } from "@env";

const ForgotPassword = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const sendCode = async () => {
        if (loading || email === "") return;
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/auth/sendForgotPasswordCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error)
            }

            if (response.ok) {
                if (json.message === "sent") {
                    navigation.navigate("ForgotPassword2", {
                      email: email,
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Forgot Password</Text>
            <Text style={styles.paragraph}>
                We'll email you a code to reset your password
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Email address"
                onChangeText={(newEmail) => setEmail(newEmail)}
                autoCapitalize="none"
                defaultValue={email}
                autoCorrect={false}
                clearTextOnFocus={false}
            />
            {error === "" ? (
                <Text></Text>
            ) : (
                <View style={styles.textField}>
                    <Text
                        style={[styles.text, { alignSelf: "flex-start", color: "red" }]}
                    >
                        {error}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={[{ width: "80%" }, styles.buttonContainer]}
                onPress={sendCode}
            >
                <View>
                    {loading ? (
                        <ActivityIndicator
                            style={{ padding: 10 }}
                            size="small"
                            color="white"
                        />
                    ) : (
                        <Text style={styles.button}>Send Code</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 30,
        paddingVertical: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        paddingBottom: 7,
    },
    paragraph: {
        color: "#606470",
        paddingBottom: 30
    },
    input: {
        backgroundColor: "#F1F1F1",
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 10,
        borderStyle: "solid",
        borderColor: "#FDEFF4",
        borderWidth: 1.5,
    },
    textField: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text: {
        fontSize: 12,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: THEME_COLOUR,
        borderRadius: 10,
        width: "100%",
    },
    button: {
        padding: 10,
        color: "white",
        fontWeight: "600",
    },
});
