import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';

const Loading = () => {
  return (
      <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
      }}>
          <ActivityIndicator size='large' color="black" />
      </View>
  )
}

export default Loading;