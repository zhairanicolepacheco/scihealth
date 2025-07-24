"use client"

import { useEffect } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import SplashScreen from "react-native-splash-screen"

export default function AuthLoadingScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = auth().currentUser
        console.log("Current user:", user) // Debug log

        if (user && user.emailVerified) {
          // Get user role from Firestore
          const userDoc = await firestore().collection("users").doc(user.uid).get()

          if (!userDoc.exists) {
            console.log("User document not found") // Debug log
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            })
            return
          }

          const userData = userDoc.data()
          console.log("User data:", userData) // Debug log

          // Strict equality check and explicit role values
          if (userData && userData.role && userData.role.toLowerCase() === "admin") {
            console.log("Navigating to AdminDashboard") // Debug log
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminDashboard" }],
            })
          } else {
            console.log("Navigating to MainApp") // Debug log
            navigation.reset({
              index: 0,
              routes: [{ name: "MainApp" }],
            })
          }
        } else {
          console.log("User not verified or not logged in") // Debug log
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          })
        }
        // Hide the splash screen once navigation is complete
        SplashScreen.hide()
      } catch (error) {
        console.error("Error checking auth state:", error)
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        })
        SplashScreen.hide()
      }
    }

    // Initial check
    checkAuthState()

    // Set up listener for auth state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        checkAuthState()
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        })
        SplashScreen.hide()
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [navigation])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#196EB0" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
})

