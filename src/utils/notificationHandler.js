import PushNotification from "react-native-push-notification"
import { Platform } from "react-native"

export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: (token) => {
      console.log("TOKEN:", token)
    },
    onNotification: (notification) => {
      console.log("NOTIFICATION:", notification)
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === "ios",
  })

  PushNotification.createChannel(
    {
      channelId: "medication-reminders",
      channelName: "Medication Reminders",
      channelDescription: "Reminders for taking medications",
      playSound: true,
      soundName: "alarm.mp3",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`),
  )
}

export const scheduleNotification = (medicineId, medicineName, time) => {
  PushNotification.localNotificationSchedule({
    id: medicineId,
    channelId: "medication-reminders",
    title: "Medication Reminder",
    message: `Time to take your ${medicineName}`,
    date: new Date(time),
    allowWhileIdle: true,
    repeatType: "day",
    repeatTime: 24 * 60 * 60 * 1000, // Repeat every 24 hours
    soundName: Platform.OS === "android" ? "alarm.mp3" : "default",
    vibrate: true,
    vibration: 300,
    playSound: true,
    importance: "high",
    userInfo: { medicineName },
  })
}

export const cancelNotification = (medicineId) => {
  PushNotification.cancelLocalNotification(medicineId)
}

export const checkScheduledNotifications = () => {
  PushNotification.getScheduledLocalNotifications((notifications) => {
    console.log("Scheduled Notifications:", notifications)
  })
}

