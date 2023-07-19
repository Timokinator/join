// Eine asynchrone Funktion, die den HTML-Inhalt in bestimmte Elemente einfügt, die das Attribut "w3-include-html" haben.
async function includeHtml() {
    // Alle Elemente mit dem Attribut "w3-include-html" auswählen
    let includeElements = document.querySelectorAll('[w3-include-html]');

    // Schleife durch alle gefundenen Elemente mit dem Attribut "w3-include-html" durchführen
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];

        // Den Wert des "w3-include-html"-Attributs erhalten, der den Pfad zur externen HTML-Datei enthält
        file = element.getAttribute("w3-include-html");

        // Die externe HTML-Datei über Fetch-API abrufen
        let resp = await fetch(file);

        // Überprüfen, ob die Anfrage erfolgreich war (Statuscode 200)
        if (resp.ok) {
            // Den Inhalt der externen HTML-Datei in das Element einfügen
            element.innerHTML = await resp.text();
        } else {
            // Wenn die Anfrage fehlschlägt, "Page not found" in das Element einfügen
            element.innerHTML = 'Page not found';
        };
    };
};


// Funktion zum Navigieren zur Zusammenfassungsseite
function toSummary() {
    window.location.href = '../html/summary.html';
};


// Funktion, um das Untermenü zu öffnen, je nach übergebenem Parameter "resolution" (desktop oder mobile)
function openSubmenu(resolution) {
    let content = document.getElementById('container_submenu_user');
    content.classList.remove('d-none');

    if (resolution == 'desktop') {
        // Wenn die Auflösung "desktop" ist, das Desktop-Untermenü anzeigen
        content.innerHTML = renderSubmenuDesktop();
    } else if (resolution == 'mobile') {
        // Wenn die Auflösung "mobile" ist, das Mobile-Untermenü anzeigen und nach 2,5 Sekunden schließen
        content.innerHTML = renderSubmenuMobile();
        setTimeout(() => {
            closeSubmenu();
        }, 2500);
    };
};


// Funktion, die den HTML-Inhalt für das Desktop-Untermenü erstellt und zurückgibt
function renderSubmenuDesktop() {
    return /*html*/`
    < div onclick = "closeSubmenu()" class="submenu" >
        <a href="../html/index.html">Log out</a>
        </div >
    `;
};


// Funktion, die den HTML-Inhalt für das Mobile-Untermenü erstellt und zurückgibt
function renderSubmenuMobile() {
    return /*html*/`
    < div class="submenu" >
            <a href="../html/help.html">Help</a>
            <a href="../html/legal_notice.html">Legal Notice</a>
            <a href="../html/index.html">Log out</a>
        </div >
    `;
};


// Funktion, um das Untermenü zu schließen
function closeSubmenu() {
    let content = document.getElementById('container_submenu_user');
    content.classList.add('d-none');
};

