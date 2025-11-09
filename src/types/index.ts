export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'farmer' | 'admin';
  createdAt: Date;
}

export interface Farm {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  area: number; // in hectares
  cropType: string;
  boundary: Array<{ lat: number; lng: number }>;
  createdAt: Date;
  lastUpdated: Date;
}

export type StressType = 'drought' | 'pest' | 'nutrient' | 'healthy';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface NDVIData {
  date: Date;
  value: number; // 0 to 1
  confidence: number; // percentage
}

export interface StressAlert {
  id: string;
  farmId: string;
  type: StressType;
  severity: AlertSeverity;
  confidence: number;
  detectedAt: Date;
  message: string;
  recommendation: string;
  isRead: boolean;
}

export interface FarmHealth {
  farmId: string;
  currentNDVI: number;
  avgNDVI: number;
  stressLevel: StressType;
  trend: 'improving' | 'stable' | 'declining';
  ndviHistory: NDVIData[];
  forecast: NDVIData[];
  alerts: StressAlert[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: number;
  uploadDate: Date;
  url: string;
  relevantFor?: StressType[];
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  icon: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
  forecast: Array<{
    date: Date;
    temp: number;
    condition: string;
  }>;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  alertThresholds: {
    ndviDrop: number;
    confidenceMin: number;
  };
  language: string;
  timezone: string;
}
