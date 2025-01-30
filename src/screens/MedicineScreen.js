import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"

// Import medicine images
import vitamins from "../assets/medicine/vitamins.png"
import syrup from "../assets/medicine/syrup.png"
import tablets from "../assets/medicine/tablets.png"
import supplement from "../assets/medicine/supplement.png"
import pills from "../assets/medicine/pills.png"
import pills2 from "../assets/medicine/pills-2.png"
import patches from "../assets/medicine/patches.png"
import ointment from "../assets/medicine/ointment.png"
import injection from "../assets/medicine/injection.png"
import inhaler from "../assets/medicine/inhaler.png"
import foodSupplement from "../assets/medicine/food-supplement.png"
import eyeDrops from "../assets/medicine/eye-drops.png"
import drops from "../assets/medicine/drops.png"
import capsule from "../assets/medicine/capsule.png"
import capsule2 from "../assets/medicine/capsule-2.png"

const medicinePictures = [
  { id: "1", source: vitamins, name: "Vitamins" },
  { id: "2", source: syrup, name: "Syrup" },
  { id: "3", source: tablets, name: "Tablets" },
  { id: "4", source: supplement, name: "Supplement" },
  { id: "5", source: pills, name: "Pills" },
  { id: "6", source: pills2, name: "Pills-2" },
  { id: "7", source: patches, name: "Patches" },
  { id: "8", source: ointment, name: "Ointment" },
  { id: "9", source: injection, name: "Injection" },
  { id: "10", source: inhaler, name: "Inhaler" },
  { id: "11", source: foodSupplement, name: "Food Supplement" },
  { id: "12", source: eyeDrops, name: "Eye Drops" },
  { id: "13", source: drops, name: "Drops" },
  { id: "14", source: capsule, name: "Capsule" },
  { id: "15", source: capsule2, name: "Capsule-2" },
]

export default function MedicineScreen() {
  const [medicines, setMedicines] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      const user = auth().currentUser
      if (user) {
        const unsubscribe = firestore()
          .collection("medicines")
          .where("userId", "==", user.uid)
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
    }, []),
  )

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleAddMedicine = () => {
    navigation.navigate("AddMedicine")
  }

  const handleMedicinePress = (medicine) => {
    navigation.navigate("MedicineDetails", { medicineId: medicine.id })
  }

  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity style={styles.medicineItem} onPress={() => handleMedicinePress(item)}>
      <Image source={item.picture} style={styles.medicineImage} />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineDetails}>
          {item.dosage} - {item.frequency}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainHeader}>
        <Text style={styles.mainHeaderText}>SciHealth</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Medicines</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMedicine}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search-outline" size={20} color="#196EB0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
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
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  mainHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#196EB0",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#196EB0",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    padding: 8,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
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
    backgroundColor: "#E8ECF4",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  medicineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: "#666",
  },
})

