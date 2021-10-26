/* eslint-env browser */

const DATA_PATH = "data/romeo-and-juliet-word-list.json";

/*
 *  Die Methode initiiert die Fetch-Anfrage zum Laden der JSON-Datendatei. 
 *  Die erhaltene JSON-Datei wird als JSON eingelesen und an eine vordefinierte Callback-Methode übergeben.
 */
function loadWordlistFromJSON(callback) {
    // Use fetch api to load word list from JSON
    fetch(DATA_PATH)
        .then((response) => response.json())
        .then((data) => callback(data));
}

/*
 * Die Methode stellt den Einstiegspunkt Ihrer Anwendung dar. Nach Laden der WordList werden alle benötigten Variablen und Listener gesetzt, 
 * damit das Spiel bei der Eingabe eines Wortes gestartet werden kann.
 */
function onWordlistAvailable(wordlist) {
    console.log("### WordList received ###");
    // Prints the first 10 entries from the received word list
    console.log(wordlist.slice(0, 10));
    // Start your own implementation here
}

loadWordlistFromJSON(onWordlistAvailable);