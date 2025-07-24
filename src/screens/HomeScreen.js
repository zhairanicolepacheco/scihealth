"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Calendar } from "react-native-calendars"
import { auth, firestore } from "../firebase/config"
import { formatDate } from "../components/functions"
import { dayMapping, medicinePictures } from "../components/constants"
import { useNavigation } from "@react-navigation/native"

const COLORS = {
  primary: "#1976D2",
  surface: "#FFFFFF",
  background: "#F5F5F5",
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#9E9E9E",
    pastDue: "#A31D1D",
  },
  error: "#D32F2F",
  pastDue: "#FDAB9E",
}

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

const calendarTheme = {
  calendarBackground: COLORS.surface,
  textSectionTitleColor: COLORS.primary,
  selectedDayBackgroundColor: COLORS.primary,
  selectedDayTextColor: COLORS.surface,
  todayTextColor: COLORS.primary,
  dayTextColor: COLORS.text.primary,
  textDisabledColor: COLORS.text.disabled,
  dotColor: COLORS.primary,
  selectedDotColor: COLORS.surface,
  arrowColor: COLORS.primary,
  monthTextColor: COLORS.text.primary,
  indicatorColor: COLORS.primary,
  textMonthFontWeight: "500",
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 14,
}

export default function HomeScreen() {
  const [selected, setSelected] = useState("")
  const [medicines, setMedicines] = useState([])
  const [markedDates, setMarkedDates] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigation = useNavigation()

  const getCurrentDate = useCallback(() => {
    return new Date().toISOString().split("T")[0]
  }, [])

  const isPastDue = useCallback((timeString) => {
    const now = new Date()
    const [time, period] = timeString.split(" ")
    const [hours, minutes] = time.split(":")

    const medicineTime = new Date()
    medicineTime.setHours(
      period === "PM" && hours !== "12"
        ? Number.parseInt(hours) + 12
        : period === "AM" && hours === "12"
          ? 0
          : Number.parseInt(hours),
      Number.parseInt(minutes),
      0,
      0,
    )
    return medicineTime < now
  }, [])

  // Helper function to determine if a medicine should be taken on a specific day
  const shouldTakeMedicineOnDay = useCallback((medicine, dayOfWeek) => {
    // If medicine has specific selectedDays array, use that directly
    if (medicine.selectedDays && Array.isArray(medicine.selectedDays)) {
      // Convert dayOfWeek to number if it's not already
      const dayIndex = typeof dayOfWeek === "number" ? dayOfWeek : Number.parseInt(dayOfWeek)
      return medicine.selectedDays[dayIndex]
    }

    // Handle predefined frequency patterns
    if (medicine.frequency === "everyday") {
      return true
    }

    if (medicine.frequency === "weekends") {
      return dayOfWeek === 0 || dayOfWeek === 6
    }

    if (medicine.frequency === "custom") {
      return false
    }

    // Default to false if no valid scheduling info is found
    console.warn(`No valid scheduling info for medicine: ${medicine.name}`)
    return false
  }, [])

  // New function to get medicines for a specific date
  const getMedicinesForDate = useCallback(
    (dateString: string, medicines: any[]) => {
      const date = new Date(dateString)
      const formattedDate = formatDate(date)
      const dayOfWeek = formattedDate.split(",")[0]
      const day = dayMapping.find((d) => d.key === dayOfWeek)

      if (!day) return []

      const medicinesForDate = medicines.reduce((acc, medicine) => {
        // Check if medicine should be taken on this day
        if (!shouldTakeMedicineOnDay(medicine, day.value)) {
          return acc
        }

        // Check if date is within medicine's duration
        const startDate =
          typeof medicine.startDate.toDate === "function" ? medicine.startDate.toDate() : new Date(medicine.startDate)

        const endDate = new Date(startDate)
        if (medicine.duration.includes("week")) {
          endDate.setDate(endDate.getDate() + Number.parseInt(medicine.duration) * 7 - 1)
        } else if (medicine.duration.includes("month")) {
          endDate.setMonth(endDate.getMonth() + Number.parseInt(medicine.duration))
          endDate.setDate(endDate.getDate() - 1)
        } else {
          // For day-based durations, subtract 1 to make it inclusive
          endDate.setDate(endDate.getDate() + Number.parseInt(medicine.duration) - 1)
        }

        // For 1-day duration, we need to check if the date is exactly the start date
        const durationValue = medicine.duration
        if (durationValue === "1 days") {
          // For 1-day duration, only show on the exact start date
          const startDateString = startDate.toISOString().split('T')[0];
          const selectedDateString = date.toISOString().split('T')[0];
          
          if (startDateString !== selectedDateString) {
            return acc; // Skip if not the exact start date
          }
        } else {
          // For longer durations, use the range check
          if (date < startDate || date > endDate) {
            return acc;
          }
        }

        // Add medicine entries for each alarm
        const medicineImage = medicinePictures.find((pic) => pic.id === medicine.pictureId)

        const medicineEntries = medicine.alarms.map((alarm) => {
          const alarmDate = typeof alarm.toDate === "function" ? alarm.toDate() : new Date(alarm)
          return {
            id: `${medicine.id}-${alarmDate.getTime()}`,
            medicineId: medicine.id,
            name: medicine.name,
            dosage: medicine.dosage,
            strength: medicine.strength,
            frequency: medicine.frequency,
            time: alarmDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timeValue: alarmDate.getTime(),
            condition: medicine.condition,
            picture: medicineImage,
          }
        })

        return [...acc, ...medicineEntries]
      }, [])

      // Sort by time first, then by name if times are equal
      return medicinesForDate.sort((a, b) => {
        // Extract hours and minutes from the time strings
        const timeA = new Date(a.timeValue)
        const timeB = new Date(b.timeValue)

        // Compare hours
        const hoursDiff = timeA.getHours() - timeB.getHours()
        if (hoursDiff !== 0) return hoursDiff

        // If hours are equal, compare minutes
        const minutesDiff = timeA.getMinutes() - timeB.getMinutes()
        if (minutesDiff !== 0) return minutesDiff

        // If times are exactly equal, sort by name
        return a.name.localeCompare(b.name)
      })
    },
    [shouldTakeMedicineOnDay],
  )

  // Modified useEffect to handle medicine data differently
  useEffect(() => {
    const todayDate = getCurrentDate()
    setSelected(todayDate)
    const user = auth().currentUser

    if (!user) {
      setError("No user logged in")
      setLoading(false)
      return
    }

    const unsubscribe = firestore()
      .collection("medicines")
      .where("userId", "==", user.uid)
      .onSnapshot(
        (querySnapshot) => {
          try {
            const allMedicines = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))

            // Store all medicines in state
            setMedicines(allMedicines)

            // Create marked dates
            const newMarkedDates = {}
            allMedicines.forEach((medicine) => {
              const startDate =
                typeof medicine.startDate.toDate === "function"
                  ? medicine.startDate.toDate()
                  : new Date(medicine.startDate)

              const endDate = new Date(startDate)
              if (medicine.duration.includes("week")) {
                endDate.setDate(endDate.getDate() + Number.parseInt(medicine.duration) * 7 - 1)
              } else if (medicine.duration.includes("month")) {
                endDate.setMonth(endDate.getMonth() + Number.parseInt(medicine.duration))
                endDate.setDate(endDate.getDate() - 1)
              } else {
                // For day-based durations, subtract 1 to make it inclusive
                endDate.setDate(endDate.getDate() + Number.parseInt(medicine.duration) - 1)
              }

              const currentDate = new Date(startDate)
              while (currentDate <= endDate) {
                const dateString = currentDate.toISOString().split("T")[0]
                const formattedDate = formatDate(currentDate)
                const dayOfWeek = formattedDate.split(",")[0]
                const day = dayMapping.find((d) => d.key === dayOfWeek)

                if (day && shouldTakeMedicineOnDay(medicine, day.value)) {
                  newMarkedDates[dateString] = { marked: true, dotColor: "#196EB0" }
                }

                currentDate.setDate(currentDate.getDate() + 1)
              }
            })

            setMarkedDates(newMarkedDates)
            setLoading(false)
          } catch (err) {
            console.error("Error processing snapshot:", err)
            setError("Failed to process medicines")
            setLoading(false)
          }
        },
        (err) => {
          console.error("Firestore error:", err)
          setError("Failed to load medicines")
          setLoading(false)
        },
      )

    return () => unsubscribe()
  }, [getCurrentDate, shouldTakeMedicineOnDay])

  // Modified render section to use getMedicinesForDate
  const medicinesForSelectedDate = selected ? getMedicinesForDate(selected, medicines) : []

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString)
  }, [])

  const keyExtractor = useCallback((item) => item.id, [])

  const renderMedicineItem = useCallback(
    ({ item }) => {
      const handleMedicinePress = (medicineId) => {
        navigation.navigate("MedicineDetails", { medicineId })
      }

      const isToday = selected === getCurrentDate()
      const isPastDueTime = isToday && isPastDue(item.time)

      return (
        <TouchableOpacity
          style={[styles.medicineItemContainer, isPastDueTime && styles.pastDueMedicineContainer]}
          onPress={() => handleMedicinePress(item.medicineId)}
        >
          <View style={styles.medicineItem}>
            {item.picture && <Image source={item.picture.source} style={styles.medicineIcon} />}
            <View style={styles.medicineDetails}>
              <View style={styles.medicineNameRow}>
                <Text style={[styles.medicineName, isPastDueTime && styles.pastDueText]}>{item.name}</Text>
                {isPastDueTime && <Text style={styles.pastDueLabel}>alarm time over</Text>}
              </View>
              <Text style={[styles.medicineInfo, isPastDueTime && styles.pastDueText]}>
                {`${item.dosage || "An appropriate"} dose${
                  item.strength ? ` (${item.strength} mg/ml)` : ""
                } at ${item.time}`}
              </Text>
              {item.condition && (
                <Text style={[styles.medicineCondition, isPastDueTime && styles.pastDueText]}>{item.condition}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [selected, getCurrentDate, isPastDue, navigation],
  )

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#196EB0" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={getCurrentDate()}
              onDayPress={onDayPress}
              markedDates={{
                ...markedDates,
                [selected]: {
                  ...markedDates[selected],
                  selected: true,
                  selectedColor: COLORS.primary,
                },
              }}
              theme={calendarTheme}
            />
          </View>

          {selected && (
            <View style={styles.medicineContainer}>
              <Text style={styles.medicineTitle}>Medicines for {formatDate(selected, false)}</Text>
              {medicinesForSelectedDate.length > 0 ? (
                <FlatList
                  data={medicinesForSelectedDate}
                  renderItem={renderMedicineItem}
                  keyExtractor={keyExtractor}
                  style={styles.medicineList}
                  showsVerticalScrollIndicator={false}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={5}
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  calendarContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    padding: SPACING.sm,
  },
  medicineContainer: {
    flex: 1,
    marginTop: SPACING.lg,
  },
  medicineTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  medicineItemContainer: {
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  medicineIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginRight: SPACING.md,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  medicineInfo: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  medicineCondition: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  medicineList: {
    paddingTop: SPACING.sm,
  },
  noMedicineText: {
    fontSize: 16,
    color: COLORS.text.disabled,
    textAlign: "center",
    marginTop: SPACING.xl,
    fontStyle: "italic",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: SPACING.lg,
  },
  medicineNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  pastDueMedicineContainer: {
    borderColor: COLORS.pastDue,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
  },
  pastDueText: {
    color: COLORS.text.disabled,
  },
  pastDueLabel: {
    fontSize: 11,
    color: COLORS.text.pastDue,
    fontStyle: "italic",
  },
})

