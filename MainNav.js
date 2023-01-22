import React, { useState, useEffect, useRef } from 'react'
import { TouchableOpacity, ActionSheetIOS } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, FontAwesome, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Profile from './screens/Profile/Profile';
import Home from './screens/Home/Home';
import Settings from './screens/Profile/Settings/Settings';
import EditProfile from './screens/Profile/EditProfile';
import Post from './screens/Post/Post';
import CameraScreen from './screens/CameraScreen/CameraScreen';
import ImageScreen from './screens/CameraScreen/ImageScreen';
import Loading from './Components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import PostScreen from './screens/Post/PostScreen';
import CreateAccount from './screens/Authentication/CreateAccount';
import LogIn from './screens/Authentication/LogIn';
import { logIn } from './state_management/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'
import CommentsScreen from './screens/Post/CommentsScreen';
import FollowingScreen from './screens/Profile/FollowingScreen';
import UserProfileScreen from './screens/Home/UserProfileScreen';
import Search from './screens/Search/Search';
import AccountInformation from './screens/Profile/Settings/AccountInformation';
import DeleteAccount from './screens/Profile/Settings/DeleteAccount';
import PersonalInformation from './screens/Profile/Settings/PersonalInformation';
import Security from './screens/Profile/Settings/Security';
import ChangePassword from './screens/Profile/Settings/ChangePassword';
import Report from './screens/Report/Report';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNav = ({ navigation }) => {
    const user = useSelector((state) => state.user.value);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return <Foundation name="home" size={size} color={color} />;
                    }
                    if (route.name === 'Search') {
                        return <FontAwesome name="search" size={size} color={color} />;
                    }
                    if (route.name === 'PostScreen') {
                        return <Feather name="plus-square" size={size} color={color} />;
                    }
                    if (route.name === 'Profile') {
                        return <Ionicons name="person-outline" size={size} color={color} />;
                    }
                },
                "tabBarActiveTintColor": "black",
                "tabBarInactiveTintColor": "gray",
                "tabBarShowLabel": false,
                "tabBarStyle": {
                    "display": "flex",
                },
            })}>
            <Tab.Screen name="Home" component={Home} options={{
                headerTitle: 'TimeLine'
            }} />
            <Tab.Screen name="Search" component={Search} options={{
                headerShown: false
            }} />
            <Tab.Screen name="PostScreen" component={PostScreen} options={{}} listeners={({ navigation }) => ({
                tabPress: (e) => {
                    e.preventDefault()
                    navigation.navigate('Post')
                }
            })} />
            <Tab.Screen name="Profile" component={Profile} options={{
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Ionicons name="ios-settings-outline" size={24} color="black" style={{ marginRight: 15 }} /></TouchableOpacity>
                ), headerTitle: user.username
            }} />
        </Tab.Navigator>
    )
}

const MainNav = ({ route }) => {

    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    useEffect(() => {
        const getData = async () => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                const user = JSON.parse(await AsyncStorage.getItem('user'));
                if (user) {
                    dispatch(logIn(user))
                }
            } catch (error) {
                console.log(e.message);
            }
            setLoading(false);
        }
        getData();
    }, [])

    const bottomSheet = ({ navigation, id }) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Report"],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark'
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    navigation.navigate('ReportScreen', { entityType: "User", entityId: id })
                }
            }
        );
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (

        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={26} color="black" style={{}} /></TouchableOpacity>
                )
            })}
        >
            {user ?
                <>
                    <Stack.Screen
                        name="TabNav"
                        component={TabNav}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="EditProfile"
                        component={EditProfile}
                        options={({ navigation }) => ({
                            // headerLeft: () => (
                            //     <TouchableOpacity onPress={() => navigation.goBack()}>
                            //         <Ionicons name="chevron-back" size={26} color="black" style={{}} />
                            //     </TouchableOpacity>
                            // ),
                        })}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                        options={({ navigation }) => ({
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={26} color="black" style={{}} /></TouchableOpacity>
                            )
                        })}
                    />
                    <Stack.Screen name="Account Information" component={AccountInformation} />
                    <Stack.Screen name="Personal Information" component={PersonalInformation} />
                    <Stack.Screen name="Security" component={Security} />
                    <Stack.Screen name="Change Password" component={ChangePassword} />
                    <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
                    <Stack.Screen name="Post" component={Post} options={({ navigation }) => ({
                        headerTitle: 'Start Post',
                        gestureDirection: 'vertical',
                        gestureEnabled: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={24} color="black" /></TouchableOpacity>
                        ),
                    })} />
                    {/* <Stack.Screen name="CameraScreen" component={CameraScreen} options={{
                        gestureDirection: 'vertical',
                        headerShown: false,
                    }} /> */}
                    <Stack.Screen name="ImageScreen" component={ImageScreen} options={{
                        gestureDirection: 'vertical',
                        headerShown: false,
                    }} />
                    <Stack.Screen name="CommentsScreen" component={CommentsScreen}
                        options={({ navigation }) => ({
                            headerTitle: "Comments",
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={26} color="black" style={{}} /></TouchableOpacity>
                            )
                        })}
                    />
                    <Stack.Screen name="FollowingScreen" component={FollowingScreen}
                        options={({ route }) => ({ title: route.params.username })} />
                    <Stack.Screen name="ProfileStack" component={Profile} options={({ navigation, }) => ({
                        title: user.username,
                        headerRight: () => (
                            <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Ionicons name="ios-settings-outline" size={24} color="black" /></TouchableOpacity>
                        )
                    })}
                    />
                    <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}
                        options={({ navigation, route }) => ({
                            title: route.params.username,
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={26} color="black" style={{}} /></TouchableOpacity>
                            ),
                            headerRight: () => (
                                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => {
                                    let id = route.params.id
                                    bottomSheet({ navigation, id })
                                }}>
                                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                                </TouchableOpacity>
                            )
                        })}
                    />
                    <Stack.Screen name="ReportScreen" component={Report}
                        options={({ navigation }) => ({
                            headerTitle: 'Report',

                        })}
                    />
                </>
                :
                <>
                    <Stack.Screen name="SignIn" component={LogIn} options={{
                        headerShown: false,
                    }} />
                    <Stack.Screen name="CreateAccount" component={CreateAccount} options={{
                        headerShown: false,
                    }} />
                </>}
        </Stack.Navigator>
    )
}

export default MainNav;