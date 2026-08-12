// src/screens/AjustesScreen.js
import { Bell, Camera, ChevronRight, Clock, Film, MessageCircle, MessageSquareText, Music2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { cargar, guardar, KEYS } from "../utils/storage";

const APPS = [
    { id: "ig", name: "Instagram", icon: Camera, color: "#E19A8C" },
    { id: "tk", name: "TikTok", icon: Music2, color: "#8FB8C7" },
    { id: "x", name: "X", icon: MessageCircle, color: "#9AA3B8" },
    { id: "yt", name: "YouTube", icon: Film, color: "#E0B27A" },
];

const OTRAS_OPCIONES = [
    { id: "duracion", label: "Duración del Respiro", icon: Clock },
    { id: "frases", label: "Frases personalizadas", icon: MessageSquareText },
    { id: "notif", label: "Notificaciones", icon: Bell },
];

export default function AjustesScreen() {
    const [vigiladas, setVigiladas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Al montar la pantalla, leemos lo que se guardó la última vez.
    useEffect(() => {
        (async () => {
            const guardadas = await cargar(KEYS.VIGILADAS, ["ig", "tk"]);
            setVigiladas(guardadas);
            setCargando(false);
        })();
    }, []);

    const toggleApp = (id) => {
        setVigiladas((prev) => {
            const nuevo = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            guardar(KEYS.VIGILADAS, nuevo); // se guarda apenas cambia, no hace falta un botón "Guardar"
            return nuevo;
        });
    };

    if (cargando) return <View style={styles.container} />; // evita el "parpadeo" mientras carga

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <Text style={styles.title}>Ajustes</Text>

                <Text style={styles.sectionLabel}>Mis apps</Text>
                <View style={styles.section}>
                    {APPS.map((a) => {
                        const on = vigiladas.includes(a.id);
                        return (
                            <View key={a.id} style={styles.appRow}>
                                <View style={[styles.appIcon, { backgroundColor: a.color + "33" }]}>
                                    <a.icon size={16} color={a.color} />
                                </View>
                                <Text style={styles.appName}>{a.name}</Text>
                                <Switch
                                    value={on}
                                    onValueChange={() => toggleApp(a.id)}
                                    trackColor={{ false: colors.border, true: colors.mint }}
                                    thumbColor={colors.text}
                                />
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.sectionLabel}>Preferencias</Text>
                <View style={styles.section}>
                    {OTRAS_OPCIONES.map((o) => (
                        <Pressable key={o.id} style={styles.optionRow} onPress={() => { }}>
                            <o.icon size={17} color={colors.muted} />
                            <Text style={styles.optionLabel}>{o.label}</Text>
                            <ChevronRight size={16} color={colors.muted} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 50 },
    title: { fontSize: 18, fontWeight: "500", color: colors.text, marginBottom: 20 },
    sectionLabel: { fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: colors.muted, marginBottom: 8 },
    section: { backgroundColor: "#171B26", borderRadius: 16, marginBottom: 20, overflow: "hidden" },
    appRow: {
        flexDirection: "row", alignItems: "center", gap: 10,
        paddingHorizontal: 14, paddingVertical: 12,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
    },
    appIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    appName: { flex: 1, fontSize: 13, color: colors.text },
    optionRow: {
        flexDirection: "row", alignItems: "center", gap: 12,
        paddingHorizontal: 14, paddingVertical: 14,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
    },
    optionLabel: { flex: 1, fontSize: 13, color: colors.text },
});