import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, FlatList, TouchableOpacity } from "react-native"
import { Calendar } from "react-native-calendars"
import Icon from "react-native-vector-icons/Ionicons"
import { auth, firestore } from "../firebase/config"

export default function HomeScreen() {
  const [selected, setSelected] = useState("")
  const [medicines, setMedicines] = useState({})
  const [markedDates, setMarkedDates] = useState({})

  useEffect(() => {
    const user = auth().currentUser
    if (user) {
      const unsubscribe = firestore()
        .collection("medicines")
        .where("userId", "==", user.uid)
        .onSnapshot((querySnapshot) => {
          const medicineData = {}
          const newMarkedDates = {}

          querySnapshot.forEach((doc) => {
            const medicine = doc.data()
            const startDate = medicine.startDate.toDate()
            const endDate = new Date(startDate)

            if (medicine.duration.includes("week")) {
              const weeks = Number.parseInt(medicine.duration)
              endDate.setDate(endDate.getDate() + weeks * 7)
            } else {
              endDate.setDate(endDate.getDate() + Number.parseInt(medicine.duration))
            }

            const currentDate = new Date(startDate)
            while (currentDate <= endDate) {
              const dateString = currentDate.toISOString().split("T")[0]
              const isDaily = medicine.selectedDays.every((day) => day === true)

              if (isDaily || medicine.selectedDays[currentDate.getDay()]) {
                if (!medicineData[dateString]) {
                  medicineData[dateString] = []
                }
                medicineData[dateString].push({
                  id: doc.id,
                  name: medicine.name,
                  dosage: medicine.dosage,
                  time: medicine.alarms[0].toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  condition: medicine.condition,
                })
                newMarkedDates[dateString] = { marked: true, dotColor: "#196EB0" }
              }
              currentDate.setDate(currentDate.getDate() + 1)
            }
          })

          setMedicines(medicineData)
          setMarkedDates(newMarkedDates)
        })

      return () => unsubscribe()
    }
  }, [])

  const onDayPress = (day) => {
    setSelected(day.dateString)
  }

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineItemContainer}>
      <View style={styles.medicineItem}>
        <Icon name="medical-outline" size={24} color="#196EB0" style={styles.medicineIcon} />
        <View style={styles.medicineDetails}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <Text style={styles.medicineInfo}>
            {item.dosage} - {item.time}
          </Text>
          {item.condition && <Text style={styles.medicineCondition}>{item.condition}</Text>}
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selected]: { ...markedDates[selected], selected: true, selectedColor: "#196EB0" },
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
              {medicines[selected] && medicines[selected].length > 0 ? (
                <FlatList
                  data={medicines[selected]}
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
  calendarContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 5,
  },
  medicineContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  medicineList: {
    maxHeight: 300,
  },
  medicineItemContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F0F4F8",
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  medicineIcon: {
    marginRight: 15,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  medicineInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  medicineCondition: {
    fontSize: 14,
    color: "#196EB0",
    fontStyle: "italic",
  },
  noMedicineText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
})

