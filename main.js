// Verwendete Komponenten importieren
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Toolbar.js";
import "@ui5/webcomponents/dist/ToolbarButton.js";
import "@ui5/webcomponents/dist/ToolbarSpacer.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Link.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents-fiori/dist/ShellBar.js";
import "@ui5/webcomponents/dist/Toast.js";

// Referenzen zu HTML-Elementen abrufen
let dialogOpener = document.getElementById("dialogOpener");
let dialog = document.getElementById("dialog");
let deleteButton = document.getElementById("deleteButton");
let artikelTable = document.getElementById("artikelTable");
let errorDialogDelete = document.getElementById("errorDialogDelete");
let errorDialogDeleteCloser = document.getElementById("errorDialogDeleteCloser");
let errorDialogCreate = document.getElementById("errorDialogCreate");
let errorDialogCreateCloser = document.getElementById("errorDialogCreateCloser");
let dialogClosers = [...dialog.querySelectorAll(".dialogCloser")];
let createButton = dialog.querySelector(".dialogCreate");
let createToast = document.getElementById("createToast");
let deleteToast = document.getElementById("deleteToast");

// Eigenschaften für den Dialog-Öffner setzen
dialogOpener.accessibilityAttributes = {
    hasPopup: "dialog",
    controls: dialog.id,
};

// Daten aus model.json holen und Tabelle befüllen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    fetch('model.json')  
        .then(response => response.json())  
        .then(data => {
            const artikelBestand = data.Artikelbestand;
            artikelBestand.forEach(artikel => {
                const tableRow = document.createElement('ui5-table-row');
                
                // Zelle für Artikelnummer
                const artikelnummerCell = document.createElement('ui5-table-cell');
                artikelnummerCell.textContent = artikel.Artikelnummer;
                tableRow.appendChild(artikelnummerCell);

                // Zelle für Bezeichnung
                const bezeichnungCell = document.createElement('ui5-table-cell');
                bezeichnungCell.textContent = artikel.Bezeichnung;
                tableRow.appendChild(bezeichnungCell);

                // Zelle für Preis
                const preisCell = document.createElement('ui5-table-cell');
                preisCell.textContent = `${artikel.Preis} EUR`;
                tableRow.appendChild(preisCell);

                // Zelle für Bestand
                const bestandCell = document.createElement('ui5-table-cell');
                bestandCell.textContent = `${artikel.Bestand} Stk.`;

                // Bestand farbig markieren
                const bestandValue = parseInt(artikel.Bestand, 10);
                if (bestandValue < 10) {
                    bestandCell.style.color = "#AA0808";  // Rot bei niedrigem Bestand
                } else if (bestandValue > 49) {
                    bestandCell.style.color = "#256F3A";  // Grün bei hohem Bestand
                } else {
                    bestandCell.style.color = "#B44F00";  // Orange bei mittlerem Bestand
                }
                tableRow.appendChild(bestandCell);

                // Zeile zur Tabelle hinzufügen
                artikelTable.appendChild(tableRow);
            });
        })
        .catch(error => console.error('Error fetching data:', error));  // Fehlerbehandlung falls Abrufen schief geht
});

// Event-Listener für das Öffnen des Dialogs
dialogOpener.addEventListener("click", () => {
    dialog.open = true;
});

// Event-Listener für das Schließen des Dialogs
dialogClosers.forEach(btn => {
    btn.addEventListener("click", () => {
        dialog.open = false;
    });
});

// Event-Listener für das Erstellen eines neuen Artikels
createButton.addEventListener("click", () => {
    const artikelnummer = document.getElementById("Artikelnummer").value;
    const bezeichnung = document.getElementById("Bezeichnung").value;
    const preis = document.getElementById("Preis").value;
    const bestand = document.getElementById("Bestand").value;

    // Prüfen, ob alle Eingabefelder ausgefüllt sind
    if (artikelnummer && bezeichnung && preis && bestand) {
        const newRow = document.createElement("ui5-table-row");

        // Zelle für Artikelnummer
        const artikelnummerCell = document.createElement("ui5-table-cell");
        artikelnummerCell.innerHTML = `<span>${artikelnummer}</span>`;
        newRow.appendChild(artikelnummerCell);

        // Zelle für Bezeichnung
        const bezeichnungCell = document.createElement("ui5-table-cell");
        bezeichnungCell.innerHTML = `<span>${bezeichnung}</span>`;
        newRow.appendChild(bezeichnungCell);

        // Zelle für Preis
        const preisCell = document.createElement("ui5-table-cell");
        preisCell.innerHTML = `<span>${preis} EUR</span>`;
        newRow.appendChild(preisCell);

        // Zelle für Bestand
        const bestandCell = document.createElement("ui5-table-cell");
        bestandCell.innerHTML = `<span>${bestand} Stk.</span>`;

        // Bestand des neuen Artikels farbig kennzeichnen
        const bestandValue = parseInt(bestand, 10);
        if (bestandValue < 10) {
            bestandCell.style.color = "#AA0808";  // Rot bei niedrigem Bestand
        } else if (bestandValue > 49) {
            bestandCell.style.color = "#256F3A";  // Grün bei hohem Bestand
        } else {
            bestandCell.style.color = "#B44F00";  // Orange bei mittlerem Bestand
        }
        newRow.appendChild(bestandCell);

        // Neue Zeile zur Tabelle hinzufügen
        artikelTable.appendChild(newRow);

        // Dialog schließen und MessageToast anzeigen
        dialog.open = false;
        createToast.show();
    } else {
        // Fehlerdialog öffnen, wenn Eingaben fehlen
        errorDialogCreate.open = true;
    }
});

// Event-Listener für das Schließen des Fehlerdialogs 
errorDialogCreateCloser.addEventListener("click", () => {
    errorDialogCreate.open = false;
});

// Event-Listener für das Löschen ausgewählter Artikel
deleteButton.addEventListener("click", () => {
    const selectedRows = artikelTable.querySelectorAll("ui5-table-row[selected]");

    if (selectedRows.length > 0) {
        selectedRows.forEach(row => {
            artikelTable.removeChild(row);
        });
        deleteToast.show();  // MessageToast anzeigen
    } else {
        errorDialogDelete.open = true;  // Fehlerdialog öffnen, wenn keine Zeile ausgewählt ist
    }
});

// Event-Listener für das Schließen des Fehlerdialogs 
errorDialogDeleteCloser.addEventListener("click", () => {
    errorDialogDelete.open = false;
});
