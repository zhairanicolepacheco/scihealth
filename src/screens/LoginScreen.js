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
import { auth } from "../firebase/config"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        Alert.alert(
          "Email not verified",
          "Please verify your email before logging in. Do you want to resend the verification email?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => auth().signOut(),
            },
            {
              text: "Resend",
              onPress: async () => {
                await user.sendEmailVerification()
                Alert.alert("Verification email sent", "Please check your inbox and verify your email")
                auth().signOut()
              },
            },
          ],
        )
      } else {
        console.log("Login successful")
        // The AuthLoadingScreen will handle navigation to MainApp
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Login Error", error.message)
    } finally {
      setLoading(false)
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
          <Text style={styles.headerText}>Welcome back!</Text>
          <Text style={styles.headerText}>Glad to see you, Again!</Text>
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
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerLinkTextBold}>Register</Text>
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
    textAlign: "left",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#196EB0",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#196EB0",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 160,
  },
  registerLinkText: {
    color: "#666",
    fontSize: 16,
  },
  registerLinkTextBold: {
    fontWeight: "bold",
    color: "#196EB0",
  },
})

