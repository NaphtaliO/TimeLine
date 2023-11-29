import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SearchItems from '../../components/SearchItems';
import { SearchBar } from '@rneui/themed';
import { useLogout } from '../../hooks/useLogout';
import { URL } from '@env';

const Search = ({ navigation }) => {
  const { logout } = useLogout()
  const user = useSelector((state) => state.user.value);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (text !== "" && !(text.trim().length === 0)) {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/api/user/search/${text.trim()}`, {
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
      setLoading(false);
    }
  }

  useEffect(() => {
    searchUsers()
  }, [text])

  return (

    <View style={styles.container}>
      <SearchBar
        platform='ios'
        placeholder="Type Here..."
        onChangeText={setText}
        value={text}
        autoCorrect={false}
        clearTextOnFocus={false}
        onClear={() => { setText(''); setUsers([]) }}
        onCancel={() => { setText(''); setUsers([]) }}
      />
      {loading ? <ActivityIndicator color={'black'} /> :
        user.length !== 0 && text !== '' ?
          <FlatList
            ListEmptyComponent={
              <View>
                <Text style={{ marginLeft: 'auto', marginRight: 'auto' }}>No results for "{text}"</Text>
              </View>
            }
            contentInsetAdjustmentBehavior="automatic"
            data={users}
            renderItem={({ item }) =>
              <SearchItems navigation={navigation} item={item} />
            }
            keyExtractor={item => item._id} />
          :
          <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: '500', fontSize: 20, marginTop: 20 }}>
            Search for users on TimeLine
          </Text>
      }
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