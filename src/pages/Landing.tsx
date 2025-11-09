import React from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  TrendingUp,
  Bell,
  Video,
  CheckCircle,
  ArrowRight,
  Sprout,
} from 'lucide-react';
import { Button } from '../components/common';

export const Landing: React.FC = () => {
  const features = [
    {
      icon: <Satellite className="w-6 h-6" />,
      title: 'Satellite Monitoring',
      description: 'Real-time crop health analysis using advanced satellite imagery and NDVI data.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Early Detection',
      description: 'Detect crop stress up to 7 days before visible symptoms appear.',
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Smart Alerts',
      description: 'Receive instant notifications about potential issues affecting your crops.',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Educational Content',
      description: 'Access curated videos and guides for better farm management.',
    },
  ];

  const benefits = [
    'Monitor multiple farms from a single dashboard',
    'AI-powered crop stress classification',
    '7-30 day NDVI forecasting',
    'Personalized recommendations',
    'Weather integration',
    'Mobile and web access',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-success-600 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FarmSight</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Protect Your Crops with
            <span className="text-success-600"> AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Detect crop stress early using satellite imagery and machine learning.
            Get actionable alerts before problems become visible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Start Monitoring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">7 Days</div>
            <div className="text-gray-600">Early Stress Detection</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Detection Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Continuous Monitoring</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to monitor crop health and make informed decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose FarmSight?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines cutting-edge technology with practical farming insights
                to help you maximize yields and minimize losses.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-success-50 to-primary-50 p-8 rounded-2xl">
              <img
                src="https://picsum.photos/seed/satellite/600/400"
                alt="Satellite monitoring"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-success-600 to-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of farmers using AI to protect their crops
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary-600 hover:bg-gray-50 border-white"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-success-600 p-2 rounded-lg">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">FarmSight</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered crop stress detection for modern agriculture
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2024 FarmSight. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
