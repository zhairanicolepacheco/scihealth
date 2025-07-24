import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/Ionicons"

import HomeScreen from "../screens/HomeScreen"
import MedicineScreen from "../screens/MedicineScreen"
import ProfileScreen from "../screens/ProfileScreen"
import NotesScreen from "../screens/NotesScreen"

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Medicine") {
            iconName = focused ? "medkit" : "medkit-outline"
          } else if (route.name === "Notes") {
            iconName = focused ? "document-text" : "document-text-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#196EB0",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 10,
          height: 70,
        },
      })}
    >
      <Tab.Screen name="Medicine" component={MedicineScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

