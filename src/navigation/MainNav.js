import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Profile from "../screens/Profile/Profile";
import Settings from "../screens/Profile/Settings/Settings";
import EditProfile from "../screens/Profile/EditProfile";
import Post from "../screens/Post/Post";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import CreateAccount from "../screens/Authentication/CreateAccount";
import LogIn from "../screens/Authentication/LogIn";
import { logIn, update } from "../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentsScreen from "../screens/Post/CommentsScreen";
import FollowingScreen from "../screens/Profile/FollowingScreen";
import UserProfileScreen from "../screens/Home/UserProfileScreen";
import AccountInformation from "../screens/Profile/Settings/AccountInformation";
import DeleteAccount from "../screens/Profile/Settings/DeleteAccount";
import PersonalInformation from "../screens/Profile/Settings/PersonalInformation";
import Security from "../screens/Profile/Settings/Security";
import ChangePassword from "../screens/Profile/Settings/ChangePassword";
import Report from "../screens/Report/Report";
import { useLogout } from "../hooks/useLogout";
import { URL } from "@env";
import TermsAndConditions from "../components/TermsAndConditions";
import BlockedUsers from "../screens/Profile/Settings/BlockedUsers";
import LikesScreen from "../screens/Post/LikesScreen";
import ChangePasswordContinued from "../screens/Profile/Settings/ChangePasswordContinued";
import NetInfo from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import Favourites from "../screens/Profile/Settings/Favourites";
import TabNav from "./TabNav";
// import ForgotPassword from "../screens/Authentication/ForgotPassword";
// import ForgotPassword2 from "../screens/Authentication/ForgotPassword2";
// import ForgotPassword3 from "../screens/Authentication/ForgotPassword3";

const Stack = createNativeStackNavigator();

const MainNav = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const { showActionSheetWithOptions } = useActionSheet();

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      try {
        if (!state.isConnected) {
          toast.show("No Internet Connection");
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    return () => unsubscribe();
  }, []);

  const bottomSheet = ({ navigation, id, username }) => {
    showActionSheetWithOptions(
      {
        options: ["Cancel", "Report", "Block"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        userInterfaceStyle: "dark",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // cancel
            break;

          case 1:
            navigation.navigate("ReportScreen", {
              entityType: "User",
              entityId: id,
            });
            break;

          case 2:
            Alert.alert(
              `Block @${username}?`,
              "They won't be able to find your profile or posts. They won't know you blocked them",
              [
                {
                  text: "Cancel",
                  onPress: () => { },
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
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen
              name="ChangePasswordContinued"
              component={ChangePasswordContinued}
              options={{
                headerTitle: "Change Password",
              }}
            />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

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
              name="Favourites"
              component={Favourites}
            // options={({ navigation }) => ({
            //   headerTitle: "Likes",
            // })}
            />

            {/* <Stack.Screen
              name="NewChat"
              component={NewChat}
              options={
                {
                  //headerShown: false,
                }
              }
            /> */}
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
            {/* <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{
                headerTitle: "Reset",
              }}
            />
            <Stack.Screen
              name="ForgotPassword2"
              component={ForgotPassword2}
              options={{
                headerTitle: "Reset",
              }}
            />
            <Stack.Screen
              name="ForgotPassword3"
              component={ForgotPassword3}
              options={{
                headerTitle: "Reset",
              }}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default MainNav;
