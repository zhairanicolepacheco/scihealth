import { firestore } from "../firebase/config"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Fetch medicine alarms and schedule ONLY upcoming notifications
export async function fetchAndScheduleAlarms(userId) {
  try {
    const snapshot = await firestore().collection("medicines").where("userId", "==", userId).get()
    const medicines = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    const now = new Date()
    const scheduledAlarms = await getScheduledAlarms()

    for (const medicine of medicines) {
      if (medicine.alarms && Array.isArray(medicine.alarms)) {
        for (const alarm of medicine.alarms) {
          const alarmTime = alarm.toDate()
          const alarmKey = `${medicine.id}_${alarmTime.getTime()}`

          if (alarmTime > now && !scheduledAlarms.includes(alarmKey)) {
            await scheduleMedicineNotification(
              medicine.id,
              medicine.name,
              medicine.pictureId,
              alarmTime,
              medicine.dosage,
              medicine.strength,
            )
            await addScheduledAlarm(alarmKey)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching and scheduling alarms:", error)
    throw error
  }
}

// Schedule notifications to trigger ONLY at the exact scheduled time
export async function scheduleMedicineNotification(medicineId, medicineName, pictureId, alarmTime, dosage, strength) {
  try {
    const trigger = new Date(alarmTime)

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicine Reminder",
        body: `It's time to take your ${medicineName}.`,
        sound: true,
        color: "#196EB0",
        data: {
          medicineId,
          medicineName,
          pictureId,
          scheduledTime: alarmTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
          dosage,
          strength,
        },
      },
      trigger,
    })

    console.log(`Scheduled notification for ${medicineName} at ${alarmTime}`)
    return notificationId
  } catch (error) {
    console.error("Error scheduling notification:", error)
    throw error
  }
}

// Get list of scheduled alarms
async function getScheduledAlarms() {
  try {
    const alarms = await AsyncStorage.getItem("scheduledAlarms")
    return alarms ? JSON.parse(alarms) : []
  } catch (error) {
    console.error("Error getting scheduled alarms:", error)
    return []
  }
}

// Add a scheduled alarm to the list
async function addScheduledAlarm(alarmKey) {
  try {
    const alarms = await getScheduledAlarms()
    alarms.push(alarmKey)
    await AsyncStorage.setItem("scheduledAlarms", JSON.stringify(alarms))
  } catch (error) {
    console.error("Error adding scheduled alarm:", error)
  }
}

// Clear all scheduled notifications
export async function clearAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    await AsyncStorage.removeItem("scheduledAlarms")
    console.log("✅ All notifications cleared")
  } catch (error) {
    console.error("Error clearing notifications:", error)
    throw error
  }
}

// Backwards compatibility function
export async function cancelAllScheduledNotifications() {
  console.warn("⚠️ cancelAllScheduledNotifications is deprecated. Use clearAllNotifications instead.")
  await clearAllNotifications()
}

