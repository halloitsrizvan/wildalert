# 🐘 Wild Alert
### Geo-Fenced Wildlife Emergency Intelligence Network

**Wild Alert** is a high-precision wildlife monitoring and community emergency coordination platform designed for Kerala’s forest-border regions. It transforms scattered wildlife sightings into structured, actionable geographic intelligence using real-time GIS mapping, geo-fenced community nodes, and automated emergency broadcasting.

---

## 🌍 The Problem
Human-wildlife conflict in the Western Ghats (Elephants, Leopards, Wild Boars) is currently managed through unstructured communication:
*   **Location Ambiguity**: WhatsApp alerts lack precise GIS coordinates.
*   **Alert Fatigue**: Irrelevant notifications from distant sectors cause citizens to ignore critical warnings.
*   **Delayed Response**: Lack of centralized coordination leads to inefficient ranger dispatch.
*   **Data Fragmentation**: No historical records or predictive analytics to identify movement corridors.

## 🎯 Our Solution
Wild Alert builds a **Geo-Fenced Intelligence Network** that connects citizens and authorities through a localized, high-fidelity emergency grid.

### 🛡️ Authority Command Center
*   **Tactical Dashboard**: Real-time monitoring of sector-wide sightings and member nodes.
*   **Signal Management**: GIS-based emergency broadcasting with localized targeting.
*   **Intelligence Ledger**: Comprehensive historical audit of verified wildlife sightings.
*   **Risk Analytics**: Predictive threat modeling using spatial density heatmaps.
*   **Member Registry**: Manual provisioning and management of community safety nodes.

### 🌐 Citizen Interface
*   **Live Intelligence Map**: Real-time visualization of wildlife markers, corridor overlays, and danger zones.
*   **Rapid Reporting**: Quick-action sighting submission with GPS pinpointing and voice-note evidence.
*   **Localized Alerts**: Real-time notifications filtered by geographic community boundaries to prevent alert fatigue.

---

## 📡 Hybrid Sensor Detection Technology
Wild Alert integrates advanced hardware for automated forest-border monitoring:
*   **PIR Trigger Layer (HC-SR501)**: Low-power infrared sensing for initial motion detection.
*   **mmWave Radar Confirmation (HLK-LD2450)**: High-precision tracking of distance, direction, and multi-target movement.
*   **All-Weather Performance**: Reliable operation in darkness, fog, rain, and dense vegetation where cameras fail.
*   **Edge Processing**: Powered by **ESP32** with solar energy supply and LoRa/Wi-Fi transmission.

---

## 🧩 Technology Stack

### Current Implementation (Prototype)
*   **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS
*   **Identity & Auth**: Firebase Authentication
*   **Intelligence Engine**: Google Firestore (Real-time DB)
*   **GIS & Mapping**: Leaflet.js, React Leaflet, OpenStreetMap (Dark Matter)
*   **Aesthetics**: Framer Motion, Shadcn/UI, Lucide React
*   **State Management**: React Hooks (useAuth, useCommunity)

### Future Expansion
*   **AI/ML**: Movement prediction models using TensorFlow Lite for hotspot forecasting.
*   **Communication**: LoRaWAN Mesh Networking for offline alert synchronization in remote zones.
*   **Mobile**: Transition to React Native for high-performance offline mapping.
*   **GIS Advanced**: PostGIS and Mapbox integration for 3D terrain-aware corridor modeling.

---

## 📂 Project Structure
```bash
src/
 ├── app/
 │   ├── (public)/       # Citizen reporting & live map interfaces
 │   ├── (authority)/    # Command dashboard, analytics & management
 │   └── login/          # Unified enrollment & access control
 ├── components/
 │   ├── authority/      # Specialized command-center UI modules
 │   ├── public/         # Community-facing landing & awareness tools
 │   ├── map/            # GIS & Spatial intelligence components
 │   └── ui/             # High-fidelity design system (Shadcn)
 ├── hooks/              # Real-time data synchronization logic
 ├── lib/                # Firebase & GIS utility configurations
 └── types/              # Operational data schemas
```

---

## 🧪 Methodology
The project utilizes a **Rapid MVP Prototyping** approach, prioritizing:
1.  **UI/UX Realism**: Creating a "Command Center" feel for authority confidence.
2.  **GIS Visualization**: High-precision mapping of corridors and risk nodes.
3.  **Real-time Interaction**: Instant synchronization between citizen reports and authority dashboards.
4.  **Hardware-Software Bridge**: Demonstrating how sensor data flows into the emergency broadcast protocol.

---

## 🔮 Future Directions
*   **AI Wildlife Prediction**: Forecasting migration paths based on seasonal trends.
*   **Drone Integration**: Automated thermal drone dispatch upon sensor trigger.
*   **Multilingual Support**: Malayalam voice alerts and localized interfaces for accessibility.
*   **NGO/Gov Integration**: Direct data bridges for Kerala Forest Department coordination.

---

## 🎬 Built With Passion for Coexistence
Wild Alert envisions a future where technology supports safer boundaries between humans and wildlife, transforming community observations into structured, localized intelligence.

**Status**: Prototype / Hackathon MVP  
**Operational Unit**: Western Ghats Wildlife Intelligence Unit (Simulated)
