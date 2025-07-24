"use client"

import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"
import { medicinePictures } from "../components/constants"
import { COLORS } from "../components/styles"

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
        <Text style={[styles.medicineName, { textTransform: 'capitalize' }]}>{item.name}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Medicines</Text>
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
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddMedicine}>
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 16,
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#196EB0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
})