# Louan der Krieger

Ein browserbasiertes 2D-Canvas-Spiel mit Story-Intro, Startbildschirm, Levelwechsel, Gegnern, Bosskaempfen, Audio-Steuerung und mobilen Touch-Controls.

## Ueber das Projekt

In **Louan der Krieger** begibst du dich mit Louan auf die Suche nach seinen verschwundenen Geschwistern. Das Spiel startet mit einem Intro, fuehrt in einen animierten Startscreen und wechselt danach in das eigentliche Gameplay auf einem HTML-Canvas.

Das Projekt ist in **vanilla JavaScript**, **HTML** und **CSS** umgesetzt und benoetigt kein Build-Tool. Alle Assets wie Bilder, Audio und Fonts werden lokal aus dem Projekt geladen.

## Features

- Story-Intro mit Startscreen und Uebergangsanimationen
- Canvas-basiertes 2D-Gameplay
- Zwei Level mit persistierter Levelauswahl pro Session
- Gegner, Boss-Logik und Sammelobjekte
- Sound- und Musikumschaltung im UI
- Fullscreen-Unterstuetzung
- Mobile Touch-Steuerung inklusive Orientierungshinweis
- Dialoge fuer Steuerung, Credits, Datenschutz und Impressum

## Technologien

- HTML5
- CSS3
- JavaScript (ES Modules)
- HTML Canvas API

## Projektstruktur

```text
.
|-- index.html
|-- assets/
|   |-- audio/
|   |-- fonts/
|   `-- img/
|-- js/
|   |-- game/
|   |-- lvl/
|   |-- models/
|   |-- sprites-path/
|   `-- templates/
`-- style/
```

Wichtige Bereiche:

- `index.html`: Einstiegspunkt der Anwendung
- `js/game/`: Startfluss, Canvas-Setup, Eingaben und globaler Zustand
- `js/lvl/`: Leveldefinitionen
- `js/models/`: Spiellogik fuer Charaktere, Gegner, Objekte und Welt
- `js/templates/`: HTML-Templates fuer Startscreen und Dialoge
- `style/`: Layout, Canvas-, Dialog- und Mobile-Styles
- `assets/`: Bilder, Audio-Dateien und Schriftarten

## Projekt starten

Da das Projekt ES-Module verwendet, sollte es ueber einen **lokalen Webserver** gestartet werden und nicht direkt per `file:///`.

### Variante 1: Mit VS Code Live Server

1. Projekt in VS Code oeffnen.
2. Die Erweiterung **Live Server** installieren, falls noch nicht vorhanden.
3. `index.html` mit Live Server starten.

### Variante 2: Mit Python

Falls Python installiert ist:

```bash
python -m http.server 8000
```

Danach im Browser oeffnen:

```text
http://localhost:8000
```

## Steuerung

### Desktop

- `Pfeil links`: nach links laufen
- `Pfeil rechts`: nach rechts laufen
- `Pfeil oben`: springen
- `A` + Pfeiltaste: rennen
- `F`: werfen
- `F11`: Vollbildmodus

### Mobile

- Touch-Buttons fuer links, rechts, springen, rennen und werfen
- Extra Buttons fuer Menue und Musik
- Hinweis bei unguenstiger Geraeteausrichtung

## Spielablauf

- Intro mit Tastendruck zum Startscreen
- Startscreen mit Steuerung, Musikumschalter und Meta-Dialogen
- Uebergang ins Spiel ueber Tastatur oder Touch
- Fortschritt und Levelwahl werden innerhalb der Browser-Session gespeichert

## Assets und Credits

- Spielkonzept und Umsetzung: Julian
- Bild-Assets: Craftpix
- Soundeffekte und Musik: Pixabay
- Schriften: Google Fonts

Alle verwendeten Assets liegen lokal im Projektordner.

## Hinweise fuer GitHub

Wenn du das Projekt auf GitHub praesentierst, kannst du zusaetzlich noch ergaenzen:

- ein Gameplay-GIF oder Screenshot im Repository
- eine kurze Roadmap mit geplanten Features
- bekannte offene Punkte oder technische Verbesserungen

## Moegliche Erweiterungen

- weitere Level und Gegnerarten
- Speichersystem ueber die aktuelle Session hinaus
- Optionsmenue fuer Audio und Grafik
- Ladebildschirm und feinere Balancing-Anpassungen

## Lizenz

Aktuell ist keine eigene Lizenzdatei hinterlegt. Wenn das Projekt oeffentlich auf GitHub veroeffentlicht wird, sollte eine passende Lizenzdatei ergaenzt werden.