# دليل ملاجئ الكويت — Kuwait Shelters Finder

A public-facing PWA that displays all civil defense shelters in Kuwait on an interactive map, detects the user's location, highlights the nearest shelter, and provides turn-by-turn navigation.

---

## ✨ Features

- **Splash screen** with دعاء + official government logos
- **Interactive map** (Leaflet + CartoDB Light tiles) with all 42 shelters
- **Auto location detection** — nearest shelter highlighted with pulsing amber marker
- **Manual area picker** — dropdown of Kuwait governorates/areas as GPS fallback
- **Shelter cards** — distance, walking + driving times, capacity, status, last verified date
- **In-app navigation** — route drawn via OSRM (no API key required)
- **Google Maps + Waze** deep links
- **List view** with real-time search and sort-by-distance
- **"شارك موقعي" Panic button** — share location via WhatsApp, SMS, or copy link
- **Emergency contacts** modal with direct-dial numbers (Civil Defense 994, Police 112, etc.)
- **RTL/LTR** fully supported — Arabic (default) + English
- **Accessibility** — high contrast mode, large text, 48px touch targets
- **PWA** — installable on Android and iOS home screens, tile caching for offline maps
- **Zero backend** — all data embedded in `shelters.json`

---

## 🚀 Setup

```bash
git clone <repo>
cd Kuwait-Shelters-Finder
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
/public
  manifest.json          # PWA manifest (Arabic name, navy theme)
  sw.js                  # Service worker (tile caching, offline support)
  /icons                 # PWA icons (72–512px)

/src
  /components
    SplashScreen.jsx     # Full-screen splash with دعاء and logos
    Map.jsx              # Leaflet map, markers, tooltips
    ShelterCard.jsx      # Bottom sheet / side panel with actions
    ListView.jsx         # Searchable, sorted list view
    EmergencyContacts.jsx # Emergency numbers modal
    PanicButton.jsx      # "شارك موقعي" floating button
    AreaPicker.jsx       # Manual area dropdown (27 areas)
    NavigationOverlay.jsx # OSRM route overlay + nav banner
    LanguageSwitcher.jsx # AR/EN toggle
    AccessibilityToggle.jsx # High contrast + large text

  /data
    shelters.json        # 42 shelter records with coordinates, status, capacity

  /i18n
    ar.json              # All Arabic UI strings
    en.json              # All English UI strings
    index.js             # i18next initialization

  /hooks
    useGeolocation.js    # Browser geolocation with status states
    useDistances.js      # Haversine distance calculation + formatting

  App.jsx                # Main state, layout, view switching
  main.jsx               # Entry point, i18n init, SW registration
  index.css              # Tailwind + custom animations, RTL overrides
```

---

## 🏗️ How to Update Shelter Data

1. Open `src/data/shelters.json`
2. Each shelter record has this shape:

```json
{
  "id": "KW-001",
  "nameAr": "ملجأ مجمع الكويت",
  "nameEn": "Kuwait Complex Shelter",
  "regionAr": "مدينة الكويت",
  "regionEn": "Kuwait City",
  "governorateAr": "محافظة العاصمة",
  "governorateEn": "Capital Governorate",
  "area": "Kuwait City",
  "lat": 29.3697,
  "lng": 47.9783,
  "capacity": 500,
  "status": "open",
  "coordinateAccuracy": "verified",
  "lastVerified": "2024-11-15",
  "type": "civil_defense",
  "notes": ""
}
```

3. Key fields:
   - `coordinateAccuracy`: `"verified"` or `"approximate"` — approximate shows a warning badge
   - `status`: `"open"` or `"unknown"`
   - `lastVerified`: ISO date string `YYYY-MM-DD`
4. Update `"dataLastUpdated"` at the top of the JSON file
5. Rebuild: `npm run build`

---

## 🌐 How to Add a New Language

1. Copy `src/i18n/en.json` to e.g. `src/i18n/fr.json`
2. Translate all values (keep all JSON keys unchanged)
3. In `src/i18n/index.js`, import and register:

```js
import fr from './fr.json';

// In resources:
fr: { translation: fr },
```

4. In `src/components/LanguageSwitcher.jsx`, add a button for the new language
5. Set `dir` to `'ltr'` or `'rtl'` as appropriate for the language

---

## ⚙️ Configuration

**Report contact (WhatsApp):** edit `REPORT_WHATSAPP` in `src/components/ShelterCard.jsx`

**Emergency numbers:** update `src/i18n/ar.json` and `en.json` under `emergency.numbers`

---

## 🛡️ Data Quality Notes

- Shelters marked `coordinateAccuracy: "approximate"` are flagged in the UI with a warning badge
- All coordinates should be verified against official sources before production deployment
- Data sourced from Kuwait Ministry of Interior Civil Defense records
- Use the "Report Wrong Location" button in any shelter card to file corrections

---

## 📱 PWA Install

- **Android Chrome**: "Add to Home Screen" install prompt appears automatically
- **iOS Safari**: Tap Share → "Add to Home Screen"
- Service worker caches map tiles for partial offline support

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet.js + CartoDB Light tiles |
| Routing | Leaflet Routing Machine + OSRM (free, no API key) |
| i18n | i18next + react-i18next |
| PWA | Web App Manifest + Service Worker |
| Fonts | Cairo (Arabic) + Inter (Latin) from Google Fonts |
| Data | Local JSON — no backend, no database |

---

بيانات الملاجئ مصدرها وزارة الداخلية الكويتية / Shelter data sourced from Kuwait Ministry of Interior
