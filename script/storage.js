// Konstante, die den Zugriffstoken für die externe Storage-API enthält
const STORAGE_TOKEN = 'YQR02E4B1RN1R7GKT3NJ3PI7EDKP7PQ170R7RYV3';

// Konstante, die die URL für den Zugriff auf die externe Storage-API enthält
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

// Funktion zum Speichern eines Werts unter einem bestimmten Schlüssel in der externen Storage-API
async function setItem(key, value) {
    // Ein Payload-Objekt erstellen, das den Schlüssel, den Wert und den Zugriffstoken enthält
    const payload = { key, value, token: STORAGE_TOKEN };
    
    // Eine POST-Anfrage an die externe Storage-API senden, um den Wert zu speichern
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
};

// Funktion zum Abrufen eines Werts aus der externen Storage-API anhand eines Schlüssels
async function getItem(key) {
    // Die URL für die GET-Anfrage erstellen, die den Schlüssel und den Zugriffstoken enthält
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    
    // Eine GET-Anfrage an die externe Storage-API senden, um den Wert abzurufen
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            // Überprüfen, ob ein Wert mit dem angegebenen Schlüssel gefunden wurde
            if (res.data) {
                // Wenn ein Wert gefunden wurde, wird der Wert zurückgegeben
                return res.data.value;
            }
            // Wenn kein Wert mit dem angegebenen Schlüssel gefunden wurde, wird eine Fehlermeldung geworfen
            throw `Could not find data with key "${key}".`;
        });
};

