import { initializeApp } from "@react-native-firebase/app"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBdQHjNwhlDLoGo9ByOwARWpLJ3YNK4vHQ",
  authDomain: "scihealth-b889b.firebaseapp.com",
  projectId: "scihealth-b889b",
  storageBucket: "scihealth-b889b.firebasestorage.app",
  messagingSenderId: "922008977707",
  appId: "1:922008977707:android:6637c9fcab883e54d4056e",
}

const app = initializeApp(firebaseConfig)

export { auth, firestore }

