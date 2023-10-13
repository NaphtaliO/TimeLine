import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-toast-notifications";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import MainNav from "./MainNav";
import { Provider } from "react-redux";
import store from "./state_management/store";

// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  APIKEY,
  AUTHDOMAIN,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
  MEASUREMENTID,
} from "@env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
};

let app;
// Initialize Firebase
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const storage = getStorage(app);

const App = () => {
  return (
    <Provider store={store}>
      <ActionSheetProvider>
        <ToastProvider offsetBottom={90} swipeEnabled={true}>
          <NavigationContainer>
            <MainNav />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ToastProvider>
      </ActionSheetProvider>
    </Provider>
  );
};

export default App;