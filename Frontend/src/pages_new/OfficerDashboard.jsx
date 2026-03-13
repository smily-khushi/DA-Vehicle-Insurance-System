import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, InputGroup, Table, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaClock, FaClipboardCheck, FaComments, FaFilter, FaSearch, FaStar, FaChartBar, FaUserCheck, FaFileAlt, FaArrowUp } from 'react-icons/fa';

const OfficerDashboard = ({ user, onLogout }) => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Pending');
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Modal States
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [actionComment, setActionComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Document Detail States
    const [showDocDetails, setShowDocDetails] = useState(false);
    const [docType, setDocType] = useState('');

    // Surveyor States
    const [surveyors, setSurveyors] = useState([]);
    const [selectedSurveyor, setSelectedSurveyor] = useState('');
    const [assigningSurveyor, setAssigningSurveyor] = useState(false);

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        approvalRate: 0
    });

    const calculateStats = (claimsData) => {
        const total = claimsData.length;
        const pending = claimsData.filter(c => c.status === 'Pending').length;
        const approved = claimsData.filter(c => c.status === 'Approved').length;
        const rejected = claimsData.filter(c => c.status === 'Rejected').length;
        const approvalRate = total > 0 ? Math.round((approved / (approved + rejected || 1)) * 100) : 0;

        setStats({ total, pending, approved, rejected, approvalRate });
    };

    const fetchClaims = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/claims');
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

    // Fetch all claims + keep officer view synchronized
    useEffect(() => {
        fetchClaims(true);
        const interval = setInterval(() => fetchClaims(false), 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch surveyors
    useEffect(() => {
        const fetchSurveyors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/users');
                if (response.ok) {
                    const data = await response.json();
                    setSurveyors(data.filter(u => u.role === 'surveyor'));
                }
            } catch (error) {
                console.error('Error fetching surveyors:', error);
            }
        };
        fetchSurveyors();
    }, []);

    // Filter claims
    useEffect(() => {
        let filtered = claims;

        if (filterStatus !== 'All') {
            filtered = filtered.filter(claim => claim.status === filterStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(claim =>
                claim.readableId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClaims(filtered);
    }, [searchTerm, filterStatus, claims]);

    const handleClaimAction = async (action) => {
        if (!selectedClaim) return;

        setActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/claims/${selectedClaim._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: action === 'approve' ? 'Approved' : 'Rejected',
                    comment: actionComment,
                    officerName: user?.fullName || 'Officer'
                })
            });

            if (response.ok) {
                const savedClaim = await response.json();
                const updatedClaims = claims.map(c =>
                    c._id === savedClaim._id ? savedClaim : c
                );
                setClaims(updatedClaims);
                calculateStats(updatedClaims);

                setShowDetailsModal(false);
                setActionComment('');
                setSelectedClaim(null);
            }
        } catch (error) {
            console.error('Error updating claim:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignSurveyor = async () => {
        if (!selectedClaim || !selectedSurveyor) return;

        const surveyorObj = surveyors.find(s => s.email === selectedSurveyor);
        if (!surveyorObj) return;

        setAssigningSurveyor(true);
        try {
            const response = await fetch(`http://localhost:5000/api/claims/${selectedClaim._id}/assign-surveyor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surveyorEmail: surveyorObj.email,
                    surveyorName: surveyorObj.fullName
                })
            });

            if (response.ok) {
                const savedClaim = await response.json();
                const updatedClaims = claims.map(c =>
                    c._id === savedClaim._id ? savedClaim : c
                );
                setClaims(updatedClaims);
                calculateStats(updatedClaims);

                // Keep the modal open so they can see it assigned or close it
                setSelectedClaim(savedClaim);
                setSelectedSurveyor('');
            }
        } catch (error) {
            console.error('Error assigning surveyor:', error);
        } finally {
            setAssigningSurveyor(false);
        }
    };

    const openClaimDetails = (claim) => {
        setSelectedClaim(claim);
        setShowDetailsModal(true);
        setActionComment('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            default: return 'warning';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <FaCheckCircle className="text-success" />;
            case 'Rejected': return <FaTimesCircle className="text-danger" />;
            default: return <FaClock className="text-warning" />;
        }
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
        <Container fluid className="officer-dashboard py-4 px-4" style={{ backgroundColor: '#0f0e16', minHeight: '100vh' }}>
            <style>{`
                .officer-dashboard {
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
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                    border-bottom: 2px solid rgba(99, 102, 241, 0.3);
                }

                .claims-table th {
                    color: #818cf8;
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
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
                    border-color: rgba(99, 102, 241, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
                }

                .claims-table tbody tr td:first-child {
                    border-radius: 12px 0 0 12px;
                    font-weight: 700;
                    color: #818cf8;
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
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #818cf8;
                    font-size: 14px;
                }

                .claim-row-action {
                    display: flex;
                    gap: 8px;
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
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15));
                    color: #818cf8;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                }

                .btn-details:hover {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.3));
                    color: #c4b5fd;
                    border-color: rgba(99, 102, 241, 0.6);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
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

                .action-buttons-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }

                .btn-approve {
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex: 1;
                }

                .btn-approve:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
                }

                .btn-reject {
                    background: linear-gradient(135deg, #ef4444, #f87171);
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex: 1;
                }

                .btn-reject:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
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

                .filter-btn {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.8);
                    padding: 10px 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-btn:hover, .filter-btn.active {
                    background: rgba(99, 102, 241, 0.2);
                    border-color: rgba(99, 102, 241, 0.4);
                    color: #818cf8;
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

                .badge-approved {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1));
                    color: #10b981;
                    border-color: rgba(16, 185, 129, 0.3);
                    text-transform: uppercase;
                }

                .badge-rejected {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.1));
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                    text-transform: uppercase;
                }

                .badge-pending {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.1));
                    color: #fbbf24;
                    border-color: rgba(245, 158, 11, 0.3);
                    text-transform: uppercase;
                }
            `}</style>

            {/* Header */}
            <Row className="mb-5 align-items-center">
                <Col md={8}>
                    <h1 className="header-title">
                        <FaUserCheck style={{ fontSize: '28px', color: '#6366f1' }} />
                        Officer Portal
                    </h1>
                    <p className="header-subtitle">Manage and process insurance claims with detailed review</p>
                </Col>
                <Col md={4} className="text-end">
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{user?.fullName}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Officer</div>
                    </div>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="g-3 mb-5">
                <Col md={3} sm={6} xs={12}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#0ea5e9' }}><FaClipboardCheck /></div>
                        <div className="stat-label">Total Claims</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </Col>
                <Col md={3} sm={6} xs={12}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#f59e0b' }}><FaClock /></div>
                        <div className="stat-label">Pending</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                </Col>
                <Col md={3} sm={6} xs={12}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#10b981' }}><FaCheckCircle /></div>
                        <div className="stat-label">Approved</div>
                        <div className="stat-value">{stats.approved}</div>
                    </div>
                </Col>
                <Col md={3} sm={6} xs={12}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#6366f1' }}><FaStar /></div>
                        <div className="stat-label">Approval Rate</div>
                        <div className="stat-value">{stats.approvalRate}%</div>
                    </div>
                </Col>
            </Row>

            {/* Search and Filter */}
            <Row className="mb-4 g-3">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                            <FaSearch />
                        </InputGroup.Text>
                        <input
                            type="text"
                            className="search-box"
                            placeholder="Search by claim ID, vehicle, policy, or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <div className="d-flex gap-2">
                        {['Pending', 'Approved', 'Rejected', 'All'].map(status => (
                            <button
                                key={status}
                                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                <FaFilter className="me-1" />
                                {status}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>

            {/* Claims Table */}
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
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClaims.map(claim => (
                                <tr key={claim._id}>
                                    <td>
                                        <div className="claim-id-cell">
                                            <div className="claim-id-icon">
                                                {claim.status === 'Approved' ? <FaCheckCircle /> : claim.status === 'Rejected' ? <FaTimesCircle /> : <FaClock />}
                                            </div>
                                            <strong>{claim.readableId}</strong>
                                        </div>
                                    </td>
                                    <td>{claim.userName}</td>
                                    <td>{claim.vehicleNumber}</td>
                                    <td>{claim.policyNumber}</td>
                                    <td>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                                    <td><strong>₹{claim.claimAmount.toLocaleString()}</strong></td>
                                    <td>
                                        <Badge className={`badge-custom badge-${claim.status.toLowerCase()}`}>
                                            {getStatusIcon(claim.status)}
                                            {claim.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {claim.status === 'Pending' ? (
                                            <button
                                                className="btn-action btn-details"
                                                onClick={() => openClaimDetails(claim)}
                                            >
                                                <FaFileAlt />
                                                Review
                                            </button>
                                        ) : (
                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '600' }}>
                                                ✓ {claim.status === 'Approved' ? 'Processed' : 'Declined'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><FaClipboardCheck /></div>
                        <div>No claims found matching your filters</div>
                    </div>
                )}
            </div>

            {/* Claim Details Modal */}
            <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                size="lg"
                centered
                className="modal-overlay"
            >
                <div className="modal-content-custom">
                    <Modal.Header className="modal-header-custom" closeButton>
                        <Modal.Title>
                            {selectedClaim?.readableId} - Claim Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '24px', color: 'rgba(255,255,255,0.9)' }}>
                        {selectedClaim && (
                            <>
                                {/* Customer Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Customer Information</h6>
                                    <Row>
                                        <Col md={6}>
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Full Name</div>
                                                <div className="claim-detail-value">{selectedClaim.userName}</div>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Email</div>
                                                <div className="claim-detail-value">{selectedClaim.userEmail}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Vehicle Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Vehicle Information</h6>
                                    <Row>
                                        <Col md={6}>
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Vehicle Number</div>
                                                <div className="claim-detail-value">{selectedClaim.vehicleNumber}</div>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Policy Number</div>
                                                <div className="claim-detail-value">{selectedClaim.policyNumber}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Claim Information */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Claim Information</h6>
                                    <div className="claim-detail-section">
                                        <div className="claim-detail-label">Incident Date</div>
                                        <div className="claim-detail-value">{new Date(selectedClaim.incidentDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="claim-detail-section">
                                        <div className="claim-detail-label">Claim Amount Requested</div>
                                        <div className="claim-detail-value" style={{ fontSize: '18px', fontWeight: '600', color: '#818cf8' }}>
                                            ₹{selectedClaim.claimAmount.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="claim-detail-section">
                                        <div className="claim-detail-label">Incident Description</div>
                                        <div className="claim-detail-value">{selectedClaim.description}</div>
                                    </div>
                                </div>

                                {/* Documents */}
                                {(selectedClaim.policyDocument || selectedClaim.repairEstimate || selectedClaim.firDocument) && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Attached Documents</h6>
                                        {selectedClaim.policyDocument && (
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Policy Document</div>
                                                <button
                                                    onClick={() => { setDocType('Policy Document'); setShowDocDetails(true); }}
                                                    style={{ background: 'none', border: 'none', color: '#6366f1', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    View Document ↗
                                                </button>
                                            </div>
                                        )}
                                        {selectedClaim.repairEstimate && (
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Repair Estimate</div>
                                                <button
                                                    onClick={() => { setDocType('Repair Estimate'); setShowDocDetails(true); }}
                                                    style={{ background: 'none', border: 'none', color: '#6366f1', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    View Document ↗
                                                </button>
                                            </div>
                                        )}
                                        {selectedClaim.firDocument && (
                                            <div className="claim-detail-section" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                                                <div className="claim-detail-label" style={{ color: 'rgba(239,68,68,0.8)' }}>🚔 FIR Document</div>
                                                <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.firDocument}`} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', textDecoration: 'underline' }}>
                                                    View FIR ↗
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Surveyor Assignment */}
                                {selectedClaim.status === 'Pending' && selectedClaim.surveyStatus !== 'Completed' && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Assign Surveyor</h6>
                                        {selectedClaim.surveyorName ? (
                                            <div className="claim-detail-section">
                                                <div className="claim-detail-label">Current Surveyor</div>
                                                <div className="claim-detail-value d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{selectedClaim.surveyorName}</strong> ({selectedClaim.surveyorEmail})
                                                        <Badge bg="info" className="ms-2">{selectedClaim.surveyStatus || 'Assigned'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="claim-detail-section" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="claim-detail-label">Select Surveyor</Form.Label>
                                                    <Form.Select
                                                        value={selectedSurveyor}
                                                        onChange={(e) => setSelectedSurveyor(e.target.value)}
                                                        style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                                                    >
                                                        <option value="">-- Select a Surveyor --</option>
                                                        {surveyors.map(s => (
                                                            <option key={s._id} value={s.email}>{s.fullName} ({s.email})</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                                <Button
                                                    variant="primary"
                                                    disabled={!selectedSurveyor || assigningSurveyor}
                                                    onClick={handleAssignSurveyor}
                                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}
                                                >
                                                    {assigningSurveyor ? 'Assigning...' : 'Assign Surveyor'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Survey Report Details */}
                                {selectedClaim.surveyStatus === 'Completed' && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Surveyor Report</h6>
                                        <div className="claim-detail-section" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                            <div className="claim-detail-label">Surveyor</div>
                                            <div className="claim-detail-value mb-3">{selectedClaim.surveyorName}</div>

                                            <div className="claim-detail-label">Estimated Repair Amount</div>
                                            <div className="claim-detail-value mb-3" style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                                                ₹{selectedClaim.surveyAmount?.toLocaleString()}
                                            </div>

                                            <div className="claim-detail-label">Report Summary</div>
                                            <div className="claim-detail-value mb-3" style={{ whiteSpace: 'pre-wrap' }}>{selectedClaim.surveyReport}</div>

                                            {selectedClaim.surveyDocument && (
                                                <div>
                                                    <div className="claim-detail-label">Survey Document</div>
                                                    <a href={`http://localhost:5000/Pdfs_Data/${selectedClaim.surveyDocument}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981' }}>
                                                        View Survey Document ↗
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Officer Comments */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>Officer Comments</h6>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Add your review comments, findings, or recommendations..."
                                            value={actionComment}
                                            onChange={(e) => setActionComment(e.target.value)}
                                            style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                color: 'rgba(255,255,255,0.8)',
                                                borderRadius: '8px',
                                                padding: '12px'
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons-group">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleClaimAction('approve')}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : '✓ Approve Claim'}
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleClaimAction('reject')}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : '✗ Reject Claim'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                </div>
            </Modal>

            {/* Document Details Modal */}
            <Modal show={showDocDetails} onHide={() => setShowDocDetails(false)} centered size="lg">
                <Modal.Header closeButton style={{ background: '#1e1e2d', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                    <Modal.Title style={{ fontWeight: '700' }}>{docType}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#1e1e2d', color: '#fff', padding: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <p><strong>Name:</strong> Sneha Joshi</p>
                            <p><strong>Address:</strong> Flat No. 402, Sunshine Apartments, MG Road, Pune, Maharashtra - 411001</p>
                            <p><strong>District:</strong> Pune</p>
                            <p><strong>State:</strong> Maharashtra</p>
                            <p><strong>Pincode:</strong> 411001</p>
                            <p><strong>Vehicle Name:</strong> Mahindra XUV300</p>
                            <p><strong>Registration Number:</strong> MH 12 AB 1234</p>
                        </div>
                        <div>
                            <p><strong>Bank:</strong> Punjab National Bank</p>
                            <p><strong>Account Number:</strong> 12345678901234</p>
                            <p><strong>IFSC Code:</strong> PUNB0123456</p>
                            <p><strong>Branch:</strong> Camp Branch, Pune</p>
                            <p><strong>Damage Description:</strong> Front bumper and right headlight heavily damaged due to a minor collision.</p>
                            <p><strong>Approx. Repair Cost:</strong> ₹15,000</p>
                            <p><strong>Salvage:</strong> No</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ background: '#1e1e2d', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button variant="secondary" onClick={() => setShowDocDetails(false)} style={{ borderRadius: '8px' }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OfficerDashboard;
