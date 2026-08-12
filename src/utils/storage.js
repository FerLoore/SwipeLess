// src/utils/storage.js
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

// Para listas que van creciendo (como las capturas de palabra):
// lee la lista actual, le agrega el item nuevo, y guarda todo de nuevo.
export async function agregar(key, item) {
    const lista = await cargar(key, []);
    const nuevaLista = [...lista, item];
    await guardar(key, nuevaLista);
    return nuevaLista;
}

export const KEYS = {
    VIGILADAS: "swipeless:vigiladas",
    BLOQUEO: "swipeless:bloqueoActivo",
    CAPTURAS: "swipeless:capturas", // array de { palabra, app, accion, fecha }
};