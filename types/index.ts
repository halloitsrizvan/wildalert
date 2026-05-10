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
  communityId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export type UserRole = 'user' | 'community_authority';

export interface Community {
  id: string;
  name: string;
  district: string;
  description: string;
  polygonCoordinates: any; // GeoJSON Polygon
  createdBy: string;
  createdAt: any;
  admins: string[];
  memberCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  activeAlerts: number;
  villages: string[];
  notificationSettings: {
    sms: boolean;
    push: boolean;
    emergencyOnly: boolean;
  };
}

export interface CommunityMember {
  userId: string;
  communityId: string;
  joinedAt: any;
  location: {
    lat: number;
    lng: number;
  };
  role: UserRole;
  alertPreferences: {
    radius: number; // km
    animalTypes: string[];
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
