import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { auth, firestore } from "../firebase/config"
import { days, medicinePictures } from "../components/constants"
import styles, { COLORS } from "../components/styles"
import { clearAllNotifications, fetchAndScheduleAlarms } from "../utils/notificationUtils"

const DayCircle = ({ day, selected, onPress }) => (
  <TouchableOpacity 
    style={[styles.dayCircle, selected && styles.selectedDayCircle]} 
    onPress={onPress}
  >
    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
  </TouchableOpacity>
)

const NumberInput = ({ value, onChangeText, label }) => (
  <View style={styles.inputRow}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.numberInputWrapper}>
      <TouchableOpacity onPress={() => onChangeText(Math.max(0, Number(value) - 1).toString())} style={styles.numberInputButton}>
        <Icon name="remove" size={24} color={styles.headerText.color} />
      </TouchableOpacity>
      <TextInput 
        style={styles.numberInput} 
        value={value} 
        onChangeText={onChangeText} 
        keyboardType="numeric"
        backgroundColor={COLORS.gray.background}
      />
      <TouchableOpacity onPress={() => onChangeText((Number(value) + 1).toString())} style={styles.numberInputButton}>
        <Icon name="add" size={24} color={styles.headerText.color} />
      </TouchableOpacity>
    </View>
  </View>
);

// Define frequency patterns for easier management
const FREQUENCY_PATTERNS = {
  everyday: [true, true, true, true, true, true, true],
  weekdays: [false, true, true, true, true, true, false],
  weekends: [true, false, false, false, false, false, true],
  custom: null // Will be set by user selection
};

