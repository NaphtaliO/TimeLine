import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    Feather,
    FontAwesome,
    Foundation,
    Ionicons,
} from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import Home from "../screens/Home/Home";
import PostScreen from "../screens/CreatePost/PostScreen";
import Search from "../screens/Search/Search";
import Profile from '../screens/Profile/Profile';
import { TouchableOpacity } from 'react-native';


const Tab = createBottomTabNavigator();

const TabNav = ({ navigation }) => {
    const user = useSelector((state) => state.user.value);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === "Home") {
                        return <Foundation name="home" size={size} color={color} />;
                    }
                    if (route.name === "Search") {
                        return <FontAwesome name="search" size={size} color={color} />;
                    }
                    if (route.name === "PostScreen") {
                        return <Feather name="plus-square" size={size} color={color} />;
                    }
                    if (route.name === "Profile") {
                        return <Ionicons name="person-outline" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: "flex",
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerTitle: "TimeLine",
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="PostScreen"
                component={PostScreen}
                options={{}}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("CreatePost");
                    },
                })}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                            <Ionicons
                                name="ios-settings-outline"
                                size={24}
                                color="black"
                                style={{ marginRight: 15 }}
                            />
                        </TouchableOpacity>
                    ),
                    headerTitle: user.username,
                }}
            />
        </Tab.Navigator>
    );
}

export default TabNav