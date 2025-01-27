import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"

// Import medicine images
import vitamins from "../assets/medicine/vitamins.png"
import syrup from "../assets/medicine/syrup.png"
// Import the rest of your medicine images here...

const medicinePictures = [
  { id: "1", source: vitamins, name: "Vitamins" },
  { id: "2", source: syrup, name: "Syrup" },
  // Add the rest of your medicine images here...
]

// This is a mock data array. In a real app, this would come from a backend or local storage.
const initialMedicines = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "500mg",
    frequency: "Twice daily",
    picture: vitamins,
    strength: "500mg",
    condition: "After meal",
    startDate: new Date("2023-05-01"),
    duration: "30 days",
    alarmTime: new Date("2023-05-01T09:00:00"),
    selectedDays: [true, true, true, true, true, true, true],
  },
  {
    id: "2",
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    picture: syrup,
    strength: "400mg",
    condition: "With food",
    startDate: new Date("2023-05-02"),
    duration: "As needed",
    alarmTime: new Date("2023-05-02T14:00:00"),
    selectedDays: [true, false, true, false, true, false, false],
  },
  // Add more mock data here...
]

export default function MedicineScreen() {
  const [medicines, setMedicines] = useState(initialMedicines)
  const [searchQuery, setSearchQuery] = useState("")
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    if (route.params?.newMedicine) {
      const newMedicine = {
        ...route.params.newMedicine,
        id: (medicines.length + 1).toString(),
        picture: medicinePictures.find((pic) => pic.id === route.params.newMedicine.pictureId)?.source,
        startDate: new Date(route.params.newMedicine.startDate),
        alarmTime: new Date(route.params.newMedicine.alarms[0]),
      }
      setMedicines((prevMedicines) => [...prevMedicines, newMedicine])
      navigation.setParams({ newMedicine: undefined })
    }
  }, [route.params?.newMedicine])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setMedicines(initialMedicines)
    } else {
      const filteredMedicines = initialMedicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(query.toLowerCase()),
      )
      setMedicines(filteredMedicines)
    }
  }

  const handleAddMedicine = () => {
    navigation.navigate("AddMedicine")
  }

  const handleMedicinePress = (medicine) => {
    navigation.navigate("MedicineDetails", { medicine })
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
        data={medicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

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
    // borderBottomWidth: 1,
    // borderBottomColor: "#E0E0E0",
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
    // borderWidth: 1,
    // borderColor: "#E8ECF4",
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
    // borderWidth: 1,
    // borderColor: "#E8ECF4",
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
});

