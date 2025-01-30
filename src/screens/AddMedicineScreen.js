import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
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

const days = ["S", "M", "T", "W", "T", "F", "S"]

const DayCircle = ({ day, selected, onPress }) => (
  <TouchableOpacity style={[styles.dayCircle, selected && styles.selectedDayCircle]} onPress={onPress}>
    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
  </TouchableOpacity>
)

const NumberInput = ({ value, onChangeText, label }) => {
  const increment = () => {
    const newValue = Number.parseFloat(value) + 1
    onChangeText(newValue.toString())
  }

  const decrement = () => {
    const newValue = Math.max(0, Number.parseFloat(value) - 1)
    onChangeText(newValue.toString())
  }

  return (
    <View style={styles.inlineInputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.numberInputWrapper}>
        <TouchableOpacity onPress={decrement} style={styles.numberInputButton}>
          <Icon name="remove" size={24} color="#196EB0" />
        </TouchableOpacity>
        <TextInput style={styles.numberInput} value={value} onChangeText={onChangeText} keyboardType="numeric" />
        <TouchableOpacity onPress={increment} style={styles.numberInputButton}>
          <Icon name="add" size={24} color="#196EB0" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function AddMedicineScreen() {
  const navigation = useNavigation()
  const [step, setStep] = useState(1)
  const [medicineName, setMedicineName] = useState("")
  const [selectedPicture, setSelectedPicture] = useState(null)
  const [dosage, setDosage] = useState("0")
  const [strength, setStrength] = useState("0")
  const [condition, setCondition] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [duration, setDuration] = useState("0")
  const [durationUnit, setDurationUnit] = useState("days")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [alarms, setAlarms] = useState([new Date()])
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [currentAlarmIndex, setCurrentAlarmIndex] = useState(0)
  const [frequency, setFrequency] = useState("everyday")
  const [selectedDays, setSelectedDays] = useState([true, true, true, true, true, true, true])

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Handle medicine submission
      const user = auth().currentUser
      if (user) {
        try {
          const medicineData = {
            userId: user.uid,
            name: medicineName,
            pictureId: selectedPicture,
            dosage,
            strength,
            condition,
            startDate: firestore.Timestamp.fromDate(startDate),
            duration: `${duration} ${durationUnit}`,
            alarms: alarms.map((alarm) => firestore.Timestamp.fromDate(alarm)),
            frequency,
            selectedDays,
          }
          await firestore().collection("medicines").add(medicineData)
          console.log("Medicine added successfully")
          // Navigate back to the previous screen
          navigation.goBack()
        } catch (error) {
          console.error("Error adding medicine:", error)
          Alert.alert("Error", "Failed to add medicine. Please try again.")
        }
      } else {
        Alert.alert("Error", "You must be logged in to add a medicine.")
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      navigation.goBack()
    }
  }

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setStartDate(selectedDate)
    }
  }

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newAlarms = [...alarms]
      newAlarms[currentAlarmIndex] = selectedTime
      setAlarms(newAlarms)
    }
  }

  const handleDayPress = (index) => {
    const newSelectedDays = [...selectedDays]
    newSelectedDays[index] = !newSelectedDays[index]
    setSelectedDays(newSelectedDays)
    updateFrequencyBasedOnDays(newSelectedDays)
  }

  const updateFrequencyBasedOnDays = (days) => {
    if (days.every((day) => day)) {
      setFrequency("everyday")
    } else if (days.slice(1, 6).every((day) => day) && !days[0] && !days[6]) {
      setFrequency("weekdays")
    } else if (!days.slice(1, 6).some((day) => day) && days[0] && days[6]) {
      setFrequency("weekends")
    } else {
      setFrequency("custom")
    }
  }

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency)
    switch (newFrequency) {
      case "everyday":
        setSelectedDays([true, true, true, true, true, true, true])
        break
      case "weekdays":
        setSelectedDays([false, true, true, true, true, true, false])
        break
      case "weekends":
        setSelectedDays([true, false, false, false, false, false, true])
        break
      case "custom":
        // Do nothing, let user select days
        break
    }
  }

  const addAlarm = () => {
    setAlarms([...alarms, new Date()])
    setCurrentAlarmIndex(alarms.length)
    setShowTimePicker(true)
  }

  const removeAlarm = (index) => {
    const newAlarms = alarms.filter((_, i) => i !== index)
    setAlarms(newAlarms)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#196EB0" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Medicine - Step {step}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <View>
            <Text style={styles.label}>Medicine Name</Text>
            <TextInput
              style={styles.input}
              value={medicineName}
              onChangeText={setMedicineName}
              placeholder="Enter medicine name"
            />
            <Text style={styles.label}>Choose Medicine Picture</Text>
            <View style={styles.pictureGrid}>
              {medicinePictures.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.pictureThumbnail, selectedPicture === item.id && styles.selectedPicture]}
                  onPress={() => setSelectedPicture(item.id)}
                >
                  <Image source={item.source} style={styles.thumbnailImage} />
                  <Text style={styles.thumbnailText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {step === 2 && (
          <View>
            <NumberInput value={dosage} onChangeText={setDosage} label="Dosage" />
            <NumberInput value={strength} onChangeText={setStrength} label="Strength (mg)" />
            <Text style={styles.label}>Condition (Optional)</Text>
            <TextInput
              style={styles.input}
              value={condition}
              onChangeText={setCondition}
              placeholder="e.g., before meal"
            />
            <View style={styles.inlineInputContainer}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text>{startDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker value={startDate} mode="date" display="default" onChange={onChangeDate} />
            )}
            <View style={styles.inlineInputContainer}>
              <Text style={styles.label}>Duration</Text>
              <View style={styles.durationContainer}>
                <TextInput
                  style={styles.durationInput}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
                <Picker
                  selectedValue={durationUnit}
                  style={styles.durationPicker}
                  onValueChange={(itemValue) => setDurationUnit(itemValue)}
                >
                  <Picker.Item label="Days" value="days" />
                  <Picker.Item label="Weeks" value="weeks" />
                  <Picker.Item label="Months" value="months" />
                  <Picker.Item label="Years" value="years" />
                </Picker>
              </View>
            </View>
          </View>
        )}
        {step === 3 && (
          <View>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.radioGroup}>
              {["Everyday", "Weekdays", "Weekends", "Custom"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioButton}
                  onPress={() => handleFrequencyChange(option.toLowerCase())}
                >
                  <View style={styles.radioBullet}>
                    {frequency === option.toLowerCase() && <View style={styles.radioBulletInner} />}
                  </View>
                  <Text style={styles.radioButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.daysContainer}>
              {days.map((day, index) => (
                <DayCircle key={index} day={day} selected={selectedDays[index]} onPress={() => handleDayPress(index)} />
              ))}
            </View>
            <Text style={styles.label}>Set Reminder Times</Text>
            {alarms.map((alarm, index) => (
              <View key={index} style={styles.alarmContainer}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setCurrentAlarmIndex(index)
                    setShowTimePicker(true)
                  }}
                >
                  <Text>{alarm.toLocaleTimeString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeAlarmButton} onPress={() => removeAlarm(index)}>
                  <Icon name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addAlarmButton} onPress={addAlarm}>
              <Icon name="add-circle" size={24} color="#196EB0" />
              <Text style={styles.addAlarmText}>Add another alarm</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={alarms[currentAlarmIndex]}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{step === 3 ? "Add Medicine" : "Next"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#196EB0",
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#196EB0",
    marginBottom: 8,
    marginTop: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  pictureList: {
    marginBottom: 16,
  },
  pictureThumbnail: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.66%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedPicture: {
    borderColor: "#196EB0",
    borderWidth: 2,
  },
  thumbnailImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  thumbnailText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 5,
    padding: 10,
    flex: 2,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#196EB0",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioBulletInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#196EB0",
  },
  radioButtonText: {
    fontSize: 16,
    color: "#333",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
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
    fontSize: 16,
    color: "#196EB0",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  nextButton: {
    backgroundColor: "#196EB0",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  inlineInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  numberInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 5,
    flex: 2,
  },
  numberInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  numberInputButton: {
    padding: 10,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  durationPicker: {
    flex: 1,
    height: 50,
  },
  alarmContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  removeAlarmButton: {
    marginLeft: 10,
  },
  addAlarmButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addAlarmText: {
    marginLeft: 10,
    color: "#196EB0",
    fontSize: 16,
  },
  pictureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
})

