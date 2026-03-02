import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Badge } from 'react-bootstrap';
import { FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaCarCrash, FaSignature } from 'react-icons/fa';

const ClaimStatus = () => {
    const [searchId, setSearchId] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [claimData, setClaimData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getProgressStatus = (status) => {
        switch(status) {
            case 'Approved': return 100;
            case 'Rejected': return 50;
            default: return 50;
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setError('');
        try {
            // Search by readableId or MongoDB ID
            const response = await fetch(`http://localhost:5000/api/claims`);
            const allClaims = await response.json();
            
            const foundClaim = allClaims.find(claim => 
                claim.readableId === searchId.toUpperCase() || 
                claim._id === searchId
            );

            if (foundClaim) {
                setClaimData(foundClaim);
                setShowResults(true);
            } else {
                setError('Claim ID not found. Please check and try again.');
                setShowResults(false);
            }
        } catch (error) {
            console.error('Error searching claim:', error);
            setError('Error fetching claim. Please try again.');
            setShowResults(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5 min-vh-100">
            <div className="text-center mb-5 animate-up">
                <h2 className="display-5 fw-bold text-white">Claim Track Center</h2>
                <p className="lead text-secondary opacity-75">Stay updated on the progress of your insurance claim in real-time</p>
            </div>

            <Row className="justify-content-center mb-5">
                <Col md={8} lg={6}>
                    <Card className="border-0 shadow-lg p-2 rounded-pill animate-up glass-panel" style={{ animationDelay: '0.2s', borderColor: 'rgba(255,255,255,0.1) !important' }}>
                        <Form onSubmit={handleSearch}>
                            <InputGroup className="border-0 bg-transparent">
                                <Form.Control
                                    placeholder="Enter Claim ID (e.g. CLM-0001-ABC)"
                                    className="border-0 rounded-pill shadow-none px-4 bg-transparent text-white"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    disabled={loading}
                                />
                                <Button variant="primary" type="submit" className="rounded-pill px-4 py-2 m-1 d-flex align-items-center fw-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }} disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <FaSearch className="me-2" />}
                                    {loading ? 'Searching...' : 'Track Claim'}
                                </Button>
                            </InputGroup>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {error && (
                <Row className="justify-content-center mb-4 animate-up" style={{ animationDelay: '0.4s' }}>
                    <Col lg={8} className="mx-auto">
                        <Card className="border-0 shadow-lg rounded-4 p-4" style={{ background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                            <p className="mb-0 text-danger fw-bold">{error}</p>
                        </Card>
                    </Col>
                </Row>
            )}

            {showResults && claimData && (
                <Row className="animate-up" style={{ animationDelay: '0.4s' }}>
                    <Col lg={8} className="mx-auto">
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden glass-panel">
                            <Card.Header className="p-4 border-0 d-flex justify-content-between align-items-center" style={{ background: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid rgba(255,255,255,0.05) !important' }}>
                                <div>
                                    <h5 className="mb-0 fw-bold text-white">Reference: {claimData.readableId}</h5>
                                    <small className="text-secondary opacity-75">Vehicle: {claimData.vehicleNumber} ({claimData.policyNumber})</small>
                                </div>
                                <Badge 
                                    bg={claimData.status === 'Approved' ? 'success' : claimData.status === 'Rejected' ? 'danger' : 'warning'}
                                    className="px-3 py-2 rounded-pill"
                                >
                                    {claimData.status}
                                </Badge>
                            </Card.Header>
                            <Card.Body className="p-4 p-md-5">
                                <Row className="mb-5">
                                    <Col md={6}>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Submitted By</p>
                                        <p className="fw-bold mb-3" style={{ color: '#f8fafc' }}>{claimData.userName}</p>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Email</p>
                                        <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{claimData.userEmail}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Submitted Date</p>
                                        <p className="fw-bold mb-3" style={{ color: '#f8fafc' }}>{new Date(claimData.createdAt).toLocaleDateString()}</p>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Incident Date</p>
                                        <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{new Date(claimData.incidentDate).toLocaleDateString()}</p>
                                    </Col>
                                </Row>

                                <div className="mb-5">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold text-white">Overall Progress</span>
                                        <span className="text-gradient fw-bold">{getProgressStatus(claimData.status)}%</span>
                                    </div>
                                    <ProgressBar now={getProgressStatus(claimData.status)} className="rounded-pill overflow-hidden" style={{ height: '12px', background: 'rgba(255,255,255,0.05)' }} />
                                </div>

                                <div className="timeline-container ps-4 border-start border-2" style={{ borderColor: claimData.status === 'Approved' ? '#10b981' : claimData.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>
                                    <div className="timeline-item position-relative mb-5 ps-4">
                                        <div className="timeline-icon position-absolute rounded-circle d-flex align-items-center justify-content-center border-4 shadow-sm bg-primary text-white"
                                            style={{ left: '-18px', top: '0', width: '36px', height: '36px', borderColor: '#0f0e16' }}>
                                            <FaCheckCircle />
                                        </div>
                                        <div className="timeline-content">
                                            <h6 className="mb-1 fw-bold text-white">Claim Submitted</h6>
                                            <p className="small text-secondary opacity-75 mb-0">{new Date(claimData.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="timeline-item position-relative mb-5 ps-4">
                                        <div className={`timeline-icon position-absolute rounded-circle d-flex align-items-center justify-content-center border-4 shadow-sm ${claimData.status !== 'Pending' ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                                            style={{ left: '-18px', top: '0', width: '36px', height: '36px', borderColor: '#0f0e16' }}>
                                            <FaCheckCircle />
                                        </div>
                                        <div className="timeline-content">
                                            <h6 className={`mb-1 fw-bold ${claimData.status !== 'Pending' ? 'text-white' : 'text-secondary opacity-50'}`}>Document Verification</h6>
                                            <p className="small text-secondary opacity-75 mb-0">{claimData.status !== 'Pending' ? 'Completed' : 'In Progress'}</p>
                                        </div>
                                    </div>

                                    <div className="timeline-item position-relative mb-5 ps-4">
                                        <div className={`timeline-icon position-absolute rounded-circle d-flex align-items-center justify-content-center border-4 shadow-sm ${claimData.status === 'Approved' ? 'bg-success text-white' : claimData.status === 'Rejected' ? 'bg-danger text-white' : 'bg-light text-muted'}`}
                                            style={{ left: '-18px', top: '0', width: '36px', height: '36px', borderColor: '#0f0e16' }}>
                                            {claimData.status === 'Approved' ? <FaCheckCircle /> : claimData.status === 'Rejected' ? <FaTimesCircle /> : <FaClock />}
                                        </div>
                                        <div className="timeline-content">
                                            <h6 className={`mb-1 fw-bold ${claimData.status === 'Approved' || claimData.status === 'Rejected' ? 'text-white' : 'text-secondary opacity-50'}`}>
                                                {claimData.status === 'Approved' ? 'Approved' : claimData.status === 'Rejected' ? 'Rejected' : 'Processing'}
                                            </h6>
                                            <p className="small text-secondary opacity-75 mb-0">{claimData.status}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-4 mt-4" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Claim Description</p>
                                    <p className="mb-0" style={{ color: '#f8fafc' }}>{claimData.description}</p>
                                </div>

                                <div className="p-4 rounded-4 mt-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p className="mb-0 text-secondary">Need help with your claim? <Link to="/contact" className="fw-bold text-decoration-none text-primary">Contact our Claims Team</Link></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {(showResults || error) && (
                <Row className="justify-content-center mb-5 animate-up" style={{ animationDelay: '0.6s' }}>
                    <Col lg={8} className="mx-auto">
                        <Button 
                            variant="outline-light" 
                            className="rounded-pill px-4 fw-bold border-secondary-subtle"
                            onClick={() => { setSearchId(''); setShowResults(false); setError(''); setClaimData(null); }}
                        >
                            ← Try Another Search
                        </Button>
                    </Col>
                </Row>
            )}

            {!showResults && !error && (
                <Row className="mt-5 g-4 text-center animate-up" style={{ animationDelay: '0.4s' }}>
                    <Col md={4}>
                        <div className="p-4 rounded-4 shadow-lg glass-panel h-100 transition-hover">
                            <FaCheckCircle className="text-success display-4 mb-3" />
                            <h5 className="text-white">Fast Approval</h5>
                            <p className="text-secondary opacity-75 small">Most claims are processed within 48-72 hours.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 rounded-4 shadow-lg glass-panel h-100 transition-hover">
                            <FaCarCrash className="text-primary display-4 mb-3" />
                            <h5 className="text-white">Direct Repair</h5>
                            <p className="text-secondary opacity-75 small">Connect with our network of approved workshops.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 rounded-4 shadow-lg glass-panel h-100 transition-hover">
                            <FaClock className="text-warning display-4 mb-3" />
                            <h5 className="text-white">24/7 Tracking</h5>
                            <p className="text-secondary opacity-75 small">Monitor your claim status any time, anywhere.</p>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

// Helper component for Search Input (required because InputGroup wasn't fully defined in simple way above)
const InputGroup = ({ children, className }) => (
    <div className={`input-group ${className}`}>{children}</div>
);

export default ClaimStatus;
