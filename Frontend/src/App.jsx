import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Home from './pages_new/Home';
import { FaArrowUp } from 'react-icons/fa';
import Dashboard from './pages_new/Dashboard';
import Login from './pages_new/Login';
import ClaimStatus from './pages_new/ClaimStatus';
import About from './pages_new/About';
import Contact from './pages_new/Contact';
import VehicleInsurance from './pages_new/VehicleInsurance';
import AdminDashboard from './pages_new/Admin/AdminDashboard';
import AdminClaimsList from './pages_new/Admin/AdminClaimsList';
import AdminClaimDetails from './pages_new/Admin/AdminClaimDetails';
import AdminUsers from './pages_new/Admin/AdminUsers';
import AdminPolicy from './pages_new/Admin/AdminPolicy';
import AdminSettings from './pages_new/Admin/AdminSettings';
import AdminContactUs from './pages_new/Admin/AdminContactUs';
import OfficerDashboard from './pages_new/OfficerDashboard';
import SurveyorDashboard from './pages_new/SurveyorDashboard';
import CursorBubbleEffect from './components/CursorBubbleEffect';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired, userRole }) => {
  const location = useLocation();
  if (!userRole) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" replace />;
  return children;
};

// Inner component – can use useLocation() inside Router context
function AppContent({ user, isSiteDown, toggleSiteStatus, handleLogin, handleLogout }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const userRole = user?.role;
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0f0e16' }}>

      {isSiteDown && (
        <div className="bg-danger text-white py-2 text-center fw-bold shadow-sm sticky-top" style={{ zIndex: 1100 }}>
          Site is currently under maintenance
        </div>
      )}
      <MyNavbar
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

          {/* Officer Routes */}
          <Route path="/officer" element={
            <ProtectedRoute roleRequired="officer" userRole={userRole}>
              <OfficerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />

          {/* Surveyor Routes */}
          <Route path="/surveyor" element={
            <ProtectedRoute roleRequired="surveyor" userRole={userRole}>
              <SurveyorDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />

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
          <Route path="/admin/settings" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminSettings onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin/contact" element={
            <ProtectedRoute roleRequired="admin" userRole={userRole}>
              <AdminContactUs onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Footer — hidden on all /admin/* routes */}
      {!isAdminRoute && (
        <footer className="footer-section py-5 mt-auto">
          <div className="container">
            <div className="row g-4">
              {/* Company Info */}
              <div className="col-lg-4 col-md-6">
                <div className="footer-brand">
                  <h5 className="fw-bold mb-3">
                    <span className="footer-logo-icon me-2">🛡️</span>SafeDrive
                  </h5>
                  <p className="footer-description">Your trusted partner for comprehensive vehicle protection and peace of mind on every journey.</p>
                  <div className="footer-contact mt-4">
                    <div className="contact-item mb-2">
                      <i className="bi bi-telephone me-2"></i>
                      <span>1-800-SAFEDRIVE</span>
                    </div>
                    <div className="contact-item mb-2">
                      <i className="bi bi-envelope me-2"></i>
                      <span>support@safedrive.com</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-geo-alt me-2"></i>
                      <span>123 Insurance Ave, Mumbai, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6">
                <h6 className="footer-heading mb-3">Quick Links</h6>
                <ul className="footer-links list-unstyled">
                  <li className="mb-2"><Link to="/" className="text-decoration-none">Home</Link></li>
                  <li className="mb-2"><Link to="/about" className="text-decoration-none">About Us</Link></li>
                  <li className="mb-2">
                    <button className="text-decoration-none bg-transparent border-0 p-0 footer-btn"
                      onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                      Insurance Plans
                    </button>
                  </li>
                  <li className="mb-2"><Link to="/claim-status" className="text-decoration-none">Track Claim</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div className="col-lg-2 col-md-6">
                <h6 className="footer-heading mb-3">Support</h6>
                <ul className="footer-links list-unstyled">
                  <li className="mb-2"><Link to="/contact" className="text-decoration-none">Help Center</Link></li>
                  <li className="mb-2"><Link to="/about" className="text-decoration-none">Privacy Policy</Link></li>
                  <li className="mb-2"><Link to="/about" className="text-decoration-none">Terms of Service</Link></li>
                  <li className="mb-2"><Link to="/contact" className="text-decoration-none">Contact Us</Link></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="col-lg-4 col-md-6">
                <h6 className="footer-heading mb-3">Stay Updated</h6>
                <p className="footer-description mb-3">Subscribe to our newsletter for the latest insurance updates and offers.</p>
                <div className="newsletter-form">
                  <div className="input-group mb-3">
                    <input type="email" className="form-control rounded-start-pill" placeholder="Enter your email" id="newsletter-email" />
                    <button className="btn btn-primary rounded-end-pill px-4"
                      onClick={() => {
                        const email = document.getElementById('newsletter-email').value;
                        if (email) {
                          alert(`Thanks for joining! We've sent a welcome email to ${email}`);
                          document.getElementById('newsletter-email').value = '';
                        } else {
                          alert('Please enter your email address.');
                        }
                      }}>
                      Subscribe
                    </button>
                  </div>
                </div>
                {/* Social Media Icons */}
                <div className="social-icons mt-4">
                  <a href="#" className="social-icon me-3" title="Facebook"><FaFacebookF /></a>
                  <a href="#" className="social-icon me-3" title="Twitter"><FaXTwitter /></a>
                  <a href="#" className="social-icon me-3" title="LinkedIn"><FaLinkedinIn /></a>
                  <a href="#" className="social-icon" title="Instagram"><FaInstagram /></a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="footer-divider my-4" />

            {/* Bottom Footer */}
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0 copyright-text">© 2024 SafeDrive Insurance. All rights reserved.</p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <span className="footer-badge">
                  <i className="bi bi-shield-check me-1"></i>Licensed & Insured
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Global Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Scroll back to top"
      >
        <FaArrowUp style={{ fontSize: '18px' }} />
      </button>

      <CursorBubbleEffect />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isSiteDown, setIsSiteDown] = useState(() => localStorage.getItem('siteDown') === 'true');

  useEffect(() => { localStorage.setItem('siteDown', isSiteDown); }, [isSiteDown]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const toggleSiteStatus = () => setIsSiteDown(!isSiteDown);
  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <AppContent
        user={user}
        isSiteDown={isSiteDown}
        toggleSiteStatus={toggleSiteStatus}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

export default App;
