import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  Globe,
  Save,
} from 'lucide-react';
import {
  userAtom,
  userSettingsAtom,
} from '../store/atoms';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
  Badge,
} from '../components/common';

export const Profile: React.FC = () => {
  const [user] = useAtom(userAtom);
  const [settings, setSettings] = useAtom(userSettingsAtom);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleNotificationChange = (type: 'email' | 'sms' | 'push', value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: value,
      },
    });
  };

  const handleThresholdChange = (type: 'ndviDrop' | 'confidenceMin', value: number) => {
    setSettings({
      ...settings,
      alertThresholds: {
        ...settings.alertThresholds,
        [type]: value,
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <Badge variant="info" className="mb-4">{user.role}</Badge>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {user.phone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    defaultValue={user.name}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    defaultValue={user.email}
                    placeholder="john@example.com"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    defaultValue={user.phone}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive alerts via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive alerts via text message</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Alert Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NDVI Drop Threshold
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0.05"
                        max="0.30"
                        step="0.05"
                        value={settings.alertThresholds.ndviDrop}
                        onChange={(e) => handleThresholdChange('ndviDrop', parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {settings.alertThresholds.ndviDrop.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Alert when NDVI drops by this amount
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Confidence Level
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={settings.alertThresholds.confidenceMin}
                        onChange={(e) => handleThresholdChange('confidenceMin', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {settings.alertThresholds.confidenceMin}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Only show alerts above this confidence level
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-end space-x-4">
              {saved && (
                <span className="text-sm text-success-600 font-medium">
                  Settings saved successfully!
                </span>
              )}
              <Button onClick={handleSaveSettings} size="lg">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
