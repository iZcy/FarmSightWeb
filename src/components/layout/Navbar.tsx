import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Sprout,
} from 'lucide-react';
import { mobileMenuOpenAtom } from '../../store/atoms';
import { useDatabase } from '../../context/DatabaseContext';
import { useAlerts } from '../../hooks/useAlerts';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const { user, logout } = useDatabase();
  const { unreadCount } = useAlerts();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-success-600 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FarmSight</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/farms"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Farms
            </Link>
            <Link
              to="/education"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Education
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="py-2">
                    {unreadCount === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowNotifications(false)}
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {unreadCount} active alert{unreadCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to view all alerts
                        </p>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/farms"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Farms
            </Link>
            <Link
              to="/education"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Education
            </Link>
            <hr className="my-2" />
            <Link
              to="/profile"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
