"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  UIManager,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { auth, firestore } from "../firebase/config"
import Icon from "react-native-vector-icons/Ionicons"
import { COLORS } from "../components/styles"
import { formatDate } from "../components/functions"

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection("users").where("role", "==", "client").get()

        const usersData = await Promise.all(
          usersSnapshot.docs.map(async (doc) => {
            const userData = doc.data()

            // Fetch notes count for each user
            const notesSnapshot = await firestore()
              .collection("notes")
              .where("userId", "==", doc.id)
              .get()

            // Fetch medicines count for each user
            const medicinesSnapshot = await firestore()
              .collection("medicines")
              .where("userId", "==", doc.id)
              .get()

            return {
              id: doc.id,
              ...userData,
              notesCount: notesSnapshot.size,
              medicinesCount: medicinesSnapshot.size,
            }
          }),
        )

        setUsers(usersData)
        setFilteredUsers(usersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true)
            try {
              await auth().signOut()
              navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
              })
            } catch (error) {
              console.error("Error logging out:", error)
              Alert.alert("Error", "Failed to logout. Please try again.")
            } finally {
              setIsLoggingOut(false)
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleSearch = (text) => {
    setSearchQuery(text)
    const filtered = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(text.toLowerCase()) ||
        user.email?.toLowerCase().includes(text.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  const navigateToMedicines = (userId) => {
    navigation.navigate("AdminMedicineScreen", { userId })
  }

  const navigateToNotes = (userId) => {
    navigation.navigate("AdminNotesScreen", { userId })
  }

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>
          {item.name.replace(/\b\w/g, (char) => char.toUpperCase())}
        </Text>
        <Text style={styles.email}>
          Gender: {item.gender.replace(/\b\w/g, (char) => char.toUpperCase())}
        </Text>
        <Text style={styles.email}>
          Birthday: {formatDate(item.birthday, false)}
        </Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigateToMedicines(item.id)}>
          <Icon name="medkit" size={24} color="#D2665A" />
          <Text style={styles.actionText}>{item.medicinesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigateToNotes(item.id)}>
          <Icon name="document-text" size={24} color="#9AA6B2" />
          <Text style={styles.actionText}>{item.notesCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Icon name="log-out" size={25} color="#EEEDED" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No users found</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2563eb",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  logoutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#212121",
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
  },
  email: {
    fontSize: 13,
    color: "#757575",
  },
  userActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#757575",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 32,
  },
})
