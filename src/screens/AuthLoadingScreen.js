import React, { useEffect } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import auth from "@react-native-firebase/auth"

export default function AuthLoadingScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        // User is signed in and email is verified, navigate to MainApp
        navigation.replace("MainApp")
      } else {
        // User is signed out or email is not verified, navigate to Welcome screen
        navigation.replace("Welcome")
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

