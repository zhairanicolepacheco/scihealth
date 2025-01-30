import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { firestore } from "../firebase/config"

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

const DayCircle = ({ day, selected }) => (
  <View style={[styles.dayCircle, selected && styles.selectedDayCircle]}>
    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
  </View>
)

const MedicineDetailsScreen = ({ route }) => {
  const { medicineId } = route.params
  const [medicine, setMedicine] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const medicineDoc = await firestore().collection("medicines").doc(medicineId).get()
        if (medicineDoc.exists) {
          const medicineData = medicineDoc.data()
          const medicineImage = medicinePictures.find((pic) => pic.id === medicineData.pictureId)
          setMedicine({
            id: medicineDoc.id,
            ...medicineData,
            picture: medicineImage ? medicineImage.source : null,
          })
        } else {
          Alert.alert("Error", "Medicine not found")
          navigation.goBack()
        }
      } catch (error) {
        console.error("Error fetching medicine:", error)
        Alert.alert("Error", "Failed to load medicine details")
      }
    }

    fetchMedicine()
  }, [medicineId, navigation])

  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return "Not set"
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) {
      return "Not set"
    }
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
  }

  const getDaysString = (selectedDays) => {
    if (!Array.isArray(selectedDays) || selectedDays.length !== 7) {
      return "Not set"
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days.filter((_, index) => selectedDays[index]).join(", ") || "None"
  }

  const handleDelete = () => {
    Alert.alert("Delete Medicine", "Are you sure you want to delete this medicine?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await firestore().collection("medicines").doc(medicineId).delete()
            navigation.goBack()
          } catch (error) {
            console.error("Error deleting medicine:", error)
            Alert.alert("Error", "Failed to delete medicine")
          }
        },
        style: "destructive",
      },
    ])
  }

  if (!medicine) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#196EB0" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Medicine Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Icon name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {medicine.picture && <Image source={medicine.picture} style={styles.medicineImage} />}
        <Text style={styles.medicineName}>{medicine.name || "Unknown Medicine"}</Text>
        <View style={styles.card}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <View style={styles.daysContainer}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <DayCircle
                key={index}
                day={day}
                selected={medicine.selectedDays ? medicine.selectedDays[index] : false}
              />
            ))}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dosage:</Text>
            <Text style={styles.detailValue}>{medicine.dosage || "Not specified"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Strength:</Text>
            <Text style={styles.detailValue}>{medicine.strength || "Not specified"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Condition:</Text>
            <Text style={styles.detailValue}>{medicine.condition || "Not specified"}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{formatDate(medicine.startDate?.toDate())}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{medicine.duration || "Not specified"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reminder Time:</Text>
            <Text style={styles.detailValue}>{formatTime(medicine.alarms?.[0]?.toDate())}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#196EB0",
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  medicineImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  medicineName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#196EB0",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#196EB0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayCircle: {
    backgroundColor: "#196EB0",
  },
  dayText: {
    fontSize: 14,
    color: "#196EB0",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
})

export default MedicineDetailsScreen

