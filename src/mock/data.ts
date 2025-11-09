import type {
  User,
  Farm,
  StressAlert,
  FarmHealth,
  Video,
  VideoCategory,
  WeatherData,
  UserSettings,
  NDVIData
} from '../types';

// Mock User
export const mockUser: User = {
  id: '1',
  name: 'Li Ming',
  email: 'liming@farmsight.cn',
  phone: '+86 138-0013-8000',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMing',
  role: 'farmer',
  createdAt: new Date('2024-01-15'),
};

// Mock Farms - Real Chinese Agricultural Centers with Actual Coordinates
export const mockFarms: Farm[] = [
  {
    id: 'farm-1',
    userId: '1',
    name: 'Northeast Rice Base',
    location: {
      lat: 45.7565,
      lng: 126.6426,
      address: '黑龙江省哈尔滨市五常市, Heilongjiang Province, China',
    },
    area: 125.5,
    cropType: 'Rice',
    boundary: [
      { lat: 45.7565, lng: 126.6426 },
      { lat: 45.7585, lng: 126.6446 },
      { lat: 45.7565, lng: 126.6466 },
      { lat: 45.7545, lng: 126.6446 },
    ],
    createdAt: new Date('2024-01-20'),
    lastUpdated: new Date(),
  },
  {
    id: 'farm-2',
    userId: '1',
    name: 'Henan Wheat Farm',
    location: {
      lat: 34.7466,
      lng: 113.6253,
      address: '河南省郑州市中牟县, Henan Province, China',
    },
    area: 88.3,
    cropType: 'Wheat',
    boundary: [
      { lat: 34.7466, lng: 113.6253 },
      { lat: 34.7486, lng: 113.6273 },
      { lat: 34.7466, lng: 113.6293 },
      { lat: 34.7446, lng: 113.6273 },
    ],
    createdAt: new Date('2024-02-10'),
    lastUpdated: new Date(),
  },
  {
    id: 'farm-3',
    userId: '1',
    name: 'Xinjiang Cotton Plantation',
    location: {
      lat: 44.3061,
      lng: 86.0571,
      address: '新疆维吾尔自治区乌鲁木齐市, Xinjiang Uyghur Autonomous Region, China',
    },
    area: 156.8,
    cropType: 'Cotton',
    boundary: [
      { lat: 44.3061, lng: 86.0571 },
      { lat: 44.3081, lng: 86.0591 },
      { lat: 44.3061, lng: 86.0611 },
      { lat: 44.3041, lng: 86.0591 },
    ],
    createdAt: new Date('2023-11-05'),
    lastUpdated: new Date(),
  },
];

// Generate NDVI history data
const generateNDVIHistory = (days: number, baseValue: number, trend: 'improving' | 'stable' | 'declining'): NDVIData[] => {
  const data: NDVIData[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    let value = baseValue;
    if (trend === 'improving') {
      value += (days - i) * 0.005;
    } else if (trend === 'declining') {
      value -= (days - i) * 0.008;
    }

    // Add some randomness
    value += (Math.random() - 0.5) * 0.05;
    value = Math.max(0, Math.min(1, value));

    data.push({
      date,
      value: parseFloat(value.toFixed(3)),
      confidence: 85 + Math.random() * 10,
    });
  }

  return data;
};

// Generate forecast data
const generateForecast = (lastValue: number, days: number): NDVIData[] => {
  const data: NDVIData[] = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const value = lastValue - i * 0.01 + (Math.random() - 0.5) * 0.03;

    data.push({
      date,
      value: Math.max(0, Math.min(1, parseFloat(value.toFixed(3)))),
      confidence: 75 - i * 2,
    });
  }

  return data;
};

// Mock Alerts
export const mockAlerts: StressAlert[] = [
  {
    id: 'alert-1',
    farmId: 'farm-1',
    type: 'drought',
    severity: 'high',
    confidence: 87,
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message: 'Drought stress detected in Northeast Rice Base',
    recommendation: 'Increase irrigation frequency. Deep watering recommended in morning hours.',
    isRead: false,
  },
  {
    id: 'alert-2',
    farmId: 'farm-2',
    type: 'nutrient',
    severity: 'medium',
    confidence: 72,
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    message: 'Nutrient deficiency detected in Henan Wheat Farm',
    recommendation: 'Apply nitrogen-rich fertilizer (Urea/NPK). Test soil pH levels.',
    isRead: false,
  },
  {
    id: 'alert-3',
    farmId: 'farm-1',
    type: 'pest',
    severity: 'critical',
    confidence: 92,
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    message: 'Pest infestation detected in Northeast Rice Base',
    recommendation: 'Immediate action required. Consider organic pesticide application.',
    isRead: true,
  },
  {
    id: 'alert-4',
    farmId: 'farm-3',
    type: 'healthy',
    severity: 'low',
    confidence: 95,
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    message: 'Xinjiang Cotton Plantation showing healthy growth',
    recommendation: 'Continue current irrigation and fertilization schedule.',
    isRead: true,
  },
];

