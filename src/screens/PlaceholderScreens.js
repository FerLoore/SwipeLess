// src/screens/PlaceholderScreens.js
// Pantallas temporales para Progreso y Ajustes.
// Las vamos a construir de verdad en los próximos pasos, siguiendo
// el mismo patrón que HomeScreen.js: import de colors, StyleSheet,
// componentes de lucide-react-native.

import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";


export function AjustesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ajustes — próxima pantalla a construir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  text: { color: colors.muted, fontSize: 13 },
});
