import React from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react';
import {
  farmsAtom,
  farmHealthAtom,
  selectedFarmIdAtom,
} from '../store/atoms';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  StressBadge,
} from '../components/common';
import { MultiFarmMap } from '../components/maps';

export const FarmList: React.FC = () => {
  const [farms] = useAtom(farmsAtom);
  const [farmHealth] = useAtom(farmHealthAtom);
  const [, setSelectedFarmId] = useAtom(selectedFarmIdAtom);

  const handleFarmClick = (farmId: string) => {
    setSelectedFarmId(farmId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Farms</h1>
            <p className="text-gray-600">Manage and monitor all your farms</p>
          </div>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Farm
          </Button>
        </div>

        {/* Map View */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Farm Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiFarmMap farms={farms} height="500px" onFarmClick={handleFarmClick} />
          </CardContent>
        </Card>

        {/* Farm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => {
            const health = farmHealth.find(h => h.farmId === farm.id);
            if (!health) return null;

            return (
              <Link key={farm.id} to={`/farms/${farm.id}`}>
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {farm.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {farm.location.address}
                        </p>
                      </div>
                      <StressBadge type={health.stressLevel} />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Crop Type:</span>
                        <span className="font-medium text-gray-900">{farm.cropType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium text-gray-900">{farm.area} ha</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current NDVI:</span>
                        <span className="font-medium text-gray-900">
                          {health.currentNDVI.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trend:</span>
                        <div className="flex items-center text-sm">
                          {health.trend === 'improving' && (
                            <div className="flex items-center text-success-600 font-medium">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span>Improving</span>
                            </div>
                          )}
                          {health.trend === 'declining' && (
                            <div className="flex items-center text-danger-600 font-medium">
                              <TrendingDown className="w-4 h-4 mr-1" />
                              <span>Declining</span>
                            </div>
                          )}
                          {health.trend === 'stable' && (
                            <span className="text-gray-600 font-medium">Stable</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {health.alerts.length > 0 && (
                      <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                        <p className="text-sm text-warning-800">
                          {health.alerts.length} active alert{health.alerts.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
