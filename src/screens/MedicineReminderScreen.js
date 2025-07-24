import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { medicinePictures } from "../components/constants"

export default function MedicineReminderScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const {
    medicineName = "Unknown Medicine",
    pictureId = "",
    scheduledTime = "Not Set",
    dosage = "Not Specified",
    strength = "Not Specified",
  } = route.params || {}

  const handleTaken = () => {
    console.log(`${medicineName} was taken at ${scheduledTime}`)
    navigation.goBack()
  }

  const medicineImage = medicinePictures.find(
    (pic) => pic.id === pictureId
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Did you take your medicine?</Text>

        <Image source={medicineImage.source} style={{ height: 75, aspectRatio:1, marginBottom: 16,  }} />

        <Text style={styles.medicineName}>{medicineName}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={32} color="#196EB0" />
            <Text style={styles.detailText}>Scheduled for {scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="document-text-outline" size={32} color="#196EB0" />
            <Text style={styles.detailText}>Dosage {dosage} pcs, {strength} mg/ml</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleTaken}>
          <Text style={styles.buttonText}>Take</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 50,
    borderRadius: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: "#154360",
    textAlign: "center",
    marginBottom: 32,
  },
  medicineName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B4F72",
    marginBottom: 15,
  },
  detailsContainer: {
    width: "100%",
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    color: "#154360",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#196EB0",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})