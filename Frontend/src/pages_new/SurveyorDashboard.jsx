import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, InputGroup, Table, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaClipboardCheck, FaSearch, FaUserCheck, FaUpload, FaFileAlt } from 'react-icons/fa';

const SurveyorDashboard = ({ user, onLogout }) => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showSurveyModal, setShowSurveyModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [surveyReport, setSurveyReport] = useState('');
    const [surveyAmount, setSurveyAmount] = useState('');
    const [surveyDocument, setSurveyDocument] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0
    });

    const calculateStats = (claimsData) => {
        const total = claimsData.length;
        const completed = claimsData.filter(c => c.surveyStatus === 'Completed').length;
        const pending = total - completed;

        setStats({ total, pending, completed });
    };

    const fetchClaims = async (showLoader = false) => {
        if (!user?.email) return;
        if (showLoader) setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/claims/surveyor/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setClaims(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    // Fetch all claims + keep view synchronized
    useEffect(() => {
        fetchClaims(true);
        const interval = setInterval(() => fetchClaims(false), 5000);
        return () => clearInterval(interval);
    }, [user]);

    // Filter claims
    useEffect(() => {
        let filtered = claims;

        if (searchTerm) {
            filtered = filtered.filter(claim =>
                claim.readableId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClaims(filtered);
    }, [searchTerm, claims]);

    const openSurveyForm = (claim) => {
        setSelectedClaim(claim);
        setSurveyReport(claim.surveyReport || '');
        setSurveyAmount(claim.surveyAmount || '');
        setSurveyDocument(null);
        setShowSurveyModal(true);
    };

    const handleSurveySubmit = async (e) => {
        e.preventDefault();
        if (!selectedClaim || !surveyReport || !surveyAmount) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('surveyReport', surveyReport);
            formData.append('surveyAmount', surveyAmount);
            if (surveyDocument) {
                formData.append('surveyDocument', surveyDocument);
            }

            const response = await fetch(`http://localhost:5000/api/claims/${selectedClaim._id}/survey`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const savedClaim = await response.json();
                const updatedClaims = claims.map(c =>
                    c._id === savedClaim._id ? savedClaim : c
                );
                setClaims(updatedClaims);
                calculateStats(updatedClaims);

                setShowSurveyModal(false);
                setSelectedClaim(null);
                setSurveyReport('');
                setSurveyAmount('');
                setSurveyDocument(null);
            }
        } catch (error) {
            console.error('Error submitting survey:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'Completed') return <FaCheckCircle className="text-success" />;
        return <FaClipboardCheck className="text-warning" />;
    };

    if (loading) {
        return (
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Spinner animation="border" role="status" className="text-primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid className="surveyor-dashboard py-4 px-4" style={{ backgroundColor: '#0f0e16', minHeight: '100vh' }}>
            <style>{`
                .surveyor-dashboard {
                    background: linear-gradient(135deg, rgba(15, 14, 22, 0.9), rgba(30, 29, 44, 0.9));
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.12);
                    transform: translateY(-2px);
                }

                .stat-icon {
                    font-size: 24px;
                    margin-bottom: 12px;
                }

                .stat-value {
                    font-size: 28px;
                    font-weight: 700;
                    color: #fff;
                    margin: 8px 0;
                }

                .stat-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .claims-table {
                    background: transparent;
                    border-radius: 12px;
                    overflow: visible;
                }

                .claims-table table {
                    margin-bottom: 0;
                }

                .claims-table thead {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1));
                    border-bottom: 2px solid rgba(16, 185, 129, 0.3);
                }

                .claims-table th {
                    color: #10b981;
                    font-weight: 700;
                    padding: 18px 16px;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 1px;
                    background: transparent;
                    border: none;
                }

                .claims-table td {
                    color: rgba(255, 255, 255, 0.85);
                    padding: 16px;
                    vertical-align: middle;
                    border: none;
                    background: rgba(255, 255, 255, 0.02);
                }

                .claims-table tbody tr {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    margin-bottom: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: table-row;
                }

                .claims-table tbody tr:hover {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.08));
                    border-color: rgba(16, 185, 129, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
                }

                .claims-table tbody tr td:first-child {
                    border-radius: 12px 0 0 12px;
                    font-weight: 700;
                    color: #10b981;
                }

                .claims-table tbody tr td:last-child {
                    border-radius: 0 12px 12px 0;
                }

                .claim-id-cell {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .claim-id-icon {
                    width: 32px;
                    height: 32px;
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #10b981;
                    font-size: 14px;
                }

                .btn-action {
                    padding: 8px 14px;
                    font-size: 12px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .btn-details {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(52, 211, 153, 0.15));
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .btn-details:hover {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(52, 211, 153, 0.3));
                    color: #6ee7b7;
                    border-color: rgba(16, 185, 129, 0.6);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                }

                .modal-overlay {
                    background: rgba(0, 0, 0, 0.7) !important;
                }

                .modal-content-custom {
                    background: linear-gradient(135deg, rgba(30, 29, 44, 0.95), rgba(45, 43, 65, 0.95)) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 16px !important;
                    backdrop-filter: blur(8px);
                }

                .modal-header-custom {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                    padding: 24px !important;
                    background: rgba(255, 255, 255, 0.02);
                }

                .modal-header-custom h5 {
                    color: #fff;
                    font-weight: 700;
                }

                .claim-detail-section {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 14px;
                }

                .claim-detail-label {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                    font-weight: 600;
                }

                .claim-detail-value {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                }

                .btn-submit {
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    margin-top: 20px;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
                }

                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .search-box {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 10px 14px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .search-box::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }

                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .empty-state-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    color: rgba(255, 255, 255, 0.2);
                }

                .header-title {
                    color: #fff;
                    font-weight: 700;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                }

                .badge-custom {
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    letter-spacing: 0.5px;
                    backdrop-filter: blur(4px);
                    border: 1px solid;
                }

                .badge-completed {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1));
                    color: #10b981;
                    border-color: rgba(16, 185, 129, 0.3);
                    text-transform: uppercase;
                }
                
                .badge-pending {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.1));
                    color: #fbbf24;
                    border-color: rgba(245, 158, 11, 0.3);
                    text-transform: uppercase;
                }
                
                .form-control-custom {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.8);
                    border-radius: 8px;
                }
                .form-control-custom:focus {
                    background: rgba(255,255,255,0.06);
                    border-color: #10b981;
                    color: #fff;
                    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25);
                }
            `}</style>

            {/* Header */}
            <Row className="mb-5 align-items-center">
                <Col md={8}>
                    <h1 className="header-title">
                        <FaUserCheck style={{ fontSize: '28px', color: '#10b981' }} />
                        Surveyor Portal
                    </h1>
                    <p className="header-subtitle">Review assigned claims and submit inspection reports</p>
                </Col>
                <Col md={4} className="text-end">
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{user?.fullName}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Surveyor</div>
                    </div>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="g-3 mb-5">
                <Col md={4} sm={12}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#0ea5e9' }}><FaClipboardCheck /></div>
                        <div className="stat-label">Total Assigned</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </Col>
                <Col md={4} sm={6}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#f59e0b' }}><FaClipboardCheck /></div>
                        <div className="stat-label">Pending Reviews</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                </Col>
                <Col md={4} sm={6}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#10b981' }}><FaCheckCircle /></div>
                        <div className="stat-label">Surveys Completed</div>
                        <div className="stat-value">{stats.completed}</div>
                    </div>
                </Col>
            </Row>

            {/* Search */}
            <Row className="mb-4 g-3">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                            <FaSearch />
                        </InputGroup.Text>
                        <input
                            type="text"
                            className="search-box text-white"
                            placeholder="Search by claim ID, vehicle, or policy..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </InputGroup>
                </Col>
            </Row>

            {/* Assigned Claims Table */}
            <div className="claims-table">
                {filteredClaims.length > 0 ? (
                    <Table striped hover borderless responsive className="mb-0">
                        <thead>
                            <tr>
                                <th><FaClipboardCheck /> Claim ID</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Policy #</th>
                                <th>Incident Date</th>
                                <th>Survey Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClaims.map(claim => (
                                <tr key={claim._id}>
                                    <td>
                                        <div className="claim-id-cell">
                                            <div className="claim-id-icon">
                                                {getStatusIcon(claim.surveyStatus)}
                                            </div>
                                            <strong>{claim.readableId}</strong>
                                        </div>
                                    </td>
                                    <td>{claim.userName}</td>
                                    <td>{claim.vehicleNumber}</td>
                                    <td>{claim.policyNumber}</td>
                                    <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                                    <td>
                                        <Badge className={`badge-custom badge-${claim.surveyStatus === 'Completed' ? 'completed' : 'pending'}`}>
                                            {getStatusIcon(claim.surveyStatus)}
                                            {claim.surveyStatus || 'Pending'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-action btn-details"
                                            onClick={() => openSurveyForm(claim)}
                                        >
                                            <FaFileAlt />
                                            {claim.surveyStatus === 'Completed' ? 'View Report' : 'Start Survey'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><FaClipboardCheck /></div>
                        <div>No assigned claims found.</div>
                    </div>
                )}
            </div>

            {/* Survey Form Modal */}
            <Modal
                show={showSurveyModal}
                onHide={() => setShowSurveyModal(false)}
                size="lg"
                centered
                className="modal-overlay"
            >
                <div className="modal-content-custom">
                    <Modal.Header className="modal-header-custom" closeButton>
                        <Modal.Title>
                            {selectedClaim?.readableId} - Survey Report
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '24px', color: 'rgba(255,255,255,0.9)' }}>
                        {selectedClaim && (
                            <Form onSubmit={handleSurveySubmit}>
                                {/* Claim Details Readonly */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ color: '#10b981', fontWeight: '700', marginBottom: '12px' }}>Incident Details</h6>
                                    <div className="claim-detail-section">
                                        <div className="claim-detail-label">Description provided by customer</div>
                                        <div className="claim-detail-value mb-2">{selectedClaim.description}</div>
                                        <div className="claim-detail-label mt-3">Requested Claim Amount</div>
                                        <div className="claim-detail-value fw-bold text-white mb-2">₹{selectedClaim.claimAmount?.toLocaleString()}</div>

                                        {(selectedClaim.policyDocument || selectedClaim.repairEstimate || selectedClaim.firDocument) && (
                                            <div className="mt-3">
                                                {selectedClaim.repairEstimate && (
                                                    <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.repairEstimate}`} target="_blank" rel="noopener noreferrer" className="me-3 text-info">View Customer Repair Estimate ↗</a>
                                                )}
                                                {selectedClaim.policyDocument && (
                                                    <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.policyDocument}`} target="_blank" rel="noopener noreferrer" className="text-info me-3">View Policy Document ↗</a>
                                                )}
                                                {selectedClaim.firDocument && (
                                                    <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.firDocument}`} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444' }}>🚔 View FIR ↗</a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Editable Survey Fields */}
                                <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Your Inspection Findings</h6>

                                <Form.Group className="mb-3">
                                    <Form.Label className="claim-detail-label">Estimated Repair Amount (₹)*</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter the approved estimated amount"
                                        value={surveyAmount}
                                        onChange={(e) => setSurveyAmount(e.target.value)}
                                        className="form-control-custom"
                                        style={{ padding: '12px' }}
                                        required
                                        disabled={selectedClaim.surveyStatus === 'Completed'}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="claim-detail-label">Detailed Survey Report*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Describe the damages visually inspected, parts required, and justification of amount..."
                                        value={surveyReport}
                                        onChange={(e) => setSurveyReport(e.target.value)}
                                        className="form-control-custom"
                                        style={{ padding: '12px' }}
                                        required
                                        disabled={selectedClaim.surveyStatus === 'Completed'}
                                    />
                                </Form.Group>

                                {selectedClaim.surveyStatus === 'Completed' ? (
                                    selectedClaim.surveyDocument && (
                                        <div className="mt-3 claim-detail-section" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                            <div className="claim-detail-label">Uploaded Survey Document</div>
                                            <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.surveyDocument}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 'bold' }}>
                                                <FaFileAlt className="me-2" />
                                                View Survey Document ↗
                                            </a>
                                        </div>
                                    )
                                ) : (
                                    <Form.Group className="mb-4">
                                        <Form.Label className="claim-detail-label">Upload Inspection Photos / Survey PDF</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => setSurveyDocument(e.target.files[0])}
                                            className="form-control-custom"
                                            style={{ padding: '10px' }}
                                        />
                                        <small className="text-muted mt-1 d-block">Max file size: 5MB. PDF, JPG, PNG allowed.</small>
                                    </Form.Group>
                                )}

                                {selectedClaim.surveyStatus !== 'Completed' && (
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={submitting || !surveyAmount || !surveyReport}
                                    >
                                        {submitting ? 'Submitting Report...' : <><FaUpload className="me-2" /> Submit Survey Report</>}
                                    </button>
                                )}
                            </Form>
                        )}
                    </Modal.Body>
                </div>
            </Modal>
        </Container>
    );
};

export default SurveyorDashboard;
