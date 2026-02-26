import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaShieldAlt, FaUserAlt, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const MyNavbar = ({ darkMode, toggleDarkMode, userRole, onLogout }) => {
    const location = useLocation();

    return (
        <Navbar bg={darkMode ? "dark" : "white"} variant={darkMode ? "dark" : "light"} expand="lg" className="shadow-sm py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary d-flex align-items-center">
                    <FaShieldAlt className="me-2" /> SafeDrive
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/" className={`px-3 fw-medium ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/vehicle-insurance" className={`px-3 fw-medium ${location.pathname === '/vehicle-insurance' ? 'text-primary' : ''}`}>Vehicle Insurance</Nav.Link>
                        <Nav.Link as={Link} to="/claim-status" className={`px-3 fw-medium ${location.pathname === '/claim-status' ? 'text-primary' : ''}`}>Claim Status</Nav.Link>
                        <Nav.Link as={Link} to="/about" className={`px-3 fw-medium ${location.pathname === '/about' ? 'text-primary' : ''}`}>About</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className={`px-3 fw-medium ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Nav.Link>


                        {userRole === 'admin' ? (
                            <Nav.Link as={Link} to="/admin" className={`px-3 fw-medium ${location.pathname === '/admin' ? 'text-primary' : ''}`}>Admin Dashboard</Nav.Link>
                        ) : userRole === 'user' ? (
                            <Nav.Link as={Link} to="/dashboard" className={`px-3 fw-medium ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}>My Dashboard</Nav.Link>
                        ) : null}
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        {userRole ? (
                            <>
                                <span className="me-3 text-muted small d-none d-lg-inline">
                                    <FaUserAlt className="me-1 text-primary" /> {userRole === 'admin' ? 'Admin' : 'User'}
                                </span>
                                <Button variant="outline-danger" className="rounded-pill px-4 fw-bold me-2" onClick={onLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button as={Link} to="/login" variant="primary" className="px-4 rounded-pill fw-bold shadow-sm btn-dynamic text-white text-decoration-none me-2">
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
