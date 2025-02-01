import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AuthLoadingScreen from "./src/screens/AuthLoadingScreen"
import WelcomeScreen from "./src/screens/WelcomeScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen"
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen"
import AddMedicineScreen from "./src/screens/AddMedicineScreen"
import MedicineDetailsScreen from "./src/screens/MedicineDetailsScreen"
import TabNavigator from "./src/navigation/TabNavigator"
import "./src/firebase/config"
import { configurePushNotifications, checkScheduledNotifications } from "./src/utils/notificationHandler"

const Stack = createNativeStackNavigator()

const linking = {
  prefixes: ["scihealth://"],
  config: {
    screens: {
      Welcome: "welcome",
      Login: "login",
      Register: "register",
      ForgotPassword: "forgotpassword",
      ChangePassword: "changepassword",
      MainApp: {
        screens: {
          Home: "home",
          Medicine: "medicine",
          Profile: "profile",
        },
      },
      AddMedicine: "addmedicine",
      MedicineDetails: "medicinedetails",
    },
  },
}

export default function App() {
  useEffect(() => {
    configurePushNotifications()
    checkScheduledNotifications() // This will log scheduled notifications for debugging
  }, [])

  return (
    <NavigationContainer linking={linking}>
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

