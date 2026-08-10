// src/screens/RespiroScreen.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { colors } from "../theme/colors";

const DURATION = 5;
const PHRASES = [
  "¿Qué estabas haciendo antes de abrir esto?",
  "Todavía no sabés qué vas a encontrar acá.",
  "Esto va a seguir aquí en cinco minutos.",
  "¿Es esto lo que querías hacer ahora?",
];

export default function RespiroScreen({ navigation, route }) {
  const appName = route?.params?.appName ?? "Instagram";
  const [remaining, setRemaining] = useState(DURATION);
  const [phrase] = useState(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1.15,
      duration: DURATION * 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Abriendo {appName}</Text>

      <View style={styles.center}>
        <View style={styles.circleWrap}>
          <Animated.View style={[styles.ringOuter, { transform: [{ scale }] }]} />
          <Animated.View style={[styles.ringInner, { transform: [{ scale }] }]} />
          <View style={styles.dot}>
            <Text style={styles.dotText}>{remaining > 0 ? remaining : ""}</Text>
          </View>
        </View>
        <Text style={styles.phrase}>{phrase}</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>Volver a lo que estaba haciendo</Text>
        </Pressable>
        <Pressable
          disabled={remaining > 0}
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryBtnText}>
            {remaining > 0 ? `Continuar en ${remaining}s` : `Continuar a ${appName}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 40, paddingBottom: 26, paddingHorizontal: 20 },
  eyebrow: { textAlign: "center", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: colors.muted },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 28 },
  circleWrap: { width: 150, height: 150, alignItems: "center", justifyContent: "center" },
  ringOuter: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: colors.mint + "33" },
  ringInner: { position: "absolute", width: 110, height: 110, borderRadius: 55, backgroundColor: colors.mint + "66" },
  dot: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
  dotText: { fontSize: 26, fontWeight: "600", color: colors.bg },
  phrase: { textAlign: "center", fontSize: 17, lineHeight: 25, color: colors.text, paddingHorizontal: 14 },
  buttons: { gap: 10 },
  primaryBtn: { width: "100%", paddingVertical: 14, borderRadius: 18, backgroundColor: colors.mint, alignItems: "center" },
  primaryBtnText: { fontSize: 13, fontWeight: "600", color: colors.bg },
  secondaryBtn: { width: "100%", paddingVertical: 12, borderRadius: 18, borderWidth: 0.5, borderColor: colors.border, alignItems: "center" },
  secondaryBtnText: { fontSize: 12, color: colors.muted },
});
