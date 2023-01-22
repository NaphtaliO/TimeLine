import { FlatList, StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

const PersonalInformation = () => {
    const user = useSelector((state) => state.user.value);
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.gender);
    const [pickerState, setPicekerState] = useState(false);
    const pickerRef = useRef();

    const DATA = [
        {
            id: 1,
            title: "Email",
            component: (
                // <TextInput
                //     style={styles.input}
                //     placeholder={"Name"}
                //     defaultValue={email}
                //     onChangeText={newValue => setName(newValue)}
                //     autoCapitalize="none"
                // />
                <Text style={styles.component}>{email}</Text>
            )
        },
        // {
        //     id: 2,
        //     title: "Mobile",
        //     component: (
        //         // <TextInput
        //         //     style={styles.input}
        //         //     placeholder={"Name"}
        //         //     defaultValue={email}
        //         //     onChangeText={newValue => setName(newValue)}
        //         //     autoCapitalize="none"
        //         // />
        //         <Text style={styles.component}>{gender}</Text>
        //     )
        // },
        // {
        //     id: 3,
        //     title: "Date of Birth",
        //     component: (
        //         // <TextInput
        //         //     style={styles.input}
        //         //     placeholder={"Name"}
        //         //     defaultValue={email}
        //         //     onChangeText={newValue => setName(newValue)}
        //         //     autoCapitalize="none"
        //         // />
        //         <Text style={styles.component}>{gender}</Text>
        //     )
        // },
        // {
        //     id: 4,
        //     title: "Gender",
        //     component: (
        //         <TouchableOpacity onPress={() => }>
        //             {gender ?
        //                 <Text style={styles.component}>{gender}</Text>
        //                 :
        //                 <Text style={{ color: '#606470' }}>Gender</Text>}
        //         </TouchableOpacity>
        //     )
        // }
    ];

    const save = async () => {

    }

    return (
        <FlatList
            style={styles.container}
            ListHeaderComponent={
                <Text style={styles.paragraph}>
                    Provide some personal information, this information will not be made public to anyone
                </Text>}
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.componentContainer}>{item.component}</View>
                </View>
            }
            // ListFooterComponent={
            //     <>
            //     <TouchableOpacity onPress={save}>
            //         <View style={styles.buttonContainer}>
            //             {loading ? <ActivityIndicator style={{ padding: 10 }} size="small" color="white" />
            //                 :
            //                 <Text style={styles.button}>Save</Text>}
            //         </View>
            //     </TouchableOpacity>

            // </>
            // }
        />
    )
}

export default PersonalInformation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    paragraph: {
        color: '#606470',
        paddingBottom: 20
    },
    component: {
        fontSize: 16,
    },
    componentContainer: {
        marginLeft: 'auto',
        width: '70%',
    },
    title: {
        fontSize: 16,
        alignSelf: 'flex-end',
        fontWeight: '500'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
        backgroundColor: '#3AB0FF',
        borderRadius: 10,
        width: '90%',
    },
    button: {
        padding: 10,
        color: 'white',
        fontWeight: "600",
    },
})