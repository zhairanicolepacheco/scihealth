import { initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdQHjNwhlDLoGo9ByOwARWpLJ3YNK4vHQ",
  projectId: "scihealth-b889b",
  storageBucket: "scihealth-b889b.appspot.com", 
  messagingSenderId: "922008977707",
  appId: "1:922008977707:android:99f681cf5f0d16e0d4056e", 
};

const app = initializeApp(firebaseConfig);

export { app, auth, firestore };
