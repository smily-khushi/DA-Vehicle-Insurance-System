import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaUserCircle, FaShieldAlt, FaHistory, FaCheckCircle, FaTimesCircle, FaClock, FaCar, FaFileInvoiceDollar, FaLock, FaUser } from 'react-icons/fa';

const Dashboard = ({ user: initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    // Profile Edit State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState(user?.fullName || '');
    const [editPassword, setEditPassword] = useState('');
    const [editConfirmPassword, setEditConfirmPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchClaims = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`http://localhost:5000/api/claims/user/${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setClaims(data);
                }
            } catch (error) {
                console.error('Error fetching claims:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage({ type: '', text: '' });

        if (editPassword && editPassword !== editConfirmPassword) {
            setUpdateMessage({ type: 'danger', text: 'Passwords do not match' });
            return;
        }

        setUpdating(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: editName,
                    password: editPassword || undefined
                })
            });

            const data = await response.json();

            if (response.ok) {
                setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
                const updatedUser = { ...user, fullName: editName };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Sync with localStorage

                setTimeout(() => {
                    setShowEditModal(false);
                    setEditPassword('');
                    setEditConfirmPassword('');
                    setUpdateMessage({ type: '', text: '' });
                }, 2000);
            } else {
                setUpdateMessage({ type: 'danger', text: data.message });
            }
        } catch (error) {
            setUpdateMessage({ type: 'danger', text: 'Failed to update profile. Server may be offline.' });
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return <Badge bg="success" className="rounded-pill"><FaCheckCircle className="me-1" /> Approved</Badge>;
            case 'Rejected': return <Badge bg="danger" className="rounded-pill"><FaTimesCircle className="me-1" /> Rejected</Badge>;
            default: return <Badge bg="warning" className="rounded-pill text-dark"><FaClock className="me-1" /> Pending</Badge>;
        }
    };

    return (
        <Container className="py-5 user-dashboard">
            <div className="mb-5 animate-slide-down">
                <Badge bg="rgba(99, 102, 241, 0.1)" className="text-primary px-3 py-2 rounded-pill mb-3 border border-primary border-opacity-25">Account Overview</Badge>
                <h2 className="fw-bold text-white display-5">Welcome back, <span className="text-gradient">{user?.fullName || 'Valued Member'}</span></h2>
                <p className="text-secondary opacity-75 lead">Managing your vehicle protection has never been easier.</p>
            </div>

            <Row className="g-4">
                <Col lg={4} className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <Card className="border-0 shadow-lg p-3 text-center glass-panel h-100 transition-hover">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <div className="profile-avatar-container mb-4">
                                <FaUserCircle className="text-primary display-1 animate-float" />
                                <div className="online-indicator"></div>
                            </div>
                            <h3 className="fw-bold text-white mb-1">{user?.fullName}</h3>
                            <p className="text-secondary opacity-75 mb-3">{user?.email}</p>
                            <div className="d-flex gap-2 mb-4">
                                <Badge bg="primary" className="px-3 py-2 rounded-pill bg-opacity-25 text-primary border border-primary border-opacity-25">
                                    {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                                </Badge>
                                <Badge bg="success" className="px-3 py-2 rounded-pill bg-opacity-25 text-success border border-success border-opacity-25">
                                    Verified
                                </Badge>
                            </div>
                            <Button variant="outline-primary" className="rounded-pill px-4 w-100 fw-bold border-2" onClick={() => setShowEditModal(true)}>Edit Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Card className="border-0 shadow-lg mb-4 glass-panel overflow-hidden transition-hover">
                            <div className="card-accent-line bg-primary"></div>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center text-white">
                                    <FaShieldAlt className="me-2 text-primary" /> Active Protection
                                </h5>
                                {claims.length > 0 ? (
                                    <Row className="g-4">
                                        <Col sm={6}>
                                            <div className="info-stat-box">
                                                <p className="mb-1 text-secondary small text-uppercase fw-bold letter-spacing-1">Current Policy</p>
                                                <p className="fw-bold text-white h5">{claims[0].policyNumber}</p>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="info-stat-box">
                                                <p className="mb-1 text-secondary small text-uppercase fw-bold letter-spacing-1">Vehicle Number</p>
                                                <p className="fw-bold text-white h5 text-uppercase">{claims[0].vehicleNumber}</p>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="info-stat-box">
                                                <p className="mb-1 text-secondary small text-uppercase fw-bold letter-spacing-1">Status</p>
                                                <div>{getStatusBadge(claims[0].status)}</div>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="info-stat-box">
                                                <p className="mb-1 text-secondary small text-uppercase fw-bold letter-spacing-1">Last Updated</p>
                                                <p className="fw-bold text-white">{new Date(claims[0].updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                ) : (
                                    <div className="text-center py-4">
                                        <FaCar className="display-4 text-secondary opacity-25 mb-3" />
                                        <p className="text-secondary opacity-75">No active policies found. Secure your vehicle today.</p>
                                        <Button variant="link" className="text-primary fw-bold text-decoration-none p-0">Browse Plans</Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Card className="border-0 shadow-lg glass-panel overflow-hidden transition-hover">
                            <div className="card-accent-line bg-success"></div>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center text-white">
                                    <FaHistory className="me-2 text-success" /> Claim History
                                </h5>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                        <span className="text-secondary">Syncing your data...</span>
                                    </div>
                                ) : claims.length > 0 ? (
                                    <div className="claim-list">
                                        {claims.map((claim, index) => (
                                            <div key={claim._id} className={`claim-item p-3 mb-3 rounded-4 border border-white border-opacity-10 transition-all ${index < 3 ? 'show' : ''}`} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                    <div>
                                                        <h6 className="fw-bold text-white mb-1">Claim {claim.readableId}</h6>
                                                        <p className="small text-secondary mb-0">{new Date(claim.incidentDate).toLocaleDateString()} • {claim.vehicleNumber}</p>
                                                    </div>
                                                    <div className="text-end">
                                                        {getStatusBadge(claim.status)}
                                                        <div className="small text-secondary mt-1">₹{claim.claimAmount?.toLocaleString() || '0'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {claims.length > 5 && (
                                            <Button variant="link" className="w-100 text-secondary text-decoration-none small py-2">View All History</Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="mb-3 opacity-25">
                                            <FaFileInvoiceDollar className="display-4" />
                                        </div>
                                        <p className="text-secondary opacity-75 mb-0">Safe roads! You haven't filed any claims yet.</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Profile Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="profile-edit-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {updateMessage.text && (
                        <div className={`alert alert-${updateMessage.type} py-2 small mb-4 animate-fade-in`} role="alert">
                            {updateMessage.text}
                        </div>
                    )}
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Full Name</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <InputGroup.Text className="bg-transparent border-0 text-muted"><FaUser /></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    className="bg-transparent border-0 shadow-none"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">New Password (leave blank to keep current)</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <InputGroup.Text className="bg-transparent border-0 text-muted"><FaLock /></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    className="bg-transparent border-0 shadow-none"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Confirm New Password</Form.Label>
                            <InputGroup className="bg-light rounded-pill px-3 py-1 border-0">
                                <InputGroup.Text className="bg-transparent border-0 text-muted"><FaLock /></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="bg-transparent border-0 shadow-none"
                                    value={editConfirmPassword}
                                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 rounded-pill fw-bold shadow-sm"
                            disabled={updating}
                        >
                            {updating ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                }
                .transition-hover:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05) !important;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5) !important;
                }
                .text-gradient {
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .online-indicator {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    width: 15px;
                    height: 15px;
                    background: #10b981;
                    border: 3px solid #0f0e16;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                }
                .profile-avatar-container {
                    position: relative;
                    display: inline-block;
                }
                .card-accent-line {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 4px;
                    height: 100%;
                    opacity: 0.5;
                }
                .info-stat-box {
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    height: 100%;
                }
                .letter-spacing-1 {
                    letter-spacing: 1px;
                }
                .animate-slide-down {
                    animation: slideDown 0.6s ease-out forwards;
                }
                .animate-fade-in {
                    opacity: 0;
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .profile-edit-modal .modal-content {
                    background: #1a1926;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                }
                .profile-edit-modal .form-label {
                    color: rgba(255,255,255,0.7);
                }
                .profile-edit-modal .form-control {
                    color: #000;
                }
                .profile-edit-modal .btn-close {
                    filter: invert(1);
                }
            `}</style>
        </Container>
    );
};

export default Dashboard;
