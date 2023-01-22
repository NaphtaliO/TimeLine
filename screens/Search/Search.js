import { SafeAreaView, StyleSheet, TextInput, View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SearchItems from '../../Components/SearchItems';
import SearchBar from 'react-native-platform-searchbar';
import { useLogout } from '../../hooks/useLogout';

const Search = ({ navigation }) => {
  const { logout } = useLogout()
  const user = useSelector((state) => state.user.value);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('')

  const searchUsers = async () => {
    if (text !== "" && !(text.trim().length === 0)) {
      try {
        const response = await fetch(`https://timeline.herokuapp.com/api/user/search/${text.trim()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        })
        const json = await response.json();
        if (!response.ok) {
          if (json.error === "Request is not authorized") {
            logout()
          }
        }
        if (response.ok) {
          setUsers(json)
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    searchUsers()
  }, [text])

  return (

    <View style={styles.container}>
      <SearchBar
        value={text}
        onChangeText={setText}
        placeholder="Search"
        theme="light"
        platform="ios"
        style={styles.searchBar}
        onClear={() => { setText(''); setUsers([]) }}
        onCancel={() => { setText(''); setUsers([]) }}
        autoCapitalize="none"
        autoCorrect={false}
        clearTextOnFocus={false}
      />
      {user.length !== 0 && text !== '' ?
        <FlatList
          ListEmptyComponent={
            <View>
              <Text style={{ justifyContent: 'center', alignItems: 'center' }}>No results for "{text}"</Text>
            </View>
          }
          contentInsetAdjustmentBehavior="automatic"
          data={users}
          renderItem={({ item }) =>
            <SearchItems navigation={navigation} item={item} />
          }
          keyExtractor={item => item._id} />
        : null}


    </View>

  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 50
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
})