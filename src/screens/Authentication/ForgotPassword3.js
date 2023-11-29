import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { THEME_COLOUR } from "../../Constants";
import { URL } from "@env";

const ForgotPassword3 = ({ navigation, route }) => {
    const { email } = route.params;
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        if (loading || password === "") {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/auth/changeForgottenPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            }

            if (response.ok) {
                if (json.message === "Password Changed") {
                    alert("Password changed. Sign in");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "SignIn" }],
                    });
                }
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text>Change Password</Text>
            <TextInput
                style={styles.input}
                placeholder="New Password"
                onChangeText={(newPassword) => setPassword(newPassword)}
                autoCapitalize="none"
                defaultValue={password}
                autoCorrect={false}
                secureTextEntry={true}
                clearTextOnFocus={false}
            />
            {error == "" ? (
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
                onPress={changePassword}
            >
                <View>
                    {loading ? (
                        <ActivityIndicator
                            style={{ padding: 10 }}
                            size="small"
                            color="white"
                        />
                    ) : (
                        <Text style={styles.button}>Change Password</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 30,
        paddingVertical: 50,
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
        width: "90%",
    },
    button: {
        padding: 10,
        color: "white",
        fontWeight: "600",
    },
});
