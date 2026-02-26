import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaUserCircle, FaCreditCard, FaHistory } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <Container className="py-5">
            <h2 className="fw-bold mb-4 text-white">User Dashboard</h2>
            <Row className="g-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm p-3 text-center">
                        <Card.Body>
                            <FaUserCircle className="text-primary display-3 mb-3" />
                            <h4>Khushi</h4>
                            <p className="text-muted">Premium Member</p>
                            <Badge bg="success" className="px-3 py-2 rounded-pill">Active</Badge>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                <FaCreditCard className="me-2 text-primary" /> Active Policy
                            </h5>
                            <hr />
                            <Row>
                                <Col sm={6}>
                                    <p className="mb-1 text-muted">Policy Number</p>
                                    <p className="fw-bold">SD-992384-VH</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="mb-1 text-muted">Vehicle</p>
                                    <p className="fw-bold">Tesla Model 3 (2023)</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="mb-1 text-muted">Next Payment</p>
                                    <p className="fw-bold">March 15, 2026</p>
                                </Col>
                                <Col sm={6}>
                                    <p className="mb-1 text-muted">Amount</p>
                                    <p className="fw-bold text-primary">$59.00</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                <FaHistory className="me-2 text-primary" /> Recent Claims
                            </h5>
                            <hr />
                            <p className="text-center text-muted py-3">No recent claims found.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
