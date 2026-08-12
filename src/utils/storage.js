// src/utils/storage.js
// Wrapper chiquito sobre AsyncStorage para no repetir try/catch
// y JSON.stringify/parse en cada pantalla.
//
// Instalar antes de usar esto:
// npx expo install @react-native-async-storage/async-storage

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function guardar(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("Error guardando", key, e);
    }
}

export async function cargar(key, valorPorDefecto) {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw != null ? JSON.parse(raw) : valorPorDefecto;
    } catch (e) {
        console.error("Error cargando", key, e);
        return valorPorDefecto;
    }
}

// Nombres de keys centralizados, así no hay typos entre pantallas.
export const KEYS = {
    VIGILADAS: "swipeless:vigiladas",
    BLOQUEO: "swipeless:bloqueoActivo",
};