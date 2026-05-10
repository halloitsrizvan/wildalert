export interface WildlifeReport {
  id: string;
  animalType: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'resolved';
  reportedBy: string;
  timestamp: any;
  description?: string;
  imageUrl?: string;
}

export interface Village {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  population: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastIncident?: any;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  timestamp: any;
  villageId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Ranger {
  id: string;
  name: string;
  rank: string;
  status: 'active' | 'on-duty' | 'off-duty';
  location: {
    lat: number;
    lng: number;
  };
  lastActive: any;
}

export interface Corridor {
  id: string;
  name: string;
  path: { lat: number; lng: number }[];
  animalTypes: string[];
  riskIndex: number;
}
