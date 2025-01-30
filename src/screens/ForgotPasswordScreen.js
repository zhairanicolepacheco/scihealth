import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import auth from "@react-native-firebase/auth"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.")
      return
    }

    setIsLoading(true)
    try {
      await auth().sendPasswordResetEmail(email)
      Alert.alert("Success", "Password reset email sent. Please check your inbox.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } catch (error) {
      let errorMessage = "An error occurred. Please try again."
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "The email address is invalid."
          break
        case "auth/user-not-found":
          errorMessage = "There is no user corresponding to this email address."
          break
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#196EB0" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Forgot Password?</Text>
          <Text style={styles.subHeaderText}>
            Don't worry! It occurs. Please enter the email address linked with your account.
          </Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#196EB0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLinkText}>
              Remember Password? <Text style={styles.loginLinkTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  headerTextContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderColor: "#E8ECF4",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#F7F8F9",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#196EB0",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4E4",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 160,
  },
  loginLinkText: {
    color: "#666",
    fontSize: 16,
  },
  loginLinkTextBold: {
    fontWeight: "bold",
    color: "#196EB0",
  },
})

