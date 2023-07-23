import React, { useState, useEffect } from "react";
import { TouchableOpacity, ActionSheetIOS, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Entypo,
  Feather,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Profile from "./screens/Profile/Profile";
import Home from "./screens/Home/Home";
import Settings from "./screens/Profile/Settings/Settings";
import EditProfile from "./screens/Profile/EditProfile";
import Post from "./screens/Post/Post";
import Loading from "./Components/Loading";
import { useDispatch, useSelector } from "react-redux";
import PostScreen from "./screens/Post/PostScreen";
import CreateAccount from "./screens/Authentication/CreateAccount";
import LogIn from "./screens/Authentication/LogIn";
import { logIn, update } from "./state_management/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentsScreen from "./screens/Post/CommentsScreen";
import FollowingScreen from "./screens/Profile/FollowingScreen";
import UserProfileScreen from "./screens/Home/UserProfileScreen";
import Search from "./screens/Search/Search";
import AccountInformation from "./screens/Profile/Settings/AccountInformation";
import DeleteAccount from "./screens/Profile/Settings/DeleteAccount";
import PersonalInformation from "./screens/Profile/Settings/PersonalInformation";
import Security from "./screens/Profile/Settings/Security";
import ChangePassword from "./screens/Profile/Settings/ChangePassword";
import Report from "./screens/Report/Report";
import { useLogout } from "./hooks/useLogout";
import { URL } from "@env";
import TermsAndConditions from "./Components/TermsAndConditions";
import BlockedUsers from "./screens/Profile/Settings/BlockedUsers";
import Chat from "./screens/Chat/Chat";
import ChatScreen from "./screens/Chat/ChatScreen";
import NewChat from "./screens/Chat/NewChat";
import LikesScreen from "./screens/Post/LikesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
          // if (route.name === "Chat") {
          //   return (
          //     <Ionicons name="ios-chatbox-outline" size={size} color={color} />
          //   );
          // }
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
            navigation.navigate("Post");
          },
        })}
      />
      {/* <Tab.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
              <Entypo
                name="new-message"
                size={22}
                color="black"
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
          ),
          tabBarBadge: 5,
          tabBarBadgeStyle: {
            backgroundColor: "#3AB0FF",
          },
        })}
      /> */}
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
};

const MainNav = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const { logout } = useLogout();

  useEffect(() => {
    const getData = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      try {
        const user = JSON.parse(await AsyncStorage.getItem("user"));
        if (user) {
          dispatch(logIn(user));
        }
      } catch (error) {
        console.log(e.message);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const bottomSheet = ({ navigation, id, username }) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Report", "Block"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          navigation.navigate("ReportScreen", {
            entityType: "User",
            entityId: id,
          });
        } else if (buttonIndex === 2) {
          Alert.alert(
            `Block @${username}?`,
            "They won't be able to find your profile or posts. They won't know you blocked them",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Block",
                style: "destructive",
                onPress: () => {
                  blockUser(id, navigation);
                },
              },
            ]
          );
        }
      }
    );
  };

  const blockUser = async (user_id, navigation) => {
    try {
      const response = await fetch(`${URL}/api/user/blockUser/${user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout();
        }
      }
      if (response.ok) {
        let updatedUser = { ...json, token: user.token };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch(update(updatedUser));
        navigation.goBack();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={26}
                color="black"
                style={{}}
              />
            </TouchableOpacity>
          ),
        })}
      >
        {user ? (
          <>
            {!user?.acceptedTerms ? (
              <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
                options={{
                  headerShown: false,
                }}
              />
            ) : null}
            <Stack.Screen
              name="TabNav"
              component={TabNav}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={({ navigation }) => ({})}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={26}
                      color="black"
                      style={{}}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Account Information"
              component={AccountInformation}
            />
            <Stack.Screen
              name="Personal Information"
              component={PersonalInformation}
            />
            <Stack.Screen name="Security" component={Security} />
            <Stack.Screen name="Change Password" component={ChangePassword} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="Post"
              component={Post}
              options={({ navigation }) => ({
                headerTitle: "Start Post",
                gestureDirection: "vertical",
                gestureEnabled: false,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="x" size={24} color="black" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="BlockedUsers"
              component={BlockedUsers}
              options={{}}
            />
            <Stack.Screen
              name="CommentsScreen"
              component={CommentsScreen}
              options={({ navigation }) => ({
                headerTitle: "Comments",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={26}
                      color="black"
                      style={{}}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="FollowingScreen"
              component={FollowingScreen}
              options={({ route }) => ({ title: route.params.username })}
            />
            <Stack.Screen
              name="ProfileStack"
              component={Profile}
              options={({ navigation }) => ({
                title: user.username,
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                  >
                    <Ionicons
                      name="ios-settings-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="UserProfileScreen"
              component={UserProfileScreen}
              options={({ navigation, route }) => ({
                title: route.params.username,
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back"
                      size={26}
                      color="black"
                      style={{}}
                    />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={{ marginLeft: "auto" }}
                    onPress={() => {
                      let id = route.params.id;
                      let username = route.params.username;
                      bottomSheet({ navigation, id, username });
                    }}
                  >
                    <MaterialCommunityIcons
                      name="dots-horizontal"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ReportScreen"
              component={Report}
              options={({ navigation }) => ({
                headerTitle: "Report",
              })}
            />
            <Stack.Screen
              name="LikesScreen"
              component={LikesScreen}
              options={({ navigation }) => ({
                headerTitle: "Likes",
              })}
            />
            <Stack.Screen
              name="NewChat"
              component={NewChat}
              options={
                {
                  //headerShown: false,
                }
              }
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignIn"
              component={LogIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccount}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default MainNav;
