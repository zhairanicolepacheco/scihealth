import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"
import { formatDate } from "../components/functions"
import styles from "../components/styles"
import CustomButton from "../components/CustomButton"

// Form field component to reduce repetition
const FormField = ({ icon, children, containerStyle }) => (
  <View style={[styles.authInputContainer, containerStyle]}>
    <Icon name={icon} size={20} color="#196EB0" style={styles.inputIcon} />
    {children}
  </View>
)

// Password input component to reduce repetition
const PasswordInput = ({ placeholder, value, onChangeText, showPassword, togglePassword }) => (
  <View style={styles.authInputContainer}>
    <Icon name="lock-closed-outline" size={20} color="#196EB0" style={styles.inputIcon} />
    <TextInput
      style={styles.authInput}
      placeholder={placeholder}
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

export default function RegisterScreen() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    dateOfBirth: new Date(),
    email: "",
    password: "",
    confirmPassword: "",
  })

  // UI state
  const [uiState, setUiState] = useState({
    showDatePicker: false,
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
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

  const handleRegister = async () => {
    const { password, confirmPassword, email, name, username, gender, dateOfBirth } = formData

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    updateUiState('loading', true)

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)
      await userCredential.user.sendEmailVerification()

      await firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          name,
          username,
          gender,
          dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth),
          email,
          role: "client",
        })

      Alert.alert(
        "Registration Successful",
        "A verification email has been sent to your email address. Please verify your email before logging in.",
        [{
          text: "OK",
          onPress: () => {
            auth().signOut()
            navigation.navigate("Login")
          },
        }]
      )
    } catch (error) {
      console.error(error)
      Alert.alert("Registration Error", error.message)
    } finally {
      updateUiState('loading', false)
    }
  }

  const onDateChange = (event, selectedDate) => {
    updateUiState('showDatePicker', false)
    if (selectedDate) {
      updateForm('dateOfBirth', selectedDate)
    }
  }

  const renderForm = () => (
    <View style={styles.formContainer}>
      <FormField icon="person-outline">
        <TextInput 
          style={styles.input} 
          placeholder="John Doe" 
          value={formData.name}
          onChangeText={(value) => updateForm('name', value)}
        />
      </FormField>

      <FormField icon="at-outline">
        <TextInput 
          style={styles.input} 
          placeholder="john_doe" 
          value={formData.username}
          onChangeText={(value) => updateForm('username', value)}
        />
      </FormField>

      <View style={styles.authPickerContainer}>
        <Icon name="male-female-outline" size={20} color="#196EB0" style={styles.inputIcon} />
        <Picker
          selectedValue={formData.gender}
          onValueChange={(value) => updateForm('gender', value)}
          style={styles.authPicker}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TouchableOpacity 
        style={styles.authDateButton}
        onPress={() => updateUiState('showDatePicker', true)}
      >
        <Icon name="calendar-outline" size={20} color="#196EB0" style={styles.inputIcon} />
        <TextInput
          editable={false}
          placeholder="Birthday"
          value={formatDate(formData.dateOfBirth, false)}
          style={[styles.authDateButtonText, formData.dateOfBirth ? styles.textBlack : null]}
          placeholderTextColor="gray"
        />
      </TouchableOpacity>

      {uiState.showDatePicker && (
        <DateTimePicker 
          value={formData.dateOfBirth}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FormField icon="mail-outline">
        <TextInput
          style={styles.input}
          placeholder="john_doe@sample.com"
          value={formData.email}
          onChangeText={(value) => updateForm('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </FormField>

      <PasswordInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => updateForm('password', value)}
        showPassword={uiState.showPassword}
        togglePassword={() => updateUiState('showPassword', !uiState.showPassword)}
      />

      <PasswordInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateForm('confirmPassword', value)}
        showPassword={uiState.showConfirmPassword}
        togglePassword={() => updateUiState('showConfirmPassword', !uiState.showConfirmPassword)}
      />

      <CustomButton
        title="Register"
        onPress={handleRegister}
        loading={uiState.loading}
        color="primary"
        variant="contained"
      />

      <CustomButton
        title="Already have an account? Login"
        onPress={() => navigation.navigate("Login")}
        color="primary"
        variant="text"
        style={styles.loginLink}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Hello!</Text>
              <Text style={styles.headerText}>Register to get started</Text>
            </View>
            {renderForm()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}