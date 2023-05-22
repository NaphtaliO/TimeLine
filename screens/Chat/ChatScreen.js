import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'

const ChatScreen = () => {
  const [text, setText] = useState('');
  const DATA = [{}]

  return (
    <View style={styles.container}>
      <ScrollView>

      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={84}>
        <View style={{ marginTop: 'auto', marginHorizontal: 20 }}
        // onLayout={event => {
        //   let { height } = event.nativeEvent.layout;
        //   console.log(height);
        // }}
        // Get height of the view for keyboard avoiding view vertical offset
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <TextInput style={styles.input}
              onChangeText={text => setText(text)}
              value={text}
              placeholder={'Add comment...'}
              autoCorrect={false}
              multiline={true}
            />
            <TouchableOpacity onPress={() => { }} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* <Ionicons name="send-outline" size={24} color="black" /> */}
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    //padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginRight: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  }
})