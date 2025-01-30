import React, { useEffect } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import auth from "@react-native-firebase/auth"
import SplashScreen from "react-native-splash-screen"

export default function AuthLoadingScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    const checkAuthState = async () => {
      const user = auth().currentUser
      if (user && user.emailVerified) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        })
      }
      // Hide the splash screen once navigation is complete
      SplashScreen.hide()
    }

    const unsubscribe = auth().onAuthStateChanged(checkAuthState)

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

