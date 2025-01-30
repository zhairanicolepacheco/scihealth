import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

// Importing default profile pictures
import defaultMale from "../assets/default-male.png"
import defaultFemale from "../assets/default-female.png"
import defaultProfile from "../assets/default-profile.png"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [profilePic, setProfilePic] = useState(defaultProfile)
  const [userDetails, setUserDetails] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    email: "",
  })

  useEffect(() => {
    const user = auth().currentUser
    if (user) {
      setUserDetails((prevState) => ({ ...prevState, email: user.email }))
      fetchUserDetails(user.uid)
    }
  }, [])

  const fetchUserDetails = async (userId) => {
    try {
      const userDoc = await firestore().collection("users").doc(userId).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        setUserDetails((prevState) => ({
          ...prevState,
          username: userData.username,
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth.toDate().toISOString().split("T")[0],
        }))
        setProfilePicBasedOnGender(userData.gender)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      Alert.alert("Error", "Failed to load user details. Please try again.")
    }
  }

  const setProfilePicBasedOnGender = (gender) => {
    switch (gender.toLowerCase()) {
      case "male":
        setProfilePic(defaultMale)
        break
      case "female":
        setProfilePic(defaultFemale)
        break
      default:
        setProfilePic(defaultProfile)
    }
  }

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword")
  }

  const handleLogout = async () => {
    try {
      await auth().signOut()
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    } catch (error) {
      console.error("Error during logout:", error)
      Alert.alert("Error", "Failed to logout. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <View style={styles.profilePicContainer}>
          <Image source={profilePic} style={styles.profilePic} />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.usernameRow}>
            {/* <Text style={styles.detailLabel}>Username:</Text> */}
            <Text style={styles.usernameValue}>{userDetails.username}</Text>
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
  usernameRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
  usernameValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    alignItems: "center",
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

