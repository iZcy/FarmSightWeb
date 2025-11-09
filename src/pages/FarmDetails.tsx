import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useFarms, useFarmHealth } from '../hooks/useFarms';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StressBadge,
  SeverityBadge,
  Button,
  LoadingState,
} from '../components/common';
import { FarmMap } from '../components/maps';
import { NDVIChart } from '../components/charts';

export const FarmDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFarm } = useFarms();
  const { health, isLoading: healthLoading } = useFarmHealth(id || null);
  const [showForecast, setShowForecast] = useState(true);

  const farm = getFarm(id || '');

  if (healthLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading farm details..." />
      </div>
    );
  }

  if (!farm || !health) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Farm not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/farms"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farms
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
                <StressBadge type={health.stressLevel} />
              </div>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {farm.location.address}
              </p>
            </div>
            <Button variant="outline">
              Edit Farm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Farm Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Current NDVI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {health.currentNDVI.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg: {health.avgNDVI.toFixed(3)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Crop Type</p>
                  <p className="text-2xl font-bold text-gray-900">{farm.cropType}</p>
                  <p className="text-xs text-gray-500 mt-1">{farm.area} hectares</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Health Trend</p>
                  <div className="flex items-center">
                    {health.trend === 'improving' && (
                      <div className="flex items-center text-success-600">
                        <TrendingUp className="w-6 h-6 mr-2" />
                        <span className="text-2xl font-bold">Improving</span>
                      </div>
                    )}
                    {health.trend === 'declining' && (
                      <div className="flex items-center text-danger-600">
                        <TrendingDown className="w-6 h-6 mr-2" />
                        <span className="text-2xl font-bold">Declining</span>
                      </div>
                    )}
                    {health.trend === 'stable' && (
                      <span className="text-2xl font-bold text-gray-900">Stable</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NDVI Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>NDVI Trends & Forecast</CardTitle>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={showForecast}
                        onChange={(e) => setShowForecast(e.target.checked)}
                        className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                      />
                      Show Forecast
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <NDVIChart
                    data={health.ndviHistory}
                    forecast={health.forecast}
                    showForecast={showForecast}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Farm Location</CardTitle>
              </CardHeader>
              <CardContent>
                <FarmMap farm={farm} height="400px" showBoundary />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {health.alerts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No active alerts
                  </p>
                ) : (
                  <div className="space-y-4">
                    {health.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <SeverityBadge severity={alert.severity} />
                          <span className="text-xs text-gray-500">
                            {format(alert.detectedAt, 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {alert.message}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {alert.recommendation}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Confidence: {alert.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Farm Details */}
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium text-gray-900">{farm.area} hectares</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crop Type:</span>
                    <span className="font-medium text-gray-900">{farm.cropType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">
                      {format(farm.createdAt, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">
                      {format(farm.lastUpdated, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-medium text-gray-900">
                      {farm.location.lat.toFixed(4)}, {farm.location.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            {health.stressLevel !== 'healthy' && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to="/education">
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 w-4 h-4" />
                      View Related Content
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
