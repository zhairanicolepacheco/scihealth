import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"
import styles from "../components/styles"
import CustomButton from "../components/CustomButton"

// Form field component (reused from RegisterScreen)
const FormField = ({ icon, children }) => (
  <View style={styles.authInputContainer}>
    <Icon name={icon} size={20} color="#196EB0" style={styles.inputIcon} />
    {children}
  </View>
)

// Password input component
const PasswordInput = ({ value, onChangeText, showPassword, togglePassword }) => (
  <View style={styles.authInputContainer}>
    <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
    <TextInput
      style={styles.authInput}
      placeholder="Password"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity onPress={togglePassword} style={styles.authEyeIcon}>
      <Icon 
        name={showPassword ? "eye-outline" : "eye-off-outline"} 
        size={20} 
        color="#196EB0" 
      />
    </TouchableOpacity>
  </View>
)

export default function LoginScreen() {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // UI state
  const [uiState, setUiState] = useState({
    showPassword: false,
    loading: false
  })

  const navigation = useNavigation()

  // Update form data
  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Update UI state
  const updateUiState = (field, value) => {
    setUiState(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async () => {
    const { email, password } = formData

    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    updateUiState('loading', true)

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
        return
      } 

      // Step 3: Get user role from Firestore
      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get()

        if (!userDoc.exists) {
          console.error("User document not found in Firestore")
          Alert.alert("Error", "User profile not found")
          await auth().signOut()
          return
        }

        const userData = userDoc.data()
        console.log("User role:", userData?.role) // Debug log

        // Step 4: Navigate based on role
        if (userData?.role?.toLowerCase() === "admin") {
          console.log("Redirecting to AdminDashboard") // Debug log
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminDashboard" }],
          })
        } else {
          console.log("Redirecting to MainApp") // Debug log
          navigation.reset({
            index: 0,
            routes: [{ name: "MainApp" }],
          })
        }
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError)
        Alert.alert("Error", "Failed to load user profile")
        await auth().signOut()
      }
    } catch (authError) {
      console.error("Authentication error:", authError)
      Alert.alert(
        "Login Error",
        authError.code === "auth/user-not-found"
          ? "No account found with this email"
          : authError.code === "auth/wrong-password"
            ? "Invalid password"
            : authError.message,
      )
    } finally {
      updateUiState('loading', false)
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#196EB0" />
      </TouchableOpacity>
    </View>
  )

  const renderForm = () => (
    <View style={styles.formContainer}>
      <FormField icon="mail-outline">
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => updateForm('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </FormField>

      <PasswordInput
        value={formData.password}
        onChangeText={(value) => updateForm('password', value)}
        showPassword={uiState.showPassword}
        togglePassword={() => updateUiState('showPassword', !uiState.showPassword)}
      />

      <TouchableOpacity 
        style={styles.forgotPassword} 
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton
        title="Login"
        onPress={handleLogin}
        loading={uiState.loading}
        color="primary"
        variant="contained"
      />

      <CustomButton
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
        color="primary"
        variant="text"
        style={styles.registerLink}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Welcome back!</Text>
          <Text style={styles.headerText}>Glad to see you, Again!</Text>
        </View>
        {renderForm()}
      </View>
    </SafeAreaView>
  )
}