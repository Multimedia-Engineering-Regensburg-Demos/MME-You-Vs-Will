/* eslint-env browser */

const GAME_TIME_IN_SECONDS = 60,
    DATA_PATH = "./data/romeo-and-juliet-word-list.json";

var inputElement, // Eingabefeld für neue Wörter
    resultElement, // Liste für gefundene Wörter
    scoreElement, // Element zur Anzeige des Punktestands nach dem Spiel
    words, // Listes mit Wortschatz
    gameStarted = false; // Indikator, ob Spielrunde schon gestartet wurde

/*
 *  Die Methode initiiert die Fetch-Anfrage zum Laden der JSON-Datendatei. 
 *  Die erhaltene JSON-Datei wird als JSON eingelesen und an eine vordefinierte Callback-Methode übergeben.
 */
function loadWordlistFromJSON(callback) {
    // Laden des gesamten Wortschatzs aus der JSON-Datei: Resultat wird in onWordListAvailable verarbeitet
    fetch(DATA_PATH).then(response => response.json()).then(data => callback(data));
}

/*
 * Die Methode stellt den Einstiegspunkt Ihrer Anwendung dar. Nach Laden der WordList werden alle benötigten Variablen und Listener gesetzt, 
 * damit das Spiel bei der Eingabe eines Wortes gestartet werden kann.
 */
function onWordlistAvailable(wordlist) {
    // Speichern der Wortliste aus der JSON-Datei
    words = wordlist;
    // Referenzieren des Eingabeelements und registrieren eines change-Listeners (mit onWordEntered als Callbacl)
    inputElement = document.querySelector(".word-input");
    inputElement.addEventListener("change", onWordEntered);
    // Referenzieren des Listenelements für die Darstellung der gefundenen Wörter
    resultElement = document.querySelector(".result-list");
    // Referenzieren des HTML-Elements zum Anzeigen des erreichten Punktestands
    scoreElement = document.querySelector(".score");
}

/**
 * Die Methode reagiert auf die Eingabe in das Suchfeld. Sie überprüft, ob die Eingabe in der WortListe enthalten ist und nicht bereits eingegeben wurde
 *  und zeigt dieses Wort dann ggfs. in der Ergebnisliste an. Falls nötig wird der Spielstart eingeleitet und der Countdown gestartet. 
 */
function onWordEntered() {
    // Hier prüfen wir, ob das Spiel bereits läuft ...
    if (gameStarted === false) {
        // ... falls nicht (beim ersten Wort) starten wir den Timeout für die 60-sekündige Spielrunde
        startGame();
    }
    // Wir prüfen, ob das eingegebene Wort im Wortschatz vorhanden ist und noch nicht in der Ergebnisliste steht ...
    let wordFromList = getWordFromList(inputElement.value);
    // ... und tragen es ggf. dort ein
    if (wordFromList !== undefined) {
        addWordToResultList(wordFromList.word, wordFromList.count);
    }
    // Der Inhalt des Eingabefelds wird zurückgesetzt um die Eingabe des nächsten Worts zu erleichtern
    inputElement.value = "";
}

/**
 * Die Methode startet das Spiel und setzt dazu den Countdown-Timer auf den initialen Wert von 60 Sekunden.
 */
function startGame() {
    // Startet einen Timeout, der nach 60 Sekunden einmal die Methode showResults aufruft
    setTimeout(showResults, GAME_TIME_IN_SECONDS * 1000);
    // In der Variable gameStarted merken wir uns, dass die Spielrunde jetzt läuft
    gameStarted = true;
}

/**
 * Die Methode überprüft, ob das übergebene Wort in der Wortliste enthalten ist. 
 * Falls ja wird das Wort in der Wortliste markiert, damit dieses nicht erneut eingegeben werden kann.
 */
function getWordFromList(word) {
    // Vorbereiten der Eingabe für die Suche im Wortschatz: Entfernen von Leerzeichen vor und nach dem Wort und umwandeln in KLeinbuchstaben
    let query = word.trim().toLowerCase();
    // Iteration über alle bekannten Wörter ...
    for (let i = 0; i < words.length; i++) {
        // ... prüfen ob das aktuell betrachtet Wort noch nicht "benutzt" wurde und es mit dem eingegebenen Wort übereinstimmt
        if (words[i].used !== true && words[i].word === query) {
            // Wenn alle Bedingungen zutreffen, markieren wir das Wort als benutzt und geben es als Ergebnis der Methode zurück
            words[i].used = true;
            return words[i];
        }
    }
    // Falls kein (passendes, unbenutztes) Wort gefunden wurde, geben wir den Wert undefined zurück
    return undefined;
}

/**
 * Die Methode erstellt die für zu einem Worteintrag zugehörigen HTML-Elemente und zeigt diese in der Ergebnisanzeige an.
 */
function addWordToResultList(word, frequency) {
    // Erstellen eines neuen leeren ELements als Container für den Listeneintrag des Wortes
    let el = document.createElement("div");
    // Wenn wir in der innerHTML-Eigenschaft HTML-Code eintragen, werden die so beschriebenen Strukturen als Kindelemente des Containers erzeugt
    el.innerHTML = `<li><span class="count">${frequency}</span><span class="word">${word}</span></li>`;
    // Wir fügen das neue Listenelement (Kindelement des el-Containers, an der obersten Stelle der Liste ein)
    resultElement.insertBefore(el.firstChild, resultElement.firstChild);
}

/**
 * Die Methode wickelt das Spielende ab. Die Eingabe weiterer Wörter wird gesperrt und die Ergebniszahlen werden ermittelt und dargestellt. 
 */
function showResults() {
    // Bestimmen der Anzahl der korrekt gefundenen Wörter anhand der Listeneinträge
    let numberOfGuessedWords = resultElement.querySelectorAll("li").length,
        // Berechnen des abgedeckten Anteils des Wortschatzes
        percentageOfGuessedWords = ((numberOfGuessedWords / words.length) * 100).toFixed(2);
    // "Stoppen" des Spiels    
    gameStarted = false;
    inputElement.disabled = true;
    // Anzeigen des Ergebnis in Form eines dynamisch generierten Textes im entsprechenden HTML-Element
    scoreElement.innerHTML =
        `Congratulations! You remembered ${numberOfGuessedWords} words from Romeo and Juliet. These are ~ ${percentageOfGuessedWords} percent of all unique words Shakespeare used to write the play!`;
}

loadWordlistFromJSON(onWordlistAvailable);