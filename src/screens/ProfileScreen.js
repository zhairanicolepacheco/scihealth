"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Icon from "react-native-vector-icons/Ionicons"
import { formatDate } from "../components/functions"

import defaultMale from "../assets/default-male.png"
import defaultFemale from "../assets/default-female.png"
import defaultProfile from "../assets/default-profile.png"

const COLORS = {
  primary: "#2563eb",
  white: "#FFFFFF",
  black: "#1A1A1A",
  danger: "#ef4444",
  text: {
    primary: "#1A1A1A",
    secondary: "#71757B",
  },
  background: {
    blue: "#2563eb",
  },
  border: {
    light: "#E5E7EB",
  },
}

const MenuItem = ({ label, icon, onPress, value, type, isLast }) => {
  const getIconColor = () => {
    if (label === "Change Password") return "#FFB200"
    if (label === "Logout") return "red"
    return COLORS.primary
  }

  const getIconBackgroundColor = () => {
    if (label === "Change Password") return "#FFFBE6"
    if (label === "Logout") return "#FFEBEB"
    return "#EFF6FF"
  }

  const menuItemStyle = type === "button" ? [
    styles.menuItem,
    styles.buttonMenuItem
  ] : styles.menuItem

  return (
    <>
      <TouchableOpacity 
        style={menuItemStyle} 
        onPress={type === "button" ? onPress : undefined}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
            <Icon name={icon} size={20} color={getIconColor()} />
          </View>
          <View>
            <Text style={styles.menuItemText}>{label}</Text>
            {type === "text" && value && <Text style={styles.menuItemValue}>{value}</Text>}
          </View>
        </View>
      </TouchableOpacity>
      {type === "text" && !isLast && <View style={styles.separator} />}
    </>
  )
}

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [profilePic, setProfilePic] = useState(defaultProfile)
  const [userDetails, setUserDetails] = useState({
    name: "",
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
          name: userData.name,
          username: userData.username,
          gender: userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1),
          dateOfBirth: formatDate(userData.dateOfBirth.toDate(), false),
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

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword")
  }

  const renderTextItems = () => (
    <View style={styles.menuItemContainer}>
      <MenuItem label="Username" icon="at-outline" value={userDetails.username} type="text" />
      <MenuItem label="Gender" icon="male-female-outline" value={userDetails.gender} type="text" />
      <MenuItem label="Birthday" icon="calendar-outline" value={userDetails.dateOfBirth} type="text" />
      <MenuItem label="Email" icon="mail-outline" value={userDetails.email} type="text" isLast />
    </View>
  )

  const renderButtonItems = () => (
    <>
      <View style={styles.menuItemContainer}>
        <MenuItem
          label="Change Password"
          icon="key-outline"
          onPress={handleChangePassword}
          type="button"
        />
      </View>
      <View style={styles.menuItemContainer}>
        <MenuItem
          label="Logout"
          icon="log-out-outline"
          onPress={handleLogout}
          type="button"
        />
      </View>
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background.blue} barStyle="light-content" />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.profilePicWrapper}>
            <Image source={profilePic} style={styles.profilePic} />
          </View>
          <Text style={styles.username}>{userDetails.name}</Text>
        </View>

        <View style={styles.menuList}>
          {renderTextItems()}
          {renderButtonItems()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: COLORS.background.blue,
  },
  profilePicWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 4,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 16,
  },
  profilePic: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  menuList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 8,
  },
  menuItemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  buttonMenuItem: {
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text.primary,
  },
  menuItemValue: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: 16,
  },
})