import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Form, InputGroup, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaSearch, FaFilter, FaCheckCircle, FaClock, FaTasks } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';

const AdminContactUs = ({ onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [savingId, setSavingId] = useState('');
    const [visible, setVisible] = useState(false);

    const fetchMessages = async(showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/contact');
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching contact messages:', error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(true);
        const interval = setInterval(() => fetchMessages(false), 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 80);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleStatusUpdate = async(messageId, status, adminNote) => {
        setSavingId(messageId);
        try {
            await fetch(`http://localhost:5000/api/contact/${messageId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNote })
            });
        } catch (error) {
            console.error('Error updating contact status:', error);
        } finally {
            setSavingId('');
        }
    };

    const filteredMessages = useMemo(() => {
        return messages.filter((item) => {
            const matchQuery =
                item.name?.toLowerCase().includes(query.toLowerCase()) ||
                item.email?.toLowerCase().includes(query.toLowerCase()) ||
                item.subject?.toLowerCase().includes(query.toLowerCase()) ||
                item.message?.toLowerCase().includes(query.toLowerCase());

            const matchStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchQuery && matchStatus;
        });
    }, [messages, query, filterStatus]);

    const stats = useMemo(() => {
        const total = messages.length;
        const newCount = messages.filter((m) => m.status === 'New').length;
        const progress = messages.filter((m) => m.status === 'In Progress').length;
        const resolved = messages.filter((m) => m.status === 'Resolved').length;
        return { total, newCount, progress, resolved };
    }, [messages]);

    const statusBadge = (status) => {
        if (status === 'Resolved') return <Badge bg="success-subtle" className="text-success">Resolved</Badge>;
        if (status === 'In Progress') return <Badge bg="info-subtle" className="text-info">In Progress</Badge>;
        return <Badge bg="warning-subtle" className="text-warning">New</Badge>;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e16' }}>
            <style>{`
                .contact-admin-main {
                    flex: 1;
                    padding: 32px 36px;
                    overflow-y: auto;
                    color: #e2e8f0;
                }
                .fade-card {
                    opacity: 0;
                    transform: translateY(18px);
                    transition: all 0.5s ease;
                }
                .fade-card.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .stat-card-admin {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 16px;
                    transition: 0.25s ease;
                }
                .stat-card-admin:hover {
                    transform: translateY(-2px);
                    border-color: rgba(99,102,241,0.5);
                }
            `}</style>

            <div style={{ width: 240, minWidth: 240, padding: 16 }} className="d-none d-lg-block">
                <AdminSidebar onLogout={onLogout} />
            </div>

            <div className="contact-admin-main">
                <div className={`d-flex justify-content-between align-items-center mb-4 fade-card ${visible ? 'visible' : ''}`}>
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#e2e8f0' }}><FaEnvelope className="me-2 text-primary" /> ContactUs Inbox</h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)' }} className="mb-0">Track customer messages and respond with workflow status</p>
                    </div>
                </div>

                <Row className="g-3 mb-4">
                    <Col md={3}><div className={`stat-card-admin fade-card ${visible ? 'visible' : ''}`}><div style={{ color: '#93c5fd', fontSize: 12 }}>Total Messages</div><div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div></div></Col>
                    <Col md={3}><div className={`stat-card-admin fade-card ${visible ? 'visible' : ''}`}><div style={{ color: '#fbbf24', fontSize: 12 }}>New</div><div style={{ fontSize: 28, fontWeight: 700 }}><FaClock className="me-2" />{stats.newCount}</div></div></Col>
                    <Col md={3}><div className={`stat-card-admin fade-card ${visible ? 'visible' : ''}`}><div style={{ color: '#7dd3fc', fontSize: 12 }}>In Progress</div><div style={{ fontSize: 28, fontWeight: 700 }}><FaTasks className="me-2" />{stats.progress}</div></div></Col>
                    <Col md={3}><div className={`stat-card-admin fade-card ${visible ? 'visible' : ''}`}><div style={{ color: '#86efac', fontSize: 12 }}>Resolved</div><div style={{ fontSize: 28, fontWeight: 700 }}><FaCheckCircle className="me-2" />{stats.resolved}</div></div></Col>
                </Row>

                <Card className={`fade-card ${visible ? 'visible' : ''}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Card.Header style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <Row className="g-3 align-items-center">
                            <Col md={7}>
                                <InputGroup style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999 }}>
                                    <InputGroup.Text className="bg-transparent border-0 text-muted"><FaSearch /></InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search name, email, subject, message"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        className="bg-transparent border-0 text-white"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={5}>
                                <div className="d-flex gap-2 justify-content-md-end">
                                    <Button variant={filterStatus === 'All' ? 'primary' : 'outline-light'} size="sm" onClick={() => setFilterStatus('All')}><FaFilter className="me-1" />All</Button>
                                    <Button variant={filterStatus === 'New' ? 'warning' : 'outline-warning'} size="sm" onClick={() => setFilterStatus('New')}>New</Button>
                                    <Button variant={filterStatus === 'In Progress' ? 'info' : 'outline-info'} size="sm" onClick={() => setFilterStatus('In Progress')}>In Progress</Button>
                                    <Button variant={filterStatus === 'Resolved' ? 'success' : 'outline-success'} size="sm" onClick={() => setFilterStatus('Resolved')}>Resolved</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>

                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5"><Spinner animation="border" className="text-primary" /></div>
                        ) : (
                            <Table responsive variant="dark" className="mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Admin Note</th>
                                        <th>Time</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.subject}</td>
                                            <td style={{ maxWidth: 260, whiteSpace: 'normal' }}>{item.message}</td>
                                            <td>{statusBadge(item.status)}</td>
                                            <td style={{ minWidth: 220 }}>
                                                <Form.Control
                                                    defaultValue={item.adminNote || ''}
                                                    placeholder="Optional note"
                                                    className="bg-dark text-light border-secondary"
                                                    onBlur={(event) => {
                                                        const newNote = event.target.value;
                                                        if (newNote !== (item.adminNote || '')) {
                                                            handleStatusUpdate(item._id, item.status, newNote);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                                            <td>
                                                <Form.Select
                                                    value={item.status}
                                                    className="bg-dark text-light border-secondary"
                                                    onChange={(event) => handleStatusUpdate(item._id, event.target.value, item.adminNote || '')}
                                                    disabled={savingId === item._id}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Resolved">Resolved</option>
                                                </Form.Select>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMessages.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-5 text-muted">No contact records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default AdminContactUs;
