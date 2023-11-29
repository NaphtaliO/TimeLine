import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSelector } from "react-redux";
import { maskEmail } from "../../../functions";
import { useLogout } from "../../../hooks/useLogout";
import { URL } from "@env";
import { THEME_COLOUR } from "../../../Constants";

const CELL_COUNT = 6;

const ChangePassword = ({navigation}) => {
  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(false);
  const { logout } = useLogout();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const sendCode = async () => {
    try {
      const response = await fetch(`${URL}/api/user/sendCode`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout();
        }
      }
      if (response.ok) {
        if (json.message === "sent") {
          alert("Code Sent");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const verifyCode = async () => {
    if (value === "" || loading) {
      return;
    }
    setLoading(true)
    try {
      const response = await fetch(`${URL}/api/user/verifyCode/${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout();
        }
        if (json.message === "Wrong code") {
          alert("Incorrect code");
          setValue("");
        }
      }
      if (response.ok) {
        if (json.message === "Verified code correct") {
          navigation.replace('ChangePasswordContinued')
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    sendCode()
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Enter 6-digit code</Text>
      <Text style={styles.paragraph}>
        Your code was sent to {maskEmail(user.email)}
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={sendCode}>
        <Text style={styles.resendButton}>Resend code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[{ width: "80%" }, styles.buttonContainer]}
        onPress={verifyCode}>
        <View>
          {loading ? (
            <ActivityIndicator
              style={{ padding: 10 }}
              size="small"
              color="white"
            />
          ) : (
            <Text style={styles.button}>Verify</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

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
  },
  resendButton: {
    marginTop: 25,
    color: THEME_COLOUR,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    // marginLeft: 'auto',
    // marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 27,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
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
