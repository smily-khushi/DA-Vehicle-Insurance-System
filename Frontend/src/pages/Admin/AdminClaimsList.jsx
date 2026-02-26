import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload, FaFilePdf, FaShieldAlt, FaFileInvoice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminClaimsList = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClaims = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/claims');
            const data = await response.json();
            setClaims(data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await fetch(`http://localhost:5000/uploads/${filename}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    };

    React.useEffect(() => {
        fetchClaims();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return <Badge bg="success-subtle" className="text-success rounded-pill px-3">Approved</Badge>;
            case 'Pending': return <Badge bg="warning-subtle" className="text-warning rounded-pill px-3">Pending</Badge>;
            case 'Rejected': return <Badge bg="danger-subtle" className="text-danger rounded-pill px-3">Rejected</Badge>;
            default: return <Badge bg="secondary-subtle" className="text-secondary rounded-pill px-3">{status}</Badge>;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16' }}>
            <div style={{ width: 240, minWidth: 240, padding: 16 }} className="d-none d-lg-block">
                <AdminSidebar onLogout={onLogout} />
            </div>
            <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', color: '#e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#e2e8f0' }}>Claims Management</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)' }} className="mb-0">Review and process insurance claims</p>
                    </div>
                    <Button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }} className="rounded-pill px-4 fw-bold shadow-sm">
                        <FaDownload className="me-2" /> Export Report
                    </Button>
                </div>

                <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="py-4 px-4 border-0" style={{ background: 'transparent' }}>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <InputGroup style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', padding: '0 16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search by Claim ID, User or Vehicle..."
                                        className="bg-transparent border-0 shadow-none py-2 text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={6} className="text-md-end mt-3 mt-md-0">
                                <Button variant="outline-light" className="rounded-pill px-3 me-2 border-secondary-subtle">
                                    <FaFilter className="me-2 text-primary" /> Filter
                                </Button>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'small' }}>Showing {claims.length} claims</span>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover variant="dark" className="mb-0 text-white bg-transparent">
                            <thead style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                <tr>
                                    <th className="px-4 py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Claim ID</th>
                                    <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer</th>
                                    <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vehicle Details</th>
                                    <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                    <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Submission Date</th>
                                    <th className="px-4 py-3 border-0 text-end" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.filter(c =>
                                    c.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    c.userName.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((claim, index) => (
                                    <tr key={claim._id} className="align-middle bg-transparent" style={{ borderColor: 'rgba(255, 255, 255, 0.04)', background: 'transparent' }}>
                                        <td className="px-4 py-4 fw-bold bg-transparent" style={{ color: '#c7d2fe' }}>
                                            <div className="fw-bold mb-1" style={{ color: '#c7d2fe', letterSpacing: '0.5px' }}>
                                                {claim.readableId || `#${claim._id.substring(claim._id.length - 8).toUpperCase()}`}
                                            </div>
                                        </td>
                                        <td className="py-4 bg-transparent">
                                            <div className="fw-bold" style={{ color: '#f8fafc' }}>{claim.userName}</div>
                                            <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 'small' }}>{claim.userEmail}</div>
                                        </td>
                                        <td className="py-4 bg-transparent">
                                            <div style={{ color: '#f8fafc' }}>{claim.vehicleNumber}</div>
                                            <Badge bg="secondary" className="text-white border-0 small fw-normal" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>Policy: {claim.policyNumber}</Badge>
                                            <div className="mt-1 d-flex gap-2">
                                                {claim.policyDocument && (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Badge
                                                            bg="info-subtle"
                                                            className="text-info border-0 py-1 px-2 cursor-pointer d-flex align-items-center transition-hover"
                                                            style={{ fontSize: '10px', background: 'rgba(13, 202, 240, 0.1)', cursor: 'pointer' }}
                                                            onClick={() => handleDownload(claim.policyDocument)}
                                                        >
                                                            <FaShieldAlt className="me-1" /> Policy <FaDownload className="ms-1 small" size={8} />
                                                        </Badge>
                                                    </div>
                                                )}
                                                {claim.repairEstimate && (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Badge
                                                            bg="success-subtle"
                                                            className="text-success border-0 py-1 px-2 cursor-pointer d-flex align-items-center transition-hover"
                                                            style={{ fontSize: '10px', background: 'rgba(25, 135, 84, 0.1)', cursor: 'pointer' }}
                                                            onClick={() => handleDownload(claim.repairEstimate)}
                                                        >
                                                            <FaFileInvoice className="me-1" /> Estimate <FaDownload className="ms-1 small" size={8} />
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 bg-transparent">{getStatusBadge(claim.status)}</td>
                                        <td className="py-4 bg-transparent" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'small' }}>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-end bg-transparent">
                                            <Button
                                                as={Link}
                                                to={`/admin/claims/${claim._id}`}
                                                variant="outline-light"
                                                size="sm"
                                                className="rounded-pill px-3 fw-bold border-secondary-subtle"
                                            >
                                                <FaEye className="me-1 text-primary" /> View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {claims.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">No claims found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="py-3 border-0 text-center" style={{ background: 'transparent' }}>
                        <Button variant="link" className="text-decoration-none fw-bold text-primary">Load More Claims</Button>
                    </Card.Footer>
                </Card>
            </div>
        </div >
    );
};

export default AdminClaimsList;
