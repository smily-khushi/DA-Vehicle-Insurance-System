import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaShieldAlt, FaUserAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './MyNavbar.css';

const MyNavbar = ({ userRole, onLogout }) => {
    const location = useLocation();

    return (
        <Navbar expand="lg" className="navbar-modern sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-modern fw-bold fs-3 text-primary d-flex align-items-center">
                    <FaShieldAlt className="me-2 brand-icon-animate" /> SafeDrive
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/' ? 'active-link' : ''}`}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/vehicle-insurance" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/vehicle-insurance' ? 'active-link' : ''}`}>Vehicle Insurance</Nav.Link>
                        <Nav.Link as={Link} to="/claim-status" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/claim-status' ? 'active-link' : ''}`}>Claim Status</Nav.Link>
                        <Nav.Link as={Link} to="/about" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/about' ? 'active-link' : ''}`}>About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/contact' ? 'active-link' : ''}`}>Contact</Nav.Link>

                        {userRole === 'admin' ? (
                            <Nav.Link as={Link} to="/admin" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/admin' ? 'active-link' : ''}`}>Admin Dashboard</Nav.Link>
                        ) : userRole === 'officer' ? (
                            <Nav.Link as={Link} to="/officer" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/officer' ? 'active-link' : ''}`}>Officer Portal</Nav.Link>
                        ) : userRole === 'surveyor' ? (
                            <Nav.Link as={Link} to="/surveyor" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/surveyor' ? 'active-link' : ''}`}>Surveyor Portal</Nav.Link>
                        ) : userRole === 'user' ? (
                            <Nav.Link as={Link} to="/dashboard" className={`nav-link-modern px-3 fw-medium ${location.pathname === '/dashboard' ? 'active-link' : ''}`}>My Dashboard</Nav.Link>
                        ) : null}
                    </Nav>
                    <Nav className="ms-auto align-items-center gap-3">
                        {userRole ? (
                            <>
                                <span className="me-2 text-secondary small d-none d-lg-inline user-badge">
                                    <FaUserAlt className="me-2 text-primary" style={{ fontSize: '14px' }} /> {userRole === 'admin' ? 'Admin' : userRole === 'officer' ? 'Officer' : userRole === 'surveyor' ? 'Surveyor' : 'User'}
                                </span>
                                <Button variant="outline-danger" className="btn-logout px-4 fw-bold" onClick={onLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button as={Link} to="/login" className="btn-login px-4 fw-bold text-white text-decoration-none">
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
