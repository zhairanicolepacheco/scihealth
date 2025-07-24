"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { firestore } from "../firebase/config"
import { medicinePictures } from "../components/constants"
import { formatDate, formatTime } from "../components/functions"

const DayCircle = ({ day, selected }) => (
  <View style={[styles.dayCircle, selected && styles.selectedDayCircle]}>
    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
  </View>
)

const MedicineDetailsScreen = ({ route }) => {
  const { medicineId } = route.params
  const { from } = route.params
  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
          setError("Medicine not found")
        }
      } catch (err) {
        console.error("Error fetching medicine:", err)
        setError("Failed to load medicine details")
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [medicineId])

  const handleDelete = () => {
    Alert.alert("Delete Medicine", "Are you sure you want to delete this medicine?", [
      { text: "Cancel", style: "cancel" },
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

  const handleUpdate = () => {
    navigation.navigate('AddMedicine', {
      isUpdate: true,
      medicine: {
        ...medicine,
        startDate: medicine.startDate?.toDate(),
        alarms: medicine.alarms?.map(alarm => alarm.toDate()),
        duration: medicine.duration?.split(' ')[0] || '0',
        durationUnit: medicine.duration?.split(' ')[1] || 'days'
      }
    })
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#196EB0" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!medicine) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No medicine data available</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#196EB0" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medicine Details</Text>
          </View>
         
          {from != 'admin' && (
            <View style={{flexDirection: "row", alignItems: "center", gap: 30}}>
              <TouchableOpacity onPress={handleUpdate}>
                <Icon name="create-outline" size={24} color="#196EB0" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleDelete}>
                <Icon name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>   
          )} 
        </View>

        <View style={styles.medicineInfo}>
          {medicine.picture && <Image source={medicine.picture} style={styles.medicineImage} />}
          <View style={styles.medicineDetails}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.medicineInstructions}>{medicine.condition}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.weekDaysContainer}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <DayCircle
                key={index}
                day={day}
                selected={medicine.selectedDays ? medicine.selectedDays[index] : false}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Start date</Text>
              <Text style={styles.infoValue}>{formatDate(medicine.startDate?.toDate(), false)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{medicine.duration || "Not specified"}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Dosage</Text>
              <Text style={styles.infoValue}>{medicine.dosage || "Not specified"}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Strength</Text>
              <Text style={styles.infoValue}>
                {medicine.strength ? `${medicine.strength} mg/ml` : "Not specified"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.reminderSection}>
            {medicine.alarms && medicine.alarms.length > 0 ? (
              medicine.alarms.map((alarm, index) => (
                <View key={index} style={styles.reminderItem}>
                  <View style={styles.timeContainer}>
                    <Icon name="alarm-outline" size={20} color="#196EB0" />
                    <Text style={styles.timeText}>{formatTime(alarm.toDate())}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.detailValue}>No alarms set</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#196EB0",
  },
  medicineInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  medicineImage: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#196EB0",
    marginTop: 30,
    marginBottom: 8,
  },
  medicineInstructions: {
    fontSize: 16,
    color: "#666",
    textTransform:'capitalize',
    fontStyle:'italic',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#196EB0",
    marginBottom: 16,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#196EB0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayCircle: {
    backgroundColor: "#196EB0",
  },
  dayText: {
    fontSize: 15,
    color: "#196EB0",
  },
  selectedDayText: {
    color: "#fff",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#196EB0",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  infoLabel: {
    color: "#666",
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 600
  },
  infoValue: {
    fontWeight: "500",
    color: "#333",
    fontSize: 14,
    textAlign:'right'
  },
  reminderSection: {
    borderWidth: 1,
    borderColor: "#196EB0",
    borderRadius: 8,
    padding: 16,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
})

export default MedicineDetailsScreen

