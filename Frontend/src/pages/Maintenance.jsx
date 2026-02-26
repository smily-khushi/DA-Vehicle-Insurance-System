import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaTools, FaExclamationTriangle } from 'react-icons/fa';

const Maintenance = () => {
    return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <Row className="text-center w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <div className="p-5 rounded-5 shadow-lg glass-panel animate-up">
                        <FaTools className="display-1 text-primary mb-4 animate-float" />
                        <h1 className="fw-bold mb-3 display-5 text-white">System Maintenance</h1>
                        <p className="lead text-secondary mb-5">
                            We're currently making SafeDrive even better. The website will be back online shortly. We apologize for the inconvenience.
                        </p>
                        <div className="alert bg-warning-subtle text-warning border-0 rounded-4 p-3 mb-5 d-flex align-items-center justify-content-center">
                            <FaExclamationTriangle className="me-2" />
                            <strong>Maintenance Mode is Active</strong>
                        </div>
                        <Button variant="outline-primary" className="px-5 rounded-pill fw-bold py-3" onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Maintenance;
