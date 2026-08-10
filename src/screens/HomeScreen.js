// src/screens/HomeScreen.js
import { BarChart3, Bell, Camera, ChevronRight, Flame, LayoutGrid, MessageSquare, Settings } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const ACTIONS = [
  { label: "Mensaje", icon: MessageSquare },
  { label: "Mis apps", icon: LayoutGrid },
  { label: "Progreso", icon: BarChart3 },
  { label: "Ajustes", icon: Settings },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
          <Text style={styles.headerName}>Hola, Diego</Text>
        </View>
        <Bell size={20} color={colors.muted} />
      </View>

      {/* Racha */}
      <View style={styles.streakBlock}>
        <Text style={styles.streakLabel}>Racha actual</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>6</Text>
          <Text style={styles.streakSuffix}>días respirando</Text>
          <Flame size={18} color={colors.coral} style={{ marginLeft: 2 }} />
        </View>
      </View>

      {/* Círculos de acción */}
      <View style={styles.actionsRow}>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.label}
            style={styles.actionItem}
            onPress={() => {
              if (a.label === "Mensaje") navigation.navigate("MensajeScreen");
              if (a.label === "Progreso") navigation.navigate("ProgresoScreen");
              // el resto los conectamos cuando migremos esas pantallas
            }}
          >
            <View style={styles.actionCircle}>
              <a.icon size={20} color={colors.bg} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Tarjeta clara */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Último respiro</Text>
          <Text style={styles.cardLink}>Ver todos</Text>
        </View>
        <ScrollView>
          <View style={styles.movementRow}>
            <View style={styles.movementIcon}>
              <Camera size={16} color={colors.bg} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.movementApp}>Instagram</Text>
              <Text style={styles.movementMeta}>Hace 12 min · volviste atrás</Text>
            </View>
            <ChevronRight size={16} color={colors.muted} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.mint,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "600", color: colors.bg },
  headerName: { fontSize: 13, color: colors.text },

  streakBlock: { paddingHorizontal: 20, paddingBottom: 18 },
  streakLabel: { fontSize: 11, color: colors.muted, marginBottom: 4 },
  streakRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  streakNumber: { fontSize: 34, fontWeight: "600", color: colors.text },
  streakSuffix: { fontSize: 14, color: colors.text },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionItem: { alignItems: "center", gap: 6 },
  actionCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.mint,
    alignItems: "center", justifyContent: "center",
  },
  actionLabel: { fontSize: 10, color: colors.text },

  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 12, fontWeight: "600", color: colors.textDark },
  cardLink: { fontSize: 11, color: "#69C4A8" },
  movementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.cardWhite,
    borderRadius: 16,
    padding: 12,
  },
  movementIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#E1B3A6",
    alignItems: "center", justifyContent: "center",
  },
  movementApp: { fontSize: 13, color: colors.textDark },
  movementMeta: { fontSize: 11, color: colors.muted },
});
