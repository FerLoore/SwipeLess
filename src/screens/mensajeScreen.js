import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { agregar, KEYS } from "../utils/storage";

const DURATION = 5;
const PHRASES = [
  "¿Qué estabas haciendo antes de abrir esto?",
  "Todavía no sabés qué vas a encontrar acá.",
  "Esto va a seguir aquí en cinco minutos.",
  "¿Es esto lo que querías hacer ahora?",
];

// Las 4 palabras entre las que el usuario elige. Cortas, sin teclado,
// para que capturarlas no se sienta como una tarea.
const PALABRAS = ["Aburrido", "Ansioso", "Curioso", "Costumbre"];

export default function RespiroScreen({ navigation, route }) {
  const appName = route?.params?.appName ?? "Instagram";
  const [remaining, setRemaining] = useState(DURATION);
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  const [palabraElegida, setPalabraElegida] = useState(null);
  const [scale] = useState(() => new Animated.Value(0.8));

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1.15,
      duration: DURATION * 1000,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  // Guarda la captura (con o sin palabra elegida) y recién ahí sale.
  const salir = async (accion) => {
    await agregar(KEYS.CAPTURAS, {
      palabra: palabraElegida, // puede quedar null si no eligió ninguna, y está bien
      app: appName,
      accion, // "volviste" | "continuaste"
      fecha: Date.now(),
    });
    navigation.goBack();
  };

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

        {/* Captura de palabra */}
        <View style={styles.wordBlock}>
          <Text style={styles.wordLabel}>¿Cómo te sentís ahora?</Text>
          <View style={styles.chipsRow}>
            {PALABRAS.map((p) => {
              const on = palabraElegida === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPalabraElegida(on ? null : p)}
                  style={[styles.chip, on && { backgroundColor: colors.mint, borderColor: colors.mint }]}
                >
                  <Text style={[styles.chipText, on && { color: colors.bg, fontWeight: "600" }]}>{p}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.primaryBtn} onPress={() => salir("volviste")}>
          <Text style={styles.primaryBtnText}>Volver a lo que estaba haciendo</Text>
        </Pressable>
        <Pressable
          disabled={remaining > 0}
          style={styles.secondaryBtn}
          onPress={() => salir("continuaste")}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22 },
  circleWrap: { width: 150, height: 150, alignItems: "center", justifyContent: "center" },
  ringOuter: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: colors.mint + "33" },
  ringInner: { position: "absolute", width: 110, height: 110, borderRadius: 55, backgroundColor: colors.mint + "66" },
  dot: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
  dotText: { fontSize: 26, fontWeight: "600", color: colors.bg },
  phrase: { textAlign: "center", fontSize: 17, lineHeight: 25, color: colors.text, paddingHorizontal: 14 },

  wordBlock: { alignItems: "center", gap: 10, marginTop: 4 },
  wordLabel: { fontSize: 11, color: colors.muted },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", paddingHorizontal: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  chipText: { fontSize: 12, color: colors.text },

  buttons: { gap: 10 },
  primaryBtn: { width: "100%", paddingVertical: 14, borderRadius: 18, backgroundColor: colors.mint, alignItems: "center" },
  primaryBtnText: { fontSize: 13, fontWeight: "600", color: colors.bg },
  secondaryBtn: { width: "100%", paddingVertical: 12, borderRadius: 18, borderWidth: 0.5, borderColor: colors.border, alignItems: "center" },
  secondaryBtnText: { fontSize: 12, color: colors.muted },
});