import { FlatList, StyleSheet } from 'react-native';
import React from 'react';
import ChatItem from '../../Components/ChatItem';

const DATA = [
    {
        id: 1,
        avatar: "https://firebasestorage.googleapis.com/v0/b/timeline-95875.appspot.com/o/640f3f4859d0a1aafb7cd4d2%2Fd553499e-b764-4e30-9f2f-483cdb6a6399?alt=media&token=665a4fc4-e809-416c-b645-02009a1dd527",
        time: "6 days ago",
        name: "Admin",
        text: "My train wat at 2pm. 👀"
    },
    {
        id: 2,
        avatar: "https://firebasestorage.googleapis.com/v0/b/timeline-95875.appspot.com/o/640f3f4859d0a1aafb7cd4d2%2Fd553499e-b764-4e30-9f2f-483cdb6a6399?alt=media&token=665a4fc4-e809-416c-b645-02009a1dd527",
        time: "6 days ago",
        name: "Admin",
        text: "My train wat at 2pm. 👀"
    },
]



const Chat = ({ navigation }) => {
    return (
        <FlatList
            style={styles.container}
            data={DATA}
            renderItem={({ item }) =>
                <ChatItem item={item} navigation={navigation} />
            }
            keyExtractor={item => item.id} />
    );
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});