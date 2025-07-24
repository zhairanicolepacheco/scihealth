import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef, navigate } from "./src/navigation/RootNavigation"; // Import navigation functions

import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import AddMedicineScreen from "./src/screens/AddMedicineScreen";
import MedicineDetailsScreen from "./src/screens/MedicineDetailsScreen";
import MedicineReminderScreen from "./src/screens/MedicineReminderScreen";
import TabNavigator from "./src/navigation/TabNavigator";

import AdminDashboard from "./src/screens/AdminDashboard"
import AdminNotesScreen from "./src/screens/AdminNotesScreen"
import AdminMedicineScreen from "./src/screens/AdminMedicineScreen"

import "./src/firebase/config";

const Stack = createNativeStackNavigator();

// ✅ Ensures notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // ✅ Prevents re-triggering old notifications
    const now = new Date().getTime();

    AsyncStorage.getItem("scheduledNotifications").then(async (storedNotifications) => {
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);

        // Filter only future notifications
        const futureNotifications = [];
        const pendingNotifications = await Notifications.getAllScheduledNotificationsAsync();

        for (const notificationId of notifications) {
          const isFuture = pendingNotifications.some(
            (notif) => notif.identifier === notificationId && notif.trigger.timestamp > now
          );

          if (isFuture) {
            futureNotifications.push(notificationId);
          }
        }

        await AsyncStorage.setItem("scheduledNotifications", JSON.stringify(futureNotifications));
      }
    });

    // ✅ Handles notification tap events
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("✅ Notification Data:", response.notification.request.content.data);

      const { medicineName, pictureId, scheduledTime, dosage, strength } = response.notification.request.content.data || {};

      if (medicineName) {
        navigate("MedicineReminder", { medicineName, pictureId, scheduledTime, dosage, strength });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
        <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
        <Stack.Screen name="MedicineReminder" component={MedicineReminderScreen} />

        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="AdminNotesScreen" component={AdminNotesScreen} />
        <Stack.Screen name="AdminMedicineScreen" component={AdminMedicineScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
