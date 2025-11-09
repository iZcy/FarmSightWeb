import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFarms } from '../hooks/useFarms';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  LoadingState,
  EmptyState,
  StressBadge,
} from '../components/common';
import { MultiFarmMap } from '../components/maps/FarmMap';
import { getFarmHealth } from '../services/farms';

export const FarmListSimple: React.FC = () => {
  const { farms, isLoading } = useFarms();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading farms..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Farms</h1>
            <p className="text-gray-600">Manage and monitor all your farms</p>
          </div>
          <Link to="/farms/new">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add Farm
            </Button>
          </Link>
        </div>

        {farms.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No farms yet"
            description="Get started by adding your first farm to begin monitoring crop health"
            action={{
              label: "Add Your First Farm",
              onClick: () => window.location.href = '/farms/new'
            }}
          />
        ) : (
          <>
            {/* Map View */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Farm Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <MultiFarmMap farms={farms} height="500px" />
              </CardContent>
            </Card>

            {/* Farm Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => {
                const health = getFarmHealth(farm.id);
                const trendIcon =
                  health?.trend === 'improving' ? (
                    <TrendingUp className="w-4 h-4 text-success-600" />
                  ) : health?.trend === 'declining' ? (
                    <TrendingDown className="w-4 h-4 text-danger-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-600" />
                  );

                return (
                  <Link key={farm.id} to={`/farms/${farm.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{farm.name}</CardTitle>
                            <p className="text-sm text-gray-600">{farm.cropType}</p>
                          </div>
                          {health && <StressBadge type={health.stressLevel} />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {farm.area} hectares
                          </div>

                          {health && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current NDVI</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {health.currentNDVI.toFixed(3)}
                                  </span>
                                  {trendIcon}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-500">
                                  {health.alerts.filter((a) => !a.isRead).length} active alerts
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
