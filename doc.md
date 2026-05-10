🐘 Wild Alert
Geo-Fenced Wildlife Emergency Intelligence Network

Wild Alert is a realtime wildlife monitoring and community emergency coordination platform designed for Kerala’s forest-border regions.

The platform helps local communities and area authorities:

report wildlife sightings
receive localized emergency alerts
visualize wildlife movement
monitor elephant corridors
identify conflict hotspots
coordinate community-level responses

Unlike traditional WhatsApp-based alert systems, Wild Alert transforms scattered wildlife reports into structured geographic intelligence using realtime GIS mapping, geo-fenced communities, and localized alert broadcasting.

The system is designed as a prototype for scalable human-wildlife conflict management in Kerala.

🌍 Problem Statement

Kerala frequently experiences human-wildlife conflict, especially involving:

elephants
leopards
snakes
wild boars

Current communication systems are mostly:

unstructured WhatsApp groups
delayed alerts
location ambiguity
no centralized tracking
no historical analytics
no geographic intelligence

This creates:

delayed response
panic
inefficient coordination
lack of actionable data
unsafe construction and travel decisions

Wild Alert addresses this by building a:

Geo-Fenced Wildlife Intelligence Network
🎯 Project Objective

The goal of Wild Alert is to:

provide localized wildlife alerts
create area-based community networks
visualize wildlife activity on live maps
enable faster emergency coordination
support future conservation analytics
improve community awareness and safety
🧠 Core Concept

Wild Alert introduces:

Geo-Fenced Communities

Each community:

represents a real geographic area
is created by a community authority
has its own alert ecosystem
receives only relevant local alerts

Users automatically join communities based on:

GPS location
polygon-based geographic boundaries

This avoids:

statewide alert spam
irrelevant notifications
unstructured communication
⚙️ Key Features
🌐 Public Features
Landing Page
platform introduction
wildlife conflict storytelling
live statistics
corridor preview
emergency awareness
Live Wildlife Map
realtime wildlife markers
hotspot zones
heatmaps
community boundaries
corridor overlays
live alerts
Report Sighting

Users can:

report wildlife sightings
upload photos
share GPS location
select severity level
submit emergency reports
Community Alert Feed
realtime local alerts
emergency warnings
wildlife movement updates
critical announcements
🛡️ Authority Features
Community Authority Dashboard

Authorities can:

create geo-fenced communities
draw polygon boundaries
manage alerts
monitor reports
analyze hotspot activity
view community statistics
Polygon-Based Zone Management

Authorities can:

draw regions on map
edit boundaries
create alert zones
manage community territories
Localized Alert Broadcasting

Alerts are only sent to:

users inside affected community regions

This creates:

precise emergency communication
less alert fatigue
better relevance
🗺️ GIS & Intelligence Features
realtime wildlife mapping
polygon overlays
danger zones
heatmaps
corridor intelligence
geographic filtering
movement visualization
🧱 System Architecture

The application uses:

Dual Route Group Architecture
(public)
(authority)

This separates:

public community experience
authority dashboard systems
🧩 Tech Stack (Current Prototype)
Frontend
Next.js (App Router)
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
Backend
Firebase
Firestore
Firebase Authentication
Firebase Storage
GIS & Mapping
React Leaflet
Leaflet Draw
Turf.js
Charts & Analytics
Recharts
Deployment
Vercel
🧪 Prototype Methodology

The project follows:

Rapid MVP Prototyping

Focus areas:

UI/UX realism
GIS visualization
realtime interaction
community architecture
scalable system design

The prototype prioritizes:

functionality demonstration
interaction flow
realtime concepts
deployable architecture

Instead of building a fully production-ready infrastructure initially.

🔄 Workflow Methodology
1. Community Creation

Authority:

creates a community
draws geographic boundary
configures alert settings
2. User Registration

User:

signs in
shares location
automatically joins nearest community
3. Wildlife Reporting

Users:

submit sightings
upload images
send emergency reports
4. Alert Broadcasting

System:

filters by geographic zone
broadcasts only to affected community
5. Visualization & Monitoring

Authorities:

