import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, UserPlus, Leaf } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Button, Input, Card, CardContent } from '../components/common';

export const Login: React.FC = () => {
  const { isAuthenticated, login, register } = useDatabase();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isLoginMode) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password, formData.phone);
      }

      if (!result.success) {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FarmSight AI</h1>
          <p className="text-gray-600">Intelligent Crop Stress Detection</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={isLoginMode ? 'primary' : 'outline'}
                onClick={() => {
                  setIsLoginMode(true);
                  setError('');
                }}
                className="flex-1"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                variant={!isLoginMode ? 'primary' : 'outline'}
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                }}
                className="flex-1"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <Input
                  label="Full Name / 姓名"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., 李明 (Li Ming)"
                  required
                />
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., liming@farmsight.cn"
                required
              />

              <Input
                label="Password / 密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              {!isLoginMode && (
                <Input
                  label="Phone / 电话 (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +86 138-0013-8000"
                />
              )}

              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                  <p className="text-sm text-danger-800">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span>Loading...</span>
                ) : isLoginMode ? (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Login to Dashboard
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {isLoginMode && (
              <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800 mb-2">
                  <strong>Demo Account:</strong>
                </p>
                <p className="text-sm text-primary-700">
                  Email: <code className="bg-white px-2 py-1 rounded">liming@farmsight.cn</code>
                </p>
                <p className="text-sm text-primary-700">
                  Password: <code className="bg-white px-2 py-1 rounded">demo123</code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
