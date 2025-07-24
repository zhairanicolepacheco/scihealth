"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { firestore } from "../firebase/config"
import { medicinePictures } from "../components/constants"
import { COLORS } from "../components/styles"

export default function AdminMedicineScreen() {
  const [medicines, setMedicines] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [name, setName] = useState("")
  const route = useRoute()
  const navigation = useNavigation()
  const { userId } = route.params

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userDoc = await firestore().collection("users").doc(userId).get()
          if (userDoc.exists) {
            setName(userDoc.data().name || "User")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }

      fetchUserData()

      const unsubscribe = firestore()
        .collection("medicines")
        .where("userId", "==", userId)
        .onSnapshot((querySnapshot) => {
          const medicinesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            picture: medicinePictures.find((pic) => pic.id === doc.data().pictureId)?.source,
            startDate: doc.data().startDate.toDate(),
            alarmTime: doc.data().alarms[0].toDate(),
          }))
          setMedicines(medicinesList)
        })

      return () => unsubscribe()
    }
  }, [userId])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleMedicinePress = (medicine) => {
    navigation.navigate("MedicineDetails", { medicineId: medicine.id, from:'admin' })
  }

  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity style={styles.medicineItem} onPress={() => handleMedicinePress(item)}>
      <Image source={item.picture} style={styles.medicineImage} />
      <View style={styles.medicineInfo}>
        <Text style={[styles.medicineName, { textTransform: "capitalize" }]}>{item.name}</Text>
        {/* <Text style={styles.medicineDetails}>
          {item.dosage} - {item.frequency}
        </Text> */}
      </View>
    </TouchableOpacity>
  )

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#196EB0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name}'s Medicines</Text>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No medicines found</Text>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#196EB0",
    flex: 1 
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  medicineImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
})