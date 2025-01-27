import React, { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, FlatList } from "react-native"
import { Calendar } from "react-native-calendars"
import Icon from "react-native-vector-icons/Ionicons"

// Mock data for medicines
const medicineData = {
  "2023-05-20": [
    { id: "1", name: "Aspirin", dosage: "500mg", time: "08:00 AM" },
    { id: "2", name: "Ibuprofen", dosage: "400mg", time: "02:00 PM" },
  ],
  "2023-05-21": [
    { id: "3", name: "Paracetamol", dosage: "1000mg", time: "10:00 AM" },
    { id: "4", name: "Amoxicillin", dosage: "250mg", time: "06:00 PM" },
  ],
}

export default function HomeScreen() {
  const [selected, setSelected] = useState("")
  const [medicines, setMedicines] = useState([])

  const onDayPress = (day) => {
    setSelected(day.dateString)
    setMedicines(medicineData[day.dateString] || [])
  }

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineItem}>
      <Icon name="medical-outline" size={24} color="#196EB0" style={styles.medicineIcon} />
      <View style={styles.medicineDetails}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineInfo}>
          {item.dosage} - {item.time}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Welcome to SciHealth</Text> */}
          <View style={styles.calendarContainer}>
            {/* <Text style={styles.calendarTitle}>Your Schedule</Text> */}
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [selected]: { selected: true, selectedColor: "#196EB0" },
              }}
              theme={{
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#196EB0",
                selectedDayBackgroundColor: "#196EB0",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#196EB0",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#196EB0",
                selectedDotColor: "#ffffff",
                arrowColor: "#196EB0",
                monthTextColor: "#196EB0",
                indicatorColor: "#196EB0",
              }}
            />
          </View>
          {selected && (
            <View style={styles.medicineContainer}>
              <Text style={styles.medicineTitle}>Medicines for {selected}</Text>
              {medicines.length > 0 ? (
                <FlatList
                  data={medicines}
                  renderItem={renderMedicineItem}
                  keyExtractor={(item) => item.id}
                  style={styles.medicineList}
                />
              ) : (
                <Text style={styles.noMedicineText}>No medicines scheduled for this day.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: StatusBar.currentHeight,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 5, // Horizontal shadow offset
      height: 5, // Vertical shadow offset
    },
    shadowOpacity: 0.9, // Shadow opacity
    shadowRadius: 6, // Shadow blur radius
    elevation: 5, // Android-specific shadow
  },  
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 10,
  },
  medicineContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
  },
  medicineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  medicineList: {
    maxHeight: 200,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  medicineIcon: {
    marginRight: 10,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  medicineInfo: {
    fontSize: 14,
    color: "#666",
  },
  noMedicineText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
})

