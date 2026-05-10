import { WildlifeReport, Village, Alert, Ranger, Corridor } from "@/types";

export const MOCK_REPORTS: WildlifeReport[] = [
  {
    id: "1",
    animalType: "Elephant",
    location: { lat: 10.8505, lng: 76.2711, name: "Palakkad Gap" },
    severity: "high",
    status: "verified",
    reportedBy: "Ranger Somu",
    timestamp: new Date(),
    description: "Herd of 5 elephants spotted near forest edge."
  },
  {
    id: "2",
    animalType: "Tiger",
    location: { lat: 11.605, lng: 76.083, name: "Wayanad Wildlife Sanctuary" },
    severity: "critical",
    status: "pending",
    reportedBy: "Local Villager",
    timestamp: new Date(),
    description: "Tiger seen near cattle grazing area."
  },
  {
    id: "3",
    animalType: "Leopard",
    location: { lat: 9.498, lng: 77.162, name: "Periyar" },
    severity: "medium",
    status: "resolved",
    reportedBy: "CCTV",
    timestamp: new Date(),
    description: "Leopard crossing the main road."
  }
];

export const MOCK_VILLAGES: Village[] = [
  {
    id: "v1",
    name: "Attappady",
    location: { lat: 11.05, lng: 76.58 },
    population: 1200,
    riskLevel: "high"
  },
  {
    id: "v2",
    name: "Munnar",
    location: { lat: 10.0889, lng: 77.0595 },
    population: 3500,
    riskLevel: "medium"
  },
  {
    id: "v3",
    name: "Idukki",
    location: { lat: 9.8497, lng: 76.982 },
    population: 5000,
    riskLevel: "low"
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Elephant Intrusion",
    message: "Herd moving towards Attappady village sector 4.",
    type: "danger",
    timestamp: new Date(),
    villageId: "v1"
  },
  {
    id: "a2",
    title: "Forest Fire Warning",
    message: "High temperature detected in Wayanad zone.",
    type: "warning",
    timestamp: new Date()
  }
];

export const MOCK_RANGERS: Ranger[] = [
  {
    id: "r1",
    name: "Captain Rahul",
    rank: "Senior Ranger",
    status: "active",
    location: { lat: 10.85, lng: 76.27 },
    lastActive: new Date()
  },
  {
    id: "r2",
    name: "Officer Meera",
    rank: "Field Officer",
    status: "on-duty",
    location: { lat: 11.6, lng: 76.08 },
    lastActive: new Date()
  }
];

export const MOCK_CORRIDORS: Corridor[] = [
  {
    id: "c1",
    name: "Wayanad-Nilgiri Corridor",
    path: [
      { lat: 11.6, lng: 76.1 },
      { lat: 11.5, lng: 76.3 },
      { lat: 11.4, lng: 76.5 }
    ],
    animalTypes: ["Elephant", "Tiger"],
    riskIndex: 85
  }
];
