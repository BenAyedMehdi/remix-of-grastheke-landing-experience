# Remix of Grastheke Landing Experience

Baue eine moderne, sehr clean designte Landing Page für "Grastheke", eine Marke für medizinisches Cannabis mit mehreren Partner-Apotheken-Standorten in Deutschland.

DESIGN-RICHTUNG:

Orientiere dich am visuellen Stil von purplefarm.ca: großzügiger Weißraum, große hochwertige Produktbilder/Flower-Fotografie, ruhige neutrale Farbpalette (off-white/schwarz als Basis, ein einziger Akzentton – z.B. ein sattes Grün oder Anthrazit), reduzierte serifenlose Typografie mit klarer Hierarchie, dezente Micro-Interactions/Hover-States, keine überladenen Elemente. Wirkt premium, medizinisch-seriös, nicht "Kifferkultur"-verspielt.

STRUKTUR DER SEITE:

1. Header/Navigation

- Logo "Grastheke" links, Navigation rechts (Standorte, Sortiment, News/Drops, Über uns, Kontakt)

- Sticky Header beim Scrollen, transparent → weiß/dunkel on scroll

2. Hero-Sektion

- Großes Bild/Video-Loop im Hintergrund (Flower/Produkt-Ästhetik)

- Kurzer, prägnanter Claim (Platzhaltertext, z.B. "Medizinisches Cannabis. Verlässlich. Regional.")

- CTA-Button "Standort wählen"

3. Standortauswahl (zentrales Feature)

- Interaktive Kachel- oder Karten-Ansicht aller Grastheke-Partnerapotheken-Standorte

- Auswahl per Klick oder Dropdown/Suchfeld (PLZ/Stadt-Eingabe)

- Nach Auswahl: Standort wird als "aktiver Standort" gespeichert (State/Context), beeinflusst angezeigte Verfügbarkeit/Sortiment falls später gewünscht

- Platzhalter-Standorte als Dummy-Daten (3–5 Städte)

4. Aktuelle Drops & News

- Horizontale Karten-Slider oder Grid im Purplefarm-Stil ("Neue Genetik verfügbar", "Lieferung KW34" etc.)

- Jede Karte: Bild, Titel, kurzer Teaser, Datum

- Optional Filter nach "Neu" / "Restock" / "News"

5. Produktübersicht / Sortiment

- Grid-Ansicht im Purplefarm-Stil (große Produktbilder, minimalistische Info: Name, Kategorie/Strain-Typ, THC/CBD-Range)

- Kategorisierung ähnlich Purplefarm (z.B. nach Wirkprofil: Entspannung, Fokus, Energie – oder nach Genetik: Indica/Sativa/Hybrid)

- Hover-Effekt zeigt zusätzliche Kurzinfo

6. Produktdetailseite (Klick auf Produkt)

- Großes Produktbild, Name, Beschreibung, Terpenprofil/Wirkprofil, THC/CBD-Werte

- Prominenter Button "Jetzt bestellen" 

- WICHTIG: Dieser Button leitet per externem Link (target="_blank" oder normaler Redirect) zu unserem bestehenden Online-Shop weiter → Platzhalter-URL "https://shop.grastheke.de/produkt/[slug]" einbauen, klar als externer Link/Redirect implementieren, KEIN internes Checkout/Warenkorb-System bauen

7. Footer

- Standorte-Übersicht, rechtliche Links (Impressum, Datenschutz, AGB), Social Media, Newsletter-Anmeldung, Altersverifikation-Hinweis (18+)

TECHNISCHE ANFORDERUNGEN:

- Vollständig responsive (Mobile-First)

- Sauberer, komponentenbasierter Code (React)

- Platzhalter-Daten/Bilder verwenden (unsplash-style Cannabis/Flower-Bilder), klar als Dummy-Content kennzeichnen

- Kein echtes Checkout/Payment – Bestellen-Button ist ein reiner Redirect-Link zum externen Shop

- Altersverifikations-Gate beim ersten Seitenaufruf (18+, ähnlich wie Purplefarm), simpel gehalten

TON & SPRACHE:

- Deutsch, seriös, medizinisch-fachlich aber zugänglich, keine reißerische Kifferkultur-Sprache

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b786785c-6029-44dd-88c7-548a8c44dbb4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
