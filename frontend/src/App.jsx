import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import BudgetSetup from './pages/BudgetSetup';
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Calendar from './pages/Calendar';
import Calculator from './pages/Calculator';
import Wishlist from './pages/Wishlist';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#00d4ff'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/startpage" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/startpage" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/budget-setup" element={
            <ProtectedRoute>
              <BudgetSetup />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/startpage" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
