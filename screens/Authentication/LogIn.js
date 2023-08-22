import { TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logIn } from '../../state_management/userSlice';
import { URL } from '@env';
import { THEME_COLOUR } from '../../Constants';

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()


  const signIn = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error)
      }
      if (response.ok) {
        //save user to react native local storage
        await AsyncStorage.setItem('user', JSON.stringify(json))
        //update redux state
        dispatch(logIn(json));
      }
    } catch (e) {
      console.log(e.message);
      setError(e.message)
    }
    setLoading(false);
  }


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={{ marginTop: 120, alignSelf: 'center' }}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Username or email address'
            onChangeText={newEmail => setEmail(newEmail)}
            autoCapitalize="none"
            autoCorrect={false}
            defaultValue={email}
            clearTextOnFocus={false} />
          <TextInput
            style={styles.input}
            placeholder='Password'
            onChangeText={newPassword => setPassword(newPassword)}
            autoCapitalize="none"
            defaultValue={password}
            autoCorrect={false}
            secureTextEntry={true}
            clearTextOnFocus={false} />


          <View style={styles.textField}>
            {error == "" ? <Text></Text> :
              <Text style={[styles.text, { alignSelf: 'flex-start', color: 'red' }]}>{error}</Text>
            }
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.text, { alignSelf: 'flex-end' }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>


        <TouchableOpacity style={[{ width: '80%' }, styles.buttonContainer]} onPress={signIn}>
          <View>
            {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
              : <Text style={styles.button}>Log In</Text>}
          </View>
        </TouchableOpacity>


        <View style={styles.bottom}>
          <Text>Don't have an account?</Text>
          <Button title="Sign Up" onPress={() => navigation.navigate('CreateAccount')} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 40
  },
  input: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: '#FDEFF4',
    borderWidth: 1.5,
  },
  textField: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 12,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: THEME_COLOUR,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    color: 'white',
    fontWeight: "600",
  },
  bottom: {
    width: '100%',
    borderStyle: 'solid',
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
    //position: 'absolute',
    //bottom: 0,
  },
  logo: {
    width: 300,
    height: 200,
  }
})

export default LogIn;
