// src/utils/path.js
export function url(path) {
    const base = import.meta.env.BASE_URL;
    // Führenden Slash entfernen, falls vorhanden, um Doppel-Slashes zu verhindern
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
}