// Mock Farm Health Data
export const mockFarmHealth: FarmHealth[] = mockFarms.map((farm, index) => {
  const trends: ('improving' | 'stable' | 'declining')[] = ['declining', 'stable', 'improving'];
  const baseValues = [0.65, 0.75, 0.82];
  const stressTypes: ('drought' | 'nutrient' | 'healthy')[] = ['drought', 'nutrient', 'healthy'];

  const trend = trends[index];
  const baseValue = baseValues[index];
  const ndviHistory = generateNDVIHistory(30, baseValue, trend);
  const lastNDVI = ndviHistory[ndviHistory.length - 1].value;

  return {
    farmId: farm.id,
    currentNDVI: lastNDVI,
    avgNDVI: ndviHistory.reduce((sum, d) => sum + d.value, 0) / ndviHistory.length,
    stressLevel: stressTypes[index],
    trend,
    ndviHistory,
    forecast: generateForecast(lastNDVI, 7),
    alerts: mockAlerts.filter(alert => alert.farmId === farm.id),
  };
});

// Mock Video Categories
export const mockVideoCategories: VideoCategory[] = [
  {
    id: 'cat-1',
    name: 'Drought Management',
    description: 'Learn effective strategies for managing drought conditions',
    videoCount: 12,
    icon: 'droplet',
  },
  {
    id: 'cat-2',
    name: 'Pest Control',
    description: 'Identify and control common agricultural pests',
    videoCount: 18,
    icon: 'bug',
  },
  {
    id: 'cat-3',
    name: 'Soil Health',
    description: 'Maintain optimal soil nutrition and health',
    videoCount: 15,
    icon: 'leaf',
  },
  {
    id: 'cat-4',
    name: 'Irrigation Techniques',
    description: 'Modern irrigation methods and best practices',
    videoCount: 10,
    icon: 'droplets',
  },
  {
    id: 'cat-5',
    name: 'Crop Management',
    description: 'General crop care and management tips',
    videoCount: 20,
    icon: 'sprout',
  },
];

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: 'vid-1',
    title: 'Drought-Resistant Farming Techniques',
    description: 'Learn how to maintain healthy crops during drought conditions using modern techniques and traditional wisdom.',
    thumbnail: 'https://picsum.photos/seed/farm1/400/225',
    duration: '12:34',
    category: 'Drought Management',
    views: 1234,
    uploadDate: new Date('2024-10-15'),
    url: '#',
    relevantFor: ['drought'],
  },
  {
    id: 'vid-2',
    title: 'Identifying Common Crop Pests',
    description: 'A comprehensive guide to identifying and managing the most common pests affecting your crops.',
    thumbnail: 'https://picsum.photos/seed/farm2/400/225',
    duration: '18:45',
    category: 'Pest Control',
    views: 2156,
    uploadDate: new Date('2024-10-20'),
    url: '#',
    relevantFor: ['pest'],
  },
  {
    id: 'vid-3',
    title: 'Soil Testing and Nutrient Management',
    description: 'Understanding soil composition and how to correct nutrient deficiencies for optimal crop growth.',
    thumbnail: 'https://picsum.photos/seed/farm3/400/225',
    duration: '15:20',
    category: 'Soil Health',
    views: 987,
    uploadDate: new Date('2024-10-25'),
    url: '#',
    relevantFor: ['nutrient'],
  },
  {
    id: 'vid-4',
    title: 'Modern Drip Irrigation Setup',
    description: 'Step-by-step guide to setting up an efficient drip irrigation system for your farm.',
    thumbnail: 'https://picsum.photos/seed/farm4/400/225',
    duration: '22:10',
    category: 'Irrigation Techniques',
    views: 3421,
    uploadDate: new Date('2024-11-01'),
    url: '#',
    relevantFor: ['drought'],
  },
  {
    id: 'vid-5',
    title: 'Organic Pest Control Methods',
    description: 'Eco-friendly approaches to managing pests without harmful chemicals.',
    thumbnail: 'https://picsum.photos/seed/farm5/400/225',
    duration: '14:55',
    category: 'Pest Control',
    views: 1876,
    uploadDate: new Date('2024-11-05'),
    url: '#',
    relevantFor: ['pest'],
  },
  {
    id: 'vid-6',
    title: 'Crop Rotation Best Practices',
    description: 'Maximize soil health and crop yields through effective rotation strategies.',
    thumbnail: 'https://picsum.photos/seed/farm6/400/225',
    duration: '16:30',
    category: 'Crop Management',
    views: 2543,
    uploadDate: new Date('2024-11-08'),
    url: '#',
  },
];

// Mock Weather Data
export const mockWeather: WeatherData = {
  temperature: 72,
  humidity: 65,
  precipitation: 0,
  windSpeed: 8,
  condition: 'Partly Cloudy',
  forecast: [
    { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), temp: 75, condition: 'Sunny' },
    { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), temp: 73, condition: 'Cloudy' },
    { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), temp: 68, condition: 'Rainy' },
    { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), temp: 70, condition: 'Partly Cloudy' },
    { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), temp: 74, condition: 'Sunny' },
  ],
};

// Mock User Settings
export const mockUserSettings: UserSettings = {
  notifications: {
    email: true,
    sms: true,
    push: true,
  },
  alertThresholds: {
    ndviDrop: 0.15,
    confidenceMin: 70,
  },
  language: 'en',
  timezone: 'America/Los_Angeles',
};
