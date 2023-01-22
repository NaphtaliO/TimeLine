import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MainNav from './MainNav';
import { Provider } from 'react-redux';
import store from './state_management/store';

// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdhZT4DOJvYwfb_DdoebDwDz_wO1eApO8",
  authDomain: "timeline-95875.firebaseapp.com",
  projectId: "timeline-95875",
  storageBucket: "timeline-95875.appspot.com",
  messagingSenderId: "477727093299",
  appId: "1:477727093299:web:426429d88f13c7ebd02946",
  measurementId: "G-96857XW9TW"
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
      <NavigationContainer>
        <MainNav />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>

  );
}

export default App;
