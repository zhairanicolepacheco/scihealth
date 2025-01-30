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

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password should be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const user = auth().currentUser
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword)

      // Reauthenticate user
      await user.reauthenticateWithCredential(credential)

      // Change password
      await user.updatePassword(newPassword)

      Alert.alert("Success", "Password changed successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      let errorMessage = "An error occurred. Please try again."
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "The current password is incorrect."
          break
        case "auth/weak-password":
          errorMessage = "The new password is too weak."
          break
        default:
          console.error(error)
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (passwordField) => {
    switch (passwordField) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword)
        break
      case "new":
        setShowNewPassword(!showNewPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
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
          <Text style={styles.headerText}>Create New Password</Text>
          <Text style={styles.subHeaderText}>Your new password must be unique from those previously used.</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => togglePasswordVisibility("current")} style={styles.eyeIcon}>
              <Icon name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#196EB0" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => togglePasswordVisibility("new")} style={styles.eyeIcon}>
              <Icon name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#196EB0" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => togglePasswordVisibility("confirm")} style={styles.eyeIcon}>
              <Icon name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#196EB0" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
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
  eyeIcon: {
    padding: 10,
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

