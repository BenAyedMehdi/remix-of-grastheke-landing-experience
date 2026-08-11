# Visuelle Regressionstests – Produktkarten

Prüft die Zeilenstruktur der Produktkarten (`/sortiment`) über 7 Breakpoints
(390, 440, 768, 900, 1024, 1280, 1600 px – 2 / 3 / 4 Spalten) und 3 Textlängen-Varianten
(default / extrem lang / extrem kurz):

- erwartete Spaltenanzahl pro Breakpoint (2 mobil, 3 Tablet, 4 Desktop)
- gleiche Kartenhöhe und bündiger unterer Abschluss innerhalb einer Grid-Zeile
- bündige Kopfbereiche (Name/Kategorie links, THC/CBD rechts)
- kein Abschneiden von Produktname/Kategorie, kein Überlauf der Karte
- Pixel-Vergleich des Grids gegen die Baselines in `baselines/`

```bash
python tests/visual/product_cards_visual.py            # prüfen (Exit 1 bei Abweichung)
python tests/visual/product_cards_visual.py --update   # Baselines neu erzeugen
```

Der Dev-Server muss auf `http://localhost:8080` laufen. Abweichungen landen als
`*.actual.png` / `*.diff.png` in `artifacts/` (nicht eingecheckt).