monitor hotspot activity
analyze reports
coordinate response
📁 Project Structure
src/
 ├── app/
 │   ├── (public)/
 │   ├── (authority)/
 │   └── api/
 │
 ├── components/
 │   ├── public/
 │   ├── authority/
 │   ├── shared/
 │   ├── map/
 │   └── ui/
 │
 ├── lib/
 ├── hooks/
 ├── services/
 ├── types/
 └── data/
👥 User Roles
1. User

Can:

view alerts
report sightings
access public map
receive localized notifications
2. Community Authority

Can:

create communities
manage geo-fenced zones
broadcast alerts
manage reports
access dashboard analytics
🚨 Why This Project Matters

Wild Alert transforms:

scattered community reports
into:
actionable geographic intelligence

The platform introduces:

structured wildlife monitoring
localized emergency coordination
GIS-based awareness systems
community-centered conservation technology
🔮 Future Directions
AI Wildlife Prediction

Future versions may include:

movement prediction
hotspot forecasting
conflict probability analysis
Offline Communication

Potential integration:

LoRa mesh networking
offline sync systems
low-connectivity support
Drone & Sensor Integration

Future expansion:

thermal drones
wildlife sensors
acoustic monitoring
camera traps
Multilingual Community Support

Future support for:

Malayalam voice alerts
multilingual interfaces
accessibility enhancements
Cross-Community Escalation

Future feature:

automatic adjacent-zone warnings
migration path prediction
corridor intelligence
Government & NGO Integration

Potential collaboration with:

forest departments
panchayats
conservation NGOs
wildlife researchers
🚀 Future Tech Stack Expansion
Potential Additions
Realtime Systems
WebSockets
Firebase Cloud Messaging
AI/ML
TensorFlow Lite
wildlife image recognition
movement prediction models
Advanced GIS
Mapbox
PostGIS
GeoServer
Native Mobile App

Potential migration to:

React Native
or
Flutter
IoT & Sensors

Future integration:

LoRaWAN
GPS collars
wildlife sensors
environmental monitoring devices
🎬 Prototype Goals

This prototype aims to demonstrate:

scalable wildlife intelligence architecture
geo-fenced emergency communication
community-centered conservation systems
realtime GIS monitoring concepts

The focus is:

rapid innovation + practical deployability
🏆 Vision

Wild Alert envisions a future where:

communities receive smarter wildlife alerts
authorities access realtime geographic intelligence
wildlife conflict response becomes faster and more organized
technology supports safer coexistence between humans and wildlife
📌 Status

Current Status:

Prototype / Hackathon MVP

Focus:

UI/UX
GIS workflows
community architecture
realtime interaction concepts
scalable system design
👨‍💻 Built With
Next.js
Firebase
React Leaflet
Tailwind CSS
Framer Motion
TypeScript
🌿 Final Statement

Wild Alert is more than an alert application.

It is a:

Geo-Fenced Community Wildlife Intelligence Network

designed to transform community observations into structured, localized, realtime environmental intelligence.
we are using this plan also in this project (heat sensor) , this data pass to authority and they alert the communtiy
## Hybrid Sensor Detection Technology

Our system uses a hybrid sensing architecture combining the **HC-SR501 PIR sensor** and the **HLK-LD2450 mmWave radar sensor** for wildlife movement detection.

The PIR sensor acts as a low-power trigger layer that continuously monitors motion based on infrared changes. When movement is detected, the ESP32 activates the mmWave radar module for intelligent confirmation and tracking.

The HLK-LD2450 radar provides:

* Multi-target detection
* Movement tracking
* Distance estimation
* Direction analysis

This hybrid approach reduces false positives caused by environmental disturbances such as moving leaves, rain, or temperature fluctuations while maintaining low power consumption suitable for remote forest deployments.

Unlike camera or thermal-based systems, the radar-based architecture performs reliably in:

* Darkness
* Fog
* Rain
* Dense forest environments

The system is designed for corridor-focused deployment near:

* Forest borders
* Wildlife entry paths
* Farms
* Human settlement boundaries

Each sensor node operates independently using:

* ESP32 edge processing
* Solar-powered energy supply
* Local buffering for offline operation
* LoRa/Wi-Fi communication for alert transmission

This architecture provides a scalable and cost-effective solution for real-time wildlife intrusion monitoring and early warning systems.