import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
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

export const AddFarm: React.FC = () => {
  const navigate = useNavigate();
  const { addFarm } = useFarms();
  const { toasts, success, error, removeToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    area: '',
    cropType: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = addFarm({
      name: formData.name,
      location: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        address: formData.address,
      },
      area: parseFloat(formData.area),
      cropType: formData.cropType,
      boundary: [
        { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
        { lat: parseFloat(formData.lat) + 0.002, lng: parseFloat(formData.lng) + 0.002 },
        { lat: parseFloat(formData.lat) + 0.002, lng: parseFloat(formData.lng) - 0.002 },
        { lat: parseFloat(formData.lat) - 0.002, lng: parseFloat(formData.lng) + 0.002 },
      ],
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <p className="text-gray-600">Enter your farm details to start monitoring</p>
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
                placeholder="e.g., Sawah Indramayu"
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
                  <option value="">Select Crop Type / 选择作物类型</option>
                  <option value="水稻 (Rice)">水稻 (Rice)</option>
                  <option value="小麦 (Wheat)">小麦 (Wheat)</option>
                  <option value="玉米 (Corn)">玉米 (Corn)</option>
                  <option value="棉花 (Cotton)">棉花 (Cotton)</option>
                  <option value="大豆 (Soybean)">大豆 (Soybean)</option>
                  <option value="花生 (Peanut)">花生 (Peanut)</option>
                  <option value="甘蔗 (Sugarcane)">甘蔗 (Sugarcane)</option>
                  <option value="茶叶 (Tea)">茶叶 (Tea)</option>
                  <option value="蔬菜 (Vegetables)">蔬菜 (Vegetables)</option>
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

              {/* Address */}
              <Input
                label="Address / 地址"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 河南省郑州市中牟县, Henan Province, China"
                required
              />

              {/* Location Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitude / 纬度"
                  name="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="e.g., 34.7466"
                  required
                />
                <Input
                  label="Longitude / 经度"
                  name="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="e.g., 113.6253"
                  required
                />
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800">
                  <strong>Tip:</strong> You can find coordinates using Google Maps. Right-click on your farm location and select "What's here?" to get the latitude and longitude.
                </p>
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
                <Button type="submit">
                  <Save className="w-5 h-5 mr-2" />
                  Add Farm
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Make sure to enter accurate coordinates for precise monitoring</li>
            <li>• Farm area should be in hectares (1 hectare = 10,000 m²)</li>
            <li>• You can edit farm details later from the farm details page</li>
            <li>• NDVI monitoring will start automatically after adding the farm</li>
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
