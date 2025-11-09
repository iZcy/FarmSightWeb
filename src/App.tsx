import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { LoadingOverlay } from './components/common/Loading';
import {
  Landing,
  Login,
  Dashboard,
  FarmDetails,
  AddFarm,
  EducationHub,
  Profile,
} from './pages';
import { FarmListSimple } from './pages/FarmListSimple';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useDatabase();

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isInitialized } = useDatabase();

  if (!isInitialized) {
    return <LoadingOverlay />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms"
        element={
          <ProtectedRoute>
            <FarmListSimple />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/new"
        element={
          <ProtectedRoute>
            <AddFarm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/:id"
        element={
          <ProtectedRoute>
            <FarmDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/education"
        element={
          <ProtectedRoute>
            <EducationHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;
