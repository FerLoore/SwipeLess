// src/navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, BarChart3, Settings } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import { ProgresoScreen, AjustesScreen } from "../screens/PlaceholderScreens";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Progreso"
        component={ProgresoScreen}
        options={{ tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Ajustes"
        component={AjustesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
