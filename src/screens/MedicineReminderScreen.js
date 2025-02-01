import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

const MedicineReminderScreen = ({ route }) => {
  const { medicineName } = route.params
  const navigation = useNavigation()

  const handleTaken = () => {
    // Here you can add logic to mark the medicine as taken
    console.log(`${medicineName} marked as taken`)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Did you take your medicine?</Text>
      <Text style={styles.medicineName}>{medicineName}</Text>
      <TouchableOpacity style={styles.button} onPress={handleTaken}>
        <Text style={styles.buttonText}>Taken</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  medicineName: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#196EB0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default MedicineReminderScreen

