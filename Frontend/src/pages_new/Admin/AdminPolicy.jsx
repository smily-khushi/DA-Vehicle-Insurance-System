import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Badge, Card } from 'react-bootstrap';
import { FaFileImport, FaPlus, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';

const AdminPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [showImport, setShowImport] = useState(false);
    const [file, setFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/policies');
            const data = await response.json();
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/policies/import', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchPolicies();
                setShowImport(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error importing file');
        } finally {
            setLoading(false);
        }
    };

    const filteredPolicies = policies.filter(p =>
        p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.planName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16' }}>
            <div style={{ width: 240, minWidth: 240, padding: 16 }} className="d-none d-lg-block">
                <AdminSidebar />
            </div>
            <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', color: '#e2e8f0' }}>
                <Container fluid>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold m-0" style={{ color: '#e2e8f0' }}>Policy Management</h2>
                        <div className="d-flex gap-2">
                            <Button variant="outline-light" className="border-secondary-subtle" onClick={() => setShowImport(true)}>
                                <FaFileImport className="me-2 text-primary" /> Import CSV/Excel
                            </Button>
                            <Button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}>
                                <FaPlus className="me-2" /> Add New Policy
                            </Button>
                        </div>
                    </div>

                    <Card style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }} className="shadow-sm rounded-4 overflow-hidden mb-4">
                        <Card.Body className="p-0">
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                                <div className="input-group" style={{ maxWidth: '350px' }}>
                                    <span className="input-group-text border-end-0" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.4)' }}>
                                        <FaSearch />
                                    </span>
                                    <Form.Control
                                        placeholder="Search by policy # or name..."
                                        className="border-start-0 shadow-none ps-0"
                                        style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'small' }}>
                                    Total Policies: {policies.length}
                                </div>
                            </div>
                            <Table responsive hover variant="dark" className="mb-0 text-white bg-transparent">
                                <thead style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                    <tr style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                                        <th className="px-4 py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Policy Number</th>
                                        <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</th>
                                        <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Plan Name</th>
                                        <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium</th>
                                        <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</th>
                                        <th className="py-3 border-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Features</th>
                                        <th className="py-3 border-0 text-center" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPolicies.map((p) => (
                                        <tr key={p._id} className="align-middle bg-transparent" style={{ borderColor: 'rgba(255, 255, 255, 0.04)', background: 'transparent' }}>
                                            <td className="px-4 py-3 fw-bold bg-transparent" style={{ color: '#c7d2fe' }}>{p.policyNumber}</td>
                                            <td className="py-3 bg-transparent">
                                                <Badge bg={p.type === 'Car' ? 'info' : 'warning'} className="rounded-pill px-3" style={{ opacity: 0.9 }}>
                                                    {p.type}
                                                </Badge>
                                            </td>
                                            <td className="py-3 fw-medium bg-transparent" style={{ color: '#f8fafc' }}>{p.planName}</td>
                                            <td className="py-3 fw-bold text-white bg-transparent">${p.premium}</td>
                                            <td className="py-3 bg-transparent" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{p.duration}</td>
                                            <td className="py-3 bg-transparent">
                                                <div className="d-flex gap-1 flex-wrap">
                                                    {p.features.slice(0, 2).map((f, i) => (
                                                        <Badge key={i} bg="secondary" className="text-white fw-normal rounded-pill" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                                                            {f}
                                                        </Badge>
                                                    ))}
                                                    {p.features.length > 2 && <span className="small" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>+{p.features.length - 2}</span>}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center bg-transparent">
                                                <Button size="sm" variant="link" className="text-primary text-decoration-none me-2">Edit</Button>
                                                <Button size="sm" variant="link" className="text-danger text-decoration-none">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
            {/* Import Modal */}
            <Modal show={showImport} onHide={() => setShowImport(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Import Policies</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleImport}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Upload File (CSV or XLSX)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv, .xlsx"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                            <Form.Text className="text-muted">
                                File should have headers: policyNumber, type, planName, premium, duration, description, features (comma separated).
                            </Form.Text>
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading || !file}>
                                {loading ? 'Importing...' : 'Start Import'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminPolicy;
