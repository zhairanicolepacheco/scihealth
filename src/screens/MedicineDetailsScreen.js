import React from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"

const DayCircle = ({ day, selected }) => (
  <View style={[styles.dayCircle, selected && styles.selectedDayCircle]}>
    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
  </View>
)

const MedicineDetailsScreen = ({ route }) => {
  const { medicine } = route.params
  const navigation = useNavigation()

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "Not set"
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
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
        onPress: () => {
          // TODO: Implement delete functionality
          navigation.goBack()
        },
        style: "destructive",
      },
    ])
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
        <Image source={medicine.picture} style={styles.medicineImage} />
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
            <Text style={styles.detailValue}>{formatDate(medicine.startDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{medicine.duration || "Not specified"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reminder Time:</Text>
            <Text style={styles.detailValue}>{formatTime(medicine.alarmTime)}</Text>
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

