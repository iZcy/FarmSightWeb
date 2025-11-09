import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Save, Trash2, Navigation } from 'lucide-react';
import { useFarms } from '../hooks/useFarms';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  Toast,
} from '../components/common';
import { BoundaryDrawMap } from '../components/maps';
import { reverseGeocode, getCurrentLocation } from '../utils/geocoding';

export const AddFarm: React.FC = () => {
  const navigate = useNavigate();
  const { addFarm } = useFarms();
  const { toasts, success, error, removeToast } = useToast();
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [boundary, setBoundary] = useState<Array<{ lat: number; lng: number }>>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: '',
    cropType: '',
  });

  // Load user's current location on mount
  useEffect(() => {
    const loadCurrentLocation = async () => {
      setIsLoadingLocation(true);
      const location = await getCurrentLocation();
      if (!location.error) {
        setCenterLocation({ lat: location.lat, lng: location.lng });
      }
      setIsLoadingLocation(false);
    };

    loadCurrentLocation();
  }, []);

  // Auto-fill address when boundary is drawn
  useEffect(() => {
    const fetchAddress = async () => {
      if (boundary.length > 0 && !formData.address) {
        setIsLoadingAddress(true);
        // Calculate center of boundary polygon
        const centerLat = boundary.reduce((sum, p) => sum + p.lat, 0) / boundary.length;
        const centerLng = boundary.reduce((sum, p) => sum + p.lng, 0) / boundary.length;

        const result = await reverseGeocode(centerLat, centerLng);
        if (result.address) {
          setFormData((prev) => ({ ...prev, address: result.address }));
        }
        setIsLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [boundary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (boundary.length < 3) {
      error('Please draw a farm boundary with at least 3 points');
      return;
    }

    // Calculate center point
    const centerLat = boundary.reduce((sum, p) => sum + p.lat, 0) / boundary.length;
    const centerLng = boundary.reduce((sum, p) => sum + p.lng, 0) / boundary.length;

    const result = addFarm({
      name: formData.name,
      location: {
        lat: centerLat,
        lng: centerLng,
        address: formData.address,
      },
      area: parseFloat(formData.area),
      cropType: formData.cropType,
      boundary: boundary,
    });

    if (result.success) {
      success('Farm added successfully!');
      setTimeout(() => navigate('/farms'), 1000);
    } else {
      error(result.error || 'Failed to add farm');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearBoundary = () => {
    setBoundary([]);
  };

  const handleUseMyLocation = async () => {
    setIsLoadingLocation(true);
    const location = await getCurrentLocation();
    if (location.error) {
      error(location.error);
    } else {
      setCenterLocation({ lat: location.lat, lng: location.lng });
      success('Location updated!');
    }
    setIsLoadingLocation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/farms')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farms
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Farm</h1>
          <p className="text-gray-600">Draw your farm boundary and enter details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Farm Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Name */}
              <Input
                label="Farm Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Northeast Rice Base"
                required
              />

              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Crop Type</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Peanut">Peanut</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Tea">Tea</option>
                  <option value="Vegetables">Vegetables</option>
                </select>
              </div>

              {/* Area */}
              <Input
                label="Area (hectares)"
                name="area"
                type="number"
                step="0.1"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g., 25.5"
                required
              />

              {/* Boundary Drawing Map */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Farm Boundary <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseMyLocation}
                      disabled={isLoadingLocation}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {isLoadingLocation ? 'Loading...' : 'Use My Location'}
                    </Button>
                    {boundary.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearBoundary}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <BoundaryDrawMap
                  centerLocation={centerLocation}
                  boundary={boundary}
                  onBoundaryChange={setBoundary}
                  height="500px"
                />

                {boundary.length > 0 && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{boundary.length} points</strong> added to boundary
                      {boundary.length >= 3 && ' - Polygon completed!'}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Click on the map to add boundary points. Need at least 3 points to form a polygon.
                </p>
              </div>

              {/* Address */}
              <div>
                <Input
                  label="Address (optional)"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address will be auto-filled..."
                  disabled={isLoadingAddress}
                />
                {isLoadingAddress && (
                  <p className="text-xs text-gray-500 mt-1">Fetching address...</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/farms')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={boundary.length < 3}>
                  <Save className="w-5 h-5 mr-2" />
                  Add Farm
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to Draw Your Farm Boundary</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Click "Use My Location" to center the map on your current position</li>
            <li>• Zoom and pan the map to find your farm location</li>
            <li>• Click on the map to add points around your farm's perimeter</li>
            <li>• Add at least 3 points to create a valid boundary</li>
            <li>• The address will be automatically filled from the location</li>
            <li>• Click "Clear" to start over if you make a mistake</li>
          </ul>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};
