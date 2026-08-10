// src/screens/ProgresoScreen.js
import { Flame } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

// Datos simulados. Más adelante esto va a venir de AsyncStorage
// (o de tu backend, cuando sumes la IA) en vez de estar fijo acá.
const SEMANA = [
    { dia: "L", minutos: 96 },
    { dia: "M", minutos: 110 },
    { dia: "X", minutos: 74 },
    { dia: "J", minutos: 130 },
    { dia: "V", minutos: 88 },
    { dia: "S", minutos: 145 },
    { dia: "D", minutos: 60 },
];

const RACHA_ACTUAL = 6;
const RESPIROS_MOSTRADOS = 23;
const VECES_VOLVISTE = 9;

const ALTURA_MAX_BARRA = 500; // px, el techo visual del gráfico

export default function ProgresoScreen() {
    const maxMinutos = Math.max(...SEMANA.map((d) => d.minutos));
    const mejorDia = SEMANA.reduce((a, b) => (b.minutos > a.minutos ? b : a));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu progreso</Text>

            {/* Racha */}
            <View style={styles.streakRow}>
                <View style={styles.streakIconWrap}>
                    <Flame size={20} color={colors.coral} />
                </View>
                <View>
                    <Text style={styles.streakNumber}>{RACHA_ACTUAL} días seguidos</Text>
                </View>
            </View>

            {/* Gráfica */}
            <View style={styles.chartBlock}>
                <Text style={styles.chartLabel}>Minutos por día</Text>
                <View style={styles.barsRow}>
                    {SEMANA.map((d) => {
                        const alturaPx = Math.max(6, (d.minutos / maxMinutos) * ALTURA_MAX_BARRA);
                        const esMejorDia = d.dia === mejorDia.dia;
                        return (
                            <View
                                key={d.dia}
                                style={[
                                    styles.bar,
                                    { height: alturaPx, backgroundColor: esMejorDia ? colors.coral : colors.mint },
                                ]}
                            />
                        );
                    })}
                </View>
                <View style={styles.daysRow}>
                    {SEMANA.map((d) => (
                        <Text key={d.dia} style={styles.dayLabel}>{d.dia}</Text>
                    ))}
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsBlock}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Mensajes mostrados</Text>
                    <Text style={[styles.statValue, { color: colors.mint }]}>{RESPIROS_MOSTRADOS}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Veces que volviste atrás</Text>
                    <Text style={[styles.statValue, { color: colors.coral }]}>{VECES_VOLVISTE}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 16 },
    title: { fontSize: 18, fontWeight: "500", color: colors.text, marginBottom: 16 },

    streakRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
    streakIconWrap: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: colors.mint + "1A",
        alignItems: "center", justifyContent: "center",
    },
    streakNumber: { fontSize: 15, color: colors.text },
    streakSub: { fontSize: 11, color: colors.muted },

    chartBlock: { marginBottom: 20 },
    chartLabel: { fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: colors.muted, marginBottom: 12 },
    barsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: ALTURA_MAX_BARRA },
    bar: { width: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    daysRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 6 },
    dayLabel: { fontSize: 10, color: colors.muted, width: 18, textAlign: "center" },

    statsBlock: { gap: 10 },
    statRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        backgroundColor: "#171B26", borderRadius: 16, padding: 14,
    },
    statLabel: { fontSize: 13, color: colors.text },
    statValue: { fontSize: 14, fontWeight: "600" },
});