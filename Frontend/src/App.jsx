import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ClaimStatus from './pages/ClaimStatus';
import About from './pages/About';
import Contact from './pages/Contact';
import VehicleInsurance from './pages/VehicleInsurance';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminClaimsList from './pages/Admin/AdminClaimsList';
import AdminClaimDetails from './pages/Admin/AdminClaimDetails';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPolicy from './pages/Admin/AdminPolicy';
import Maintenance from './pages/Maintenance';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired, userRole }) => {
  const location = useLocation();
  if (!userRole) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" replace />;
  return children;
};

// Inner component – can use useLocation() inside Router context
function AppContent({ user, darkMode, toggleDarkMode, isSiteDown, toggleSiteStatus, handleLogin, handleLogout }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const userRole = user?.role;

  return (
    <div className="app-container min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0f0e16' }}>
      {isSiteDown && (
        <div className="bg-danger text-white py-2 text-center fw-bold shadow-sm sticky-top" style={{ zIndex: 1100 }}>
          Site is currently under maintenance
        </div>
      )}
      <MyNavbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<div className="user-app-scope"><Home /></div>} />
          <Route path="/dashboard" element={
            <ProtectedRoute roleRequired="user" userRole={userRole}>
              <div className="user-app-scope"><Dashboard user={user} /></div>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<div className="user-app-scope"><Login onLogin={handleLogin} isSiteDown={isSiteDown} /></div>} />
          <Route path="/claim-status" element={<div className="user-app-scope"><ClaimStatus /></div>} />
          <Route path="/about" element={<div className="user-app-scope"><About /></div>} />
          <Route path="/contact" element={<div className="user-app-scope"><Contact /></div>} />
          <Route path="/vehicle-insurance" element={<div className="user-app-scope"><VehicleInsurance user={user} /></div>} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminDashboard isSiteDown={isSiteDown} toggleSiteStatus={toggleSiteStatus} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/claims" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminClaimsList onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/claims/:id" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminClaimDetails onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminUsers onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/policies" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminPolicy onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Footer — hidden on all /admin/* routes */}
      {!isAdminRoute && (
        <footer className="py-5 mt-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
                <h5 className="fw-bold mb-3 text-primary">SafeDrive</h5>
                <p className="opacity-75 text-white">Your trusted partner for vehicle protection and peace of mind on the road.</p>
              </div>
              <div className="col-md-2 mb-4 mb-md-0">
                <h6 className="fw-bold mb-3 text-white">Links</h6>
                <ul className="list-unstyled opacity-75">
                  <li className="mb-2 text-white"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                  <li className="mb-2 text-white"><Link to="/about" className="text-white text-decoration-none">About</Link></li>
                  <li className="mb-2 text-white">
                    <button className="text-white text-decoration-none bg-transparent border-0 p-0"
                      onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                      Pricing
                    </button>
                  </li>
                </ul>
              </div>
              <div className="col-md-3 mb-4 mb-md-0">
                <h6 className="fw-bold mb-3 text-white">Support</h6>
                <ul className="list-unstyled opacity-75">
                  <li className="mb-2 text-white"><Link to="/contact" className="text-white text-decoration-none">Help Center</Link></li>
                  <li className="mb-2 text-white"><Link to="/about" className="text-white text-decoration-none">Privacy Policy</Link></li>
                  <li className="mb-2 text-white"><Link to="/about" className="text-white text-decoration-none">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold mb-3 text-white">Newsletter</h6>
                <div className="input-group">
                  <input type="email" className="form-control rounded-start-pill border-0" placeholder="Email" id="newsletter-email" />
                  <button className="btn btn-primary rounded-end-pill px-3"
                    onClick={() => {
                      const email = document.getElementById('newsletter-email').value;
                      if (email) {
                        alert(`Thanks for joining! We've sent a welcome email to ${email}`);
                        document.getElementById('newsletter-email').value = '';
                      } else {
                        alert('Please enter your email address.');
                      }
                    }}>
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isSiteDown, setIsSiteDown] = useState(() => localStorage.getItem('siteDown') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => { localStorage.setItem('siteDown', isSiteDown); }, [isSiteDown]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSiteStatus = () => setIsSiteDown(!isSiteDown);
  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <AppContent
        user={user}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isSiteDown={isSiteDown}
        toggleSiteStatus={toggleSiteStatus}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

export default App;
