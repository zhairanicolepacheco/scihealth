import React, { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"

// Importing default profile pictures
import defaultMale from "../assets/default-male.png"
import defaultFemale from "../assets/default-female.png"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [profilePic, setProfilePic] = useState(defaultMale)
  const [userDetails, setUserDetails] = useState({
    username: "JohnDoe",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    email: "johndoe@example.com",
  })

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword")
  }

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout")
    navigation.navigate("Welcome")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <View style={styles.profilePicContainer}>
          <Image source={profilePic} style={styles.profilePic} />
          <View style={styles.profilePicOptions}>
            <TouchableOpacity onPress={() => setProfilePic(defaultMale)} style={styles.picOption}>
              <Image source={defaultMale} style={styles.picOptionImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setProfilePic(defaultFemale)} style={styles.picOption}>
              <Image source={defaultFemale} style={styles.picOptionImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Username:</Text>
            <Text style={styles.detailValue}>{userDetails.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{userDetails.gender}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{userDetails.dateOfBirth}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{userDetails.email}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Icon name="key-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Icon name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#196EB0",
    textAlign: "center",
  },
  profilePicContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profilePicOptions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  picOption: {
    marginHorizontal: 10,
  },
  picOptionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#196EB0",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: "#196EB0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

