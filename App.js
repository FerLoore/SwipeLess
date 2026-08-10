// App.js (en la raíz del proyecto, reemplaza el que trae Expo por defecto)
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./src/navigation/TabNavigator";
import BloqueoScreen from "./src/screens/BloqueoScreen";
import ProgresoScreen from "./src/screens/ProgresoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="ProgresoScreen"
          component={ProgresoScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="BloqueoScreen"
          component={BloqueoScreen}
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
