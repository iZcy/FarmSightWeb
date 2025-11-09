import React from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  farmsAtom,
  farmHealthAtom,
  alertsAtom,
  selectedFarmIdAtom,
} from '../store/atoms';
import { mockWeather } from '../mock/data';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SeverityBadge,
  StressBadge,
  Button,
} from '../components/common';
import { MultiFarmMap } from '../components/maps';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [farms] = useAtom(farmsAtom);
  const [farmHealth] = useAtom(farmHealthAtom);
  const [alerts] = useAtom(alertsAtom);
  const [, setSelectedFarmId] = useAtom(selectedFarmIdAtom);

  // Get recent unread alerts
  const recentAlerts = alerts
    .filter(alert => !alert.isRead)
    .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
    .slice(0, 5);

  // Calculate overall stats
  const totalFarms = farms.length;
  const healthyFarms = farmHealth.filter(h => h.stressLevel === 'healthy').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.isRead).length;

  const handleFarmClick = (farmId: string) => {
    setSelectedFarmId(farmId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor all your farms in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Farms</p>
                  <p className="text-3xl font-bold text-gray-900">{totalFarms}</p>
                  <p className="text-sm text-success-600 mt-1">
                    {healthyFarms} healthy
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">{recentAlerts.length}</p>
                  <p className="text-sm text-danger-600 mt-1">
                    {criticalAlerts} critical
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Weather</p>
                  <p className="text-3xl font-bold text-gray-900">{mockWeather.temperature}°F</p>
                  <p className="text-sm text-gray-600 mt-1">{mockWeather.condition}</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map and Farm Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farm Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiFarmMap farms={farms} height="400px" onFarmClick={handleFarmClick} />
              </CardContent>
            </Card>

            {/* Farm List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Farms</CardTitle>
                  <Link to="/farms">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farms.map((farm) => {
                    const health = farmHealth.find(h => h.farmId === farm.id);
                    if (!health) return null;

                    return (
                      <Link
                        key={farm.id}
                        to={`/farms/${farm.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{farm.name}</h3>
                              <StressBadge type={health.stressLevel} />
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{farm.cropType}</span>
                              <span>•</span>
                              <span>{farm.area} hectares</span>
                              <span>•</span>
                              <span>NDVI: {health.currentNDVI.toFixed(3)}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            {health.trend === 'improving' && (
                              <div className="flex items-center text-success-600">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>Improving</span>
                              </div>
                            )}
                            {health.trend === 'declining' && (
                              <div className="flex items-center text-danger-600">
                                <TrendingDown className="w-4 h-4 mr-1" />
                                <span>Declining</span>
                              </div>
                            )}
                            {health.trend === 'stable' && (
                              <div className="flex items-center text-gray-600">
                                <span>Stable</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Alerts and Weather */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {recentAlerts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No active alerts
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => {
                      const farm = farms.find(f => f.id === alert.farmId);
                      return (
                        <div
                          key={alert.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <SeverityBadge severity={alert.severity} size="sm" />
                            <span className="text-xs text-gray-500">
                              {format(alert.detectedAt, 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {farm?.name}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {alert.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weather Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWeather.forecast.slice(0, 5).map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-600">
                        {format(day.date, 'EEE, MMM dd')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {day.temp}°F
                        </span>
                        <span className="text-xs text-gray-500">{day.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/farms/new">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="mr-2 w-4 h-4" />
                      Add New Farm
                    </Button>
                  </Link>
                  <Link to="/education">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 w-4 h-4" />
                      Browse Education
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
