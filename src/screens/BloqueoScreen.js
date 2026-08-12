// src/screens/BloqueoScreen.js
//
// IMPORTANTE — qué hace esto y qué NO hace todavía:
// Esta pantalla guarda "hay un bloqueo activo hasta tal hora" en el
// teléfono. Pero no impide de verdad que abras Instagram — eso requiere
// el AccessibilityService en Kotlin que dejamos pendiente para más
// adelante (Fase 2). Por ahora es la lógica y el estado; la aplicación
// real del bloqueo se conecta después.

import { ArrowLeft, Camera, Check, Film, Lock, LockOpen, MessageCircle, Music2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { cargar, guardar, KEYS } from "../utils/storage";

const APPS = [
    { id: "ig", name: "Instagram", icon: Camera, color: "#E19A8C" },
    { id: "tk", name: "TikTok", icon: Music2, color: "#8FB8C7" },
    { id: "x", name: "X", icon: MessageCircle, color: "#9AA3B8" },
    { id: "yt", name: "YouTube", icon: Film, color: "#E0B27A" },
];

const DURACIONES = [
    { label: "15 min", minutos: 15 },
    { label: "30 min", minutos: 30 },
    { label: "1 h", minutos: 60 },
    { label: "2 h", minutos: 120 },
];

export default function BloqueoScreen({ navigation }) {
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [duracion, setDuracion] = useState(DURACIONES[1]); // 30 min por defecto
    const [bloqueoActivo, setBloqueoActivo] = useState(null); // { apps: [...], hasta: timestamp }
    const [restante, setRestante] = useState("");

    // Al abrir la pantalla, revisamos si ya había un bloqueo guardado
    // y si todavía no venció.
    useEffect(() => {
        (async () => {
            const guardado = await cargar(KEYS.BLOQUEO, null);
            if (guardado && guardado.hasta > Date.now()) {
                setBloqueoActivo(guardado);
            } else if (guardado) {
                await guardar(KEYS.BLOQUEO, null); // venció, lo limpiamos
            }
        })();
    }, []);

    // Cuenta regresiva del bloqueo activo, se actualiza cada segundo.
    useEffect(() => {
        if (!bloqueoActivo) return;
        const t = setInterval(() => {
            const msRestantes = bloqueoActivo.hasta - Date.now();
            if (msRestantes <= 0) {
                setBloqueoActivo(null);
                guardar(KEYS.BLOQUEO, null);
                clearInterval(t);
                return;
            }
            const min = Math.floor(msRestantes / 60000);
            const seg = Math.floor((msRestantes % 60000) / 1000);
            setRestante(`${min}:${seg.toString().padStart(2, "0")}`);
        }, 1000);
        return () => clearInterval(t);
    }, [bloqueoActivo]);

    const toggleApp = (id) => {
        setSeleccionadas((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const iniciarBloqueo = async () => {
        const hasta = Date.now() + duracion.minutos * 60000;
        const nuevo = { apps: seleccionadas, hasta };
        await guardar(KEYS.BLOQUEO, nuevo);
        setBloqueoActivo(nuevo);
    };

    const cancelarBloqueo = async () => {
        await guardar(KEYS.BLOQUEO, null);
        setBloqueoActivo(null);
    };

    // --- Vista: bloqueo activo ---
    if (bloqueoActivo) {
        const appsBloqueadas = APPS.filter((a) => bloqueoActivo.apps.includes(a.id));
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.text} />
                    </Pressable>
                </View>
                <View style={styles.activeWrap}>
                    <View style={styles.lockCircle}>
                        <Lock size={28} color={colors.bg} />
                    </View>
                    <Text style={styles.activeTitle}>Bloqueo activo</Text>
                    <Text style={styles.activeTimer}>{restante}</Text>
                    <View style={styles.activeApps}>
                        {appsBloqueadas.map((a) => (
                            <View key={a.id} style={styles.activeAppChip}>
                                <a.icon size={13} color={a.color} />
                                <Text style={styles.activeAppText}>{a.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <Pressable style={styles.cancelBtn} onPress={cancelarBloqueo}>
                    <LockOpen size={15} color={colors.muted} />
                    <Text style={styles.cancelBtnText}>Cancelar bloqueo</Text>
                </Pressable>
            </View>
        );
    }

    // --- Vista: armar un bloqueo nuevo ---
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Bloqueo</Text>
                <Text style={styles.subtitle}>Elegí qué apps silenciar y por cuánto tiempo.</Text>

                <Text style={styles.sectionLabel}>Apps</Text>
                <View style={styles.appsGrid}>
                    {APPS.map((a) => {
                        const on = seleccionadas.includes(a.id);
                        return (
                            <Pressable
                                key={a.id}
                                onPress={() => toggleApp(a.id)}
                                style={[styles.appCard, on && { borderColor: colors.mint }]}
                            >
                                <View style={[styles.appIcon, { backgroundColor: a.color + "33" }]}>
                                    <a.icon size={16} color={a.color} />
                                </View>
                                <Text style={styles.appCardName}>{a.name}</Text>
                                {on && <Check size={14} color={colors.mint} style={{ marginLeft: "auto" }} />}
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={styles.sectionLabel}>Duración</Text>
                <View style={styles.chipsRow}>
                    {DURACIONES.map((d) => {
                        const on = d.minutos === duracion.minutos;
                        return (
                            <Pressable
                                key={d.minutos}
                                onPress={() => setDuracion(d)}
                                style={[styles.chip, on && { backgroundColor: colors.mint }]}
                            >
                                <Text style={[styles.chipText, on && { color: colors.bg, fontWeight: "600" }]}>{d.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <Pressable
                disabled={seleccionadas.length === 0}
                style={[styles.startBtn, seleccionadas.length === 0 && { opacity: 0.4 }]}
                onPress={iniciarBloqueo}
            >
                <Lock size={15} color={colors.bg} />
                <Text style={styles.startBtnText}>Iniciar bloqueo</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 24 },
    title: { fontSize: 18, fontWeight: "500", color: colors.text, marginBottom: 4 },
    subtitle: { fontSize: 12, color: colors.muted, marginBottom: 20 },

    sectionLabel: { fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: colors.muted, marginBottom: 8 },

    appsGrid: { gap: 8, marginBottom: 20 },
    appCard: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#171B26", borderRadius: 14, padding: 12,
        borderWidth: 1, borderColor: "transparent",
    },
    appIcon: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
    appCardName: { fontSize: 13, color: colors.text },

    chipsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#171B26" },
    chipText: { fontSize: 12, color: colors.text },

    startBtn: {
        flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center",
        backgroundColor: colors.mint, borderRadius: 18, paddingVertical: 14, marginTop: 10,
    },
    startBtnText: { fontSize: 13, fontWeight: "600", color: colors.bg },

    activeWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
    lockCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
    activeTitle: { fontSize: 16, color: colors.text },
    activeTimer: { fontSize: 34, fontWeight: "600", color: colors.text },
    activeApps: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
    activeAppChip: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "#171B26", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    },
    activeAppText: { fontSize: 12, color: colors.text },

    cancelBtn: { flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", paddingVertical: 12 },
    cancelBtnText: { fontSize: 12, color: colors.muted },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
});