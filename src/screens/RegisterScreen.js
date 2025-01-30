import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"

export default function RegisterScreen() {
  const [username, setUsername] = useState("")
  const [gender, setGender] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigation = useNavigation()

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)

      // Send email verification
      await userCredential.user.sendEmailVerification()

      // Add additional user info to Firestore
      await firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          username,
          gender,
          dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth),
          email,
        })

      Alert.alert(
        "Registration Successful",
        "A verification email has been sent to your email address. Please verify your email before logging in.",
        [
          {
            text: "OK",
            onPress: () => {
              auth().signOut()
              navigation.navigate("Login")
            },
          },
        ],
      )
    } catch (error) {
      console.error(error)
      Alert.alert("Registration Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth
    setShowDatePicker(false)
    setDateOfBirth(currentDate)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#196EB0" />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Hello!</Text>
              <Text style={styles.headerText}>Register to get started</Text>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color="#196EB0" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
              </View>
              <View style={styles.pickerContainer}>
                <Icon name="transgender-outline" size={20} color="#196EB0" style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar-outline" size={20} color="#196EB0" style={styles.inputIcon} />
                <Text style={styles.dateButtonText}>{dateOfBirth.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={dateOfBirth} mode="date" display="default" onChange={onDateChange} />
              )}
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
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#196EB0" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#196EB0" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Register</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
    padding: 20,
  },
  headerTextContainer: {
    marginTop: 20,
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
  pickerContainer: {
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
  picker: {
    flex: 1,
    height: 50,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderColor: "#E8ECF4",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#F7F8F9",
    paddingHorizontal: 10,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#196EB0",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    color: "#666",
    fontSize: 16,
  },
  loginLinkTextBold: {
    fontWeight: "bold",
    color: "#196EB0",
  },
  eyeIcon: {
    padding: 10,
  },
})

