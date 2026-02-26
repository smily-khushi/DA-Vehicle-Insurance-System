import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Modal } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin, isSiteDown }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Registration State
    const [regFullName, setRegFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleCloseRegister = () => {
        setShowRegister(false);
        setMessage({ type: '', text: '' });
    };
    const handleShowRegister = () => {
        if (isSiteDown) {
            setMessage({ type: 'warning', text: 'Registration is also disabled during maintenance.' });
            return;
        }
        setShowRegister(true);
    };

    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        setGeneratedCaptcha(result);
        setCaptcha('');
    };

    React.useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (captcha !== generatedCaptcha) {
            setMessage({ type: 'danger', text: 'Invalid CAPTCHA. Please try again.' });
            generateCaptcha();
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // If site is down, only allow admins
                if (isSiteDown && data.user.role !== 'admin') {
                    setMessage({ type: 'danger', text: 'Maintenance Mode: Only Administrators can access the system right now.' });
                    return;
                }

                onLogin(data.user);
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                setMessage({ type: 'danger', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Server is offline. Please try again later.' });
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (isSiteDown) return;

        setMessage({ type: '', text: '' });

        if (regPassword !== regConfirmPassword) {
            setMessage({ type: 'danger', text: 'Passwords do not match' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: regFullName,
                    email: regEmail,
                    password: regPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Account created! You can now login.' });
                // Clear all fields
                setRegFullName('');
                setRegEmail('');
                setRegPassword('');
                setRegConfirmPassword('');
                setTimeout(() => {
                    handleCloseRegister();
                }, 2000);
            } else {
                setMessage({ type: 'danger', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Server is offline. Please try again later.' });
        }
    };

    return (
        <Container className="py-5 my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <Card className="border-0 shadow-lg p-4 rounded-4 animate-up">
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-white">Welcome Back</h2>
                                <p className="text-secondary opacity-75">Enter your details to access your account</p>
                                {isSiteDown && (
                                    <div className="alert alert-warning py-2 small fw-bold text-uppercase" role="alert">
                                        Maintenance Mode: Admin Login Only
                                    </div>
                                )}
                                {message.text && !showRegister && (
                                    <div className={`alert alert-${message.type} py-2 small`} role="alert">
                                        {message.text}
                                    </div>
                                )}
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className="small fw-bold">Email address</Form.Label>
                                    <InputGroup className="bg-light rounded-pill px-3 py-1">
                                        <InputGroup.Text className="bg-transparent border-0 text-muted">
                                            <FaUser />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            className="bg-transparent border-0 shadow-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label className="small fw-bold d-flex justify-content-between">
                                        Password
                                        <Link to="/forgot-password" size="sm" className={`text-decoration-none x-small ${isSiteDown ? 'pe-none opacity-50' : ''}`}>Forgot Password?</Link>
                                    </Form.Label>
                                    <InputGroup className="bg-light rounded-pill px-3 py-1">
                                        <InputGroup.Text className="bg-transparent border-0 text-muted">
                                            <FaLock />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="bg-transparent border-0 shadow-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <InputGroup.Text
                                            className="bg-transparent border-0 text-muted cursor-pointer"
                                            onClick={() => !isSiteDown && setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Verification</Form.Label>
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div
                                            className="captcha-box px-3 py-2 bg-dark text-white rounded-3 fw-bold fs-5 shadow-sm user-select-none"
                                            style={{ letterSpacing: '4px', fontStyle: 'italic', textDecoration: 'line-through' }}
                                        >
                                            {generatedCaptcha}
                                        </div>
                                        <Button variant="outline-secondary" size="sm" onClick={generateCaptcha} disabled={isSiteDown} className="rounded-circle border-0">
                                            ↺
                                        </Button>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the code above"
                                        className="bg-light border-0 rounded-pill px-3 py-2 small shadow-none"
                                        value={captcha}
                                        onChange={(e) => setCaptcha(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Stay logged in" className="small" disabled={isSiteDown} />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-3 rounded-pill fw-bold btn-dynamic shadow mb-4"
                                >
                                    {isSiteDown ? 'Admin Login' : 'Login to Account'}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <p className="mb-0 small">
                                    Don't have an account? <Button variant="link" onClick={handleShowRegister} disabled={isSiteDown} className="fw-bold text-decoration-none p-0 align-baseline">Create Account</Button>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Register Modal */}
            <Modal show={showRegister} onHide={handleCloseRegister} centered className="register-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold mx-auto ps-4">Join SafeDrive</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <p className="text-center text-muted mb-4 small">Create your account to start protecting your vehicle today.</p>
                    {message.text && (
                        <div className={`alert alert-${message.type} py-2 small mb-3`} role="alert">
                            {message.text}
                        </div>
                    )}
                    <Form onSubmit={handleRegisterSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Full Name</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="bg-transparent border-0 shadow-none"
                                    value={regFullName}
                                    onChange={(e) => setRegFullName(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Email address</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    className="bg-transparent border-0 shadow-none"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Password</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <Form.Control
                                    type="password"
                                    placeholder="Create a password"
                                    className="bg-transparent border-0 shadow-none"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    className="bg-transparent border-0 shadow-none"
                                    value={regConfirmPassword}
                                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill fw-bold shadow-sm mb-3">
                            Create Account
                        </Button>
                        <p className="text-center small text-muted mb-0">
                            By signing up, you agree to our <Link to="#" className="text-decoration-none">Terms</Link> and <Link to="#" className="text-decoration-none">Privacy Policy</Link>
                        </p>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Login;
