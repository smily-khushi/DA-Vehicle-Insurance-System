import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Tabs, Tab } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaFilePdf, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaCar, FaMapMarkerAlt, FaFileAlt, FaShieldAlt, FaFileInvoice } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';

const AdminClaimDetails = ({ onLogout }) => {
    const { id } = useParams();
    const [status, setStatus] = useState('Pending');
    const [claimData, setClaimData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchClaimDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/claims/${id}`);
            const data = await response.json();
            setClaimData(data);
            setStatus(data.status);
        } catch (error) {
            console.error('Error fetching claim details:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchClaimDetails();
    }, [id]);

    const handleDownload = async (filename) => {
        if (!filename) return;
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

    if (loading) return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!claimData) return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <h3>Claim not found</h3>
        </div>
    );

    // Prepare documents from real data
    const documents = [];
    if (claimData.policyDocument) {
        documents.push({ name: 'Insurance Policy Doc', file: claimData.policyDocument, type: 'Policy' });
    }
    if (claimData.repairEstimate) {
        documents.push({ name: 'Repair Cost Estimate', file: claimData.repairEstimate, type: 'Estimate' });
    }

    const handleStatusUpdate = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/claims/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setStatus(newStatus);
                alert(`Claim ${newStatus} successfully!`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16' }}>
            <div style={{ width: 240, minWidth: 240, padding: 16 }} className="d-none d-lg-block">
                <AdminSidebar onLogout={onLogout} />
            </div>
            <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', color: '#e2e8f0' }}>
                <div className="mb-4">
                    <Link to="/admin/claims" className="text-decoration-none text-muted fw-bold small d-flex align-items-center">
                        <FaArrowLeft className="me-2" /> Back to All Claims
                    </Link>
                </div>

                <div className="d-flex justify-content-between align-items-start mb-5">
                    <div>
                        <div className="d-flex align-items-center mb-2">
                            <h2 className="fw-bold mb-0 me-3" style={{ color: '#e2e8f0' }}>Claim ID: {claimData.readableId || claimData._id.substring(claimData._id.length - 8).toUpperCase()}</h2>
                            <Badge bg={status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'} className="px-3 py-2 rounded-pill">
                                {status}
                            </Badge>
                        </div>
                        <p className="text-secondary mb-0">Submitted by {claimData.userName}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-danger" className="rounded-pill px-4" onClick={() => handleStatusUpdate('Rejected')}>
                            <FaTimesCircle className="me-2" /> Reject
                        </Button>
                        <Button variant="success" className="rounded-pill px-4 shadow-sm" onClick={() => handleStatusUpdate('Approved')}>
                            <FaCheckCircle className="me-2" /> Approve Claim
                        </Button>
                    </div>
                </div>

                <Row className="g-4">
                    <Col lg={8}>
                        {/* Incident Details Card */}
                        <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 mb-4 p-2">
                            <Card.Body>
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#f8fafc' }}>
                                    <FaMapMarkerAlt className="text-primary me-2" /> Incident Overview
                                </h5>
                                <Row className="g-4 mb-4">
                                    <Col md={6}>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Incident Date</p>
                                        <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{new Date(claimData.incidentDate).toLocaleDateString()}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Vehicle Number</p>
                                        <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{claimData.vehicleNumber}</p>
                                    </Col>
                                </Row>
                                <hr style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />
                                <div className="mt-4">
                                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Description</p>
                                    <p style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'rgba(255, 255, 255, 0.9)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>{claimData.description}</p>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Documents Card */}
                        <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 p-2">
                            <Card.Body>
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#f8fafc' }}>
                                    <FaFileAlt className="text-primary me-2" /> Submitted Documents
                                </h5>
                                <Table responsive hover variant="dark" className="mb-0 text-white bg-transparent">
                                    <thead style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                        <tr>
                                            <th className="border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Document Name</th>
                                            <th className="border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Size</th>
                                            <th className="border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</th>
                                            <th className="border-0 text-end" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((doc, index) => (
                                            <tr key={index} className="align-middle bg-transparent" style={{ borderColor: 'rgba(255, 255, 255, 0.04)', background: 'transparent' }}>
                                                <td className="py-3 fw-medium bg-transparent" style={{ color: '#f8fafc' }}>
                                                    {doc.type === 'Policy' ? <FaShieldAlt className="text-primary me-2" /> : <FaFileInvoice className="text-success me-2" />}
                                                    {doc.name}
                                                </td>
                                                <td className="py-3 bg-transparent" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'small' }}>PDF</td>
                                                <td className="py-3 bg-transparent">
                                                    <Badge bg="secondary" className="text-white border-0 fw-normal small" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>{doc.type}</Badge>
                                                </td>
                                                <td className="py-3 text-end bg-transparent">
                                                    <Button variant="link" className="text-primary p-0 text-decoration-none fw-bold small" onClick={() => handleDownload(doc.file)}>
                                                        <FaDownload className="me-1" /> View/Download
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* User Info Card */}
                        <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 mb-4 p-2">
                            <Card.Body>
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#f8fafc' }}>
                                    <FaUser className="text-primary me-2" /> Customer Info
                                </h5>
                                <div className="d-flex align-items-center mb-4 text-center flex-column">
                                    <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', height: '64px', width: '64px' }} className="rounded-circle d-flex align-items-center justify-content-center mb-3 fs-3">
                                        <FaUser />
                                    </div>
                                    <h5 className="fw-bold mb-1" style={{ color: '#f8fafc' }}>{claimData.userName}</h5>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'small' }}>{claimData.userEmail}</p>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }} className="mt-4">
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Email</p>
                                            <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{claimData.userEmail}</p>
                                        </Col>
                                        <Col xs={12}>
                                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Policy ID</p>
                                            <p className="fw-bold mb-0" style={{ color: '#c7d2fe' }}>{claimData.policyNumber}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Vehicle/Policy Info Card */}
                        <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 p-2">
                            <Card.Body>
                                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#f8fafc' }}>
                                    <FaCar className="text-primary me-2" /> Policy & Vehicle
                                </h5>
                                <div className="p-2">
                                    <div className="mb-3">
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Vehicle Number</p>
                                        <p className="fw-bold mb-0" style={{ color: '#f8fafc' }}>{claimData.vehicleNumber}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'x-small', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Policy Link</p>
                                        <p className="fw-bold mb-0" style={{ color: '#c7d2fe' }}>{claimData.policyNumber}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AdminClaimDetails;