export default function AddMedicineScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const isUpdate = route.params?.isUpdate
  const existingMedicine = route.params?.medicine

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
  const [selectedDays, setSelectedDays] = useState(FREQUENCY_PATTERNS.everyday)

  useEffect(() => {
    if (isUpdate && existingMedicine) {
      setMedicineName(existingMedicine.name || "")
      setSelectedPicture(existingMedicine.pictureId || null)
      setDosage(existingMedicine.dosage?.toString() || "0")
      setStrength(existingMedicine.strength?.toString() || "0")
      setCondition(existingMedicine.condition || "")
      setStartDate(existingMedicine.startDate || new Date())
      setDuration(existingMedicine.duration || "0")
      setDurationUnit(existingMedicine.durationUnit || "days")
      setAlarms(existingMedicine.alarms || [new Date()])
      setFrequency(existingMedicine.frequency || "everyday")
      setSelectedDays(existingMedicine.selectedDays || FREQUENCY_PATTERNS.everyday)
    }
  }, [isUpdate, existingMedicine])

 const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
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

          if (isUpdate) {
            // Update existing medicine
            await firestore()
              .collection("medicines")
              .doc(existingMedicine.id)
              .update(medicineData)
            console.log("Medicine updated successfully")
          } else {
            // Add new medicine
            await firestore().collection("medicines").add(medicineData)
            console.log("Medicine added successfully")
          }

          await clearAllNotifications();
          await fetchAndScheduleAlarms(user.uid);
                
          navigation.goBack()
        } catch (error) {
          console.error("Error saving medicine:", error)
          Alert.alert("Error", `Failed to ${isUpdate ? 'update' : 'add'} medicine. Please try again.`)
        }
      } else {
        Alert.alert("Error", "You must be logged in to save medicine.")
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

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newAlarms = [...alarms]
      newAlarms[currentAlarmIndex] = selectedTime
      setAlarms(newAlarms)
    }
  }

  const handleDayPress = (index) => {
    // Create a new array with the toggled day
    const newSelectedDays = [...selectedDays]
    newSelectedDays[index] = !newSelectedDays[index]
    setSelectedDays(newSelectedDays)
    
    // Determine the frequency based on the selected days pattern
    setFrequency(determineFrequency(newSelectedDays))
  }

  // Function to determine frequency based on selected days
  const determineFrequency = (daysArray) => {
    // Check if the pattern matches any predefined pattern
    if (arraysEqual(daysArray, FREQUENCY_PATTERNS.everyday)) {
      return "everyday"
    } else if (arraysEqual(daysArray, FREQUENCY_PATTERNS.weekdays)) {
      return "weekdays"
    } else if (arraysEqual(daysArray, FREQUENCY_PATTERNS.weekends)) {
      return "weekends"
    } else {
      return "custom"
    }
  }

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency)
    // Set days array based on the selected frequency
    if (newFrequency !== "custom") {
      setSelectedDays([...FREQUENCY_PATTERNS[newFrequency]])
    }
    // If custom is selected, keep the current selection
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={styles.headerText.color} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isUpdate ? "Update Medicine" : "Add Medicine"} - Step {step}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          {step === 1 && (
            <View style={styles.medicineFormContainer}>
              <View>
                <Text style={styles.detailLabel}>Medicine Name</Text>
                <TextInput
                  style={styles.inputContainer}
                  value={medicineName}
                  onChangeText={setMedicineName}
                  placeholder="Enter medicine name"
                />
                
                <Text style={[styles.detailLabel, { marginTop: 20 }]}>Medicine Type</Text>
                <View style={styles.medicineListContainer}>
                  <View style={styles.gridContainer}>
                    {medicinePictures.map((item) => (
                      <TouchableOpacity
                        style={[
                          styles.medicineListItem,
                          selectedPicture === item.id && styles.selectedMedicineItem
                        ]}
                        onPress={() => setSelectedPicture(item.id)}
                      >
                        <Image source={item.source} style={styles.medicineImage} />
                        <Text style={styles.medicineText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.medicineFormContainer}>
              <View>
                <NumberInput value={dosage} onChangeText={setDosage} label="Dosage" />
                <NumberInput value={strength} onChangeText={setStrength} label="Strength (mg/ml)" />
                
                <View style={{ flexDirection: 'column', width: '100%', marginBottom: 28 }}>
                  <Text style={{ ...styles.inputLabel, marginBottom: 8 }}>Condition (Optional)</Text>
                  <TextInput
                    style={{
                      width: '100%',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 8,
                      padding: 8,
                      backgroundColor: '#F7F8F9'
                    }}
                    value={condition}
                    onChangeText={setCondition}
                    placeholder="e.g., Before meal"
                  />
                </View>

                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TouchableOpacity 
                    style={[styles.dateButton, { flex: 2 }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.textBlack}>{startDate.toDateString()}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Duration</Text>
                  <View style={styles.durationContainer}>
                    <TextInput
                      style={styles.durationInput}
                      value={duration}
                      onChangeText={setDuration}
                      keyboardType="numeric"
                    />
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={durationUnit}
                        style={styles.durationPicker}
                        onValueChange={(itemValue) => setDurationUnit(itemValue)}
                      >
                        <Picker.Item label="Day/s" value="days" />
                        <Picker.Item label="Week/s" value="weeks" />
                        <Picker.Item label="Month/s" value="months" />
                        <Picker.Item label="Year/s" value="years" />
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (selectedDate) {
                      setStartDate(selectedDate)
                    }
                  }}
                />
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.medicineFormContainer}>
              <View style={styles.formContent}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <View style={styles.radioGroup}>
                  {["Everyday", "Weekdays", "Weekends", "Custom"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioButton}
                      onPress={() => handleFrequencyChange(option.toLowerCase())}
                    >
                      <View style={styles.radioBullet}>
                        {frequency === option.toLowerCase() && (
                          <View style={styles.radioBulletInner} />
                        )}
                      </View>
                      <Text style={styles.textBlack}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.daysContainer}>
                  {days.map((day, index) => (
                    <DayCircle
                      key={index}
                      day={day}
                      selected={selectedDays[index]}
                      onPress={() => handleDayPress(index)}
                    />
                  ))}
                </View>
                
                <View style={styles.alarmsSection}>
                  <Text style={styles.detailLabel}>Set Alarm:</Text>
                  <ScrollView 
                    style={styles.alarmsScrollContainer}
                    contentContainerStyle={styles.alarmListContent}
                    showsVerticalScrollIndicator={true}
                  >
                    {alarms.map((alarm, index) => (
                      <View key={index} style={styles.alarmContainer}>
                        <TouchableOpacity
                          style={styles.alarmButton}
                          onPress={() => {
                            setCurrentAlarmIndex(index);
                            setShowTimePicker(true);
                          }}
                        >
                          <Text style={styles.textBlack}>{formatTime(alarm)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.removeAlarmButton} 
                          onPress={() => removeAlarm(index)}
                        >
                          <Icon name="close-circle" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              
                <TouchableOpacity style={styles.addAlarmButton} onPress={addAlarm}>
                  <Icon name="add-circle" size={24} color={styles.headerText.color} />
                  <Text style={styles.addAlarmText}>Add another alarm</Text>
                </TouchableOpacity>
              </View>
              
                {showTimePicker && (
                  <DateTimePicker
                    value={alarms[currentAlarmIndex]}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onChangeTime}
                  />
                )}
            </View>
          )}
          
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
            {step === 3 ? (isUpdate ? "Update Medicine" : "Add Medicine") : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}