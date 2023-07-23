import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AccountInformation = ({navigation}) => {
    const DATA = [
        {
            id: 1,
            title: "Personal Information",
            onPress: () => navigation.navigate('Personal Information')
        },
        {
            id: 2,
            title: "Change Password",
            onPress: () => navigation.navigate('ChangePassword')
        },
        {
            id: 3,
            title: "Delete your account",
            color: "red",
            onPress:  () => navigation.navigate('DeleteAccount'),
        }
    ];
  return (
      <View style={styles.container}>
          <FlatList
              data={DATA}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                  <TouchableOpacity onPress={item.onPress}>
                      {/* </TouchableOpacity> */}
                      <View style={styles.boxContainer}>
                          <View>
                              <Text style={{ fontSize: 20, alignSelf: 'flex-start', fontWeight: '500', color: item.color }}>{item.title}</Text>
                              <Text style={{ fontSize: 15, color: '#606470' }}>{item.description}</Text>
                          </View>
                          <MaterialCommunityIcons name="greater-than" size={24} color="black" style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 15, justifyContent: 'center' }} />
                      </View>
                  </TouchableOpacity>
              }
          />
      </View>
  )
}

export default AccountInformation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    boxContainer: {
        margin: 20,
        padding: 5,
        flexDirection: 'row',
    }
})