import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaHandshake, FaUserTie } from 'react-icons/fa';

const About = () => {
    return (
        <Container className="py-5 my-5">
            <div className="text-center mb-5 animate-up">
                <h2 className="display-4 fw-bold text-white">About SafeDrive</h2>
                <p className="lead text-secondary opacity-75">Protecting your journey since 2010</p>
            </div>

            <Row className="g-4 align-items-center mb-5">
                <Col lg={6} className="animate-up" style={{ animationDelay: '0.2s' }}>
                    <div className="pe-lg-5">
                        <h3 className="fw-bold mb-4 text-white">Our Mission</h3>
                        <p className="fs-5 text-secondary">
                            At SafeDrive, we believe that everyone deserves peace of mind on the road.
                            Our mission is to simplify vehicle insurance through technology,
                            making coverage accessible, affordable, and transparent for everyone.
                        </p>
                        <p className="text-muted">
                            We've grown from a small startup to one of the country's most trusted
                            insurance providers, serving over 1 million policyholders with pride.
                        </p>
                    </div>
                </Col>
                <Col lg={6} className="animate-up" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-primary-subtle rounded-4 p-5 text-center">
                        <FaShieldAlt className="display-1 text-primary mb-4" />
                        <h4 className="fw-bold text-secondary">100% Secure</h4>
                        <p className="mb-0 text-secondary">Your data and vehicle are in safe hands.</p>
                    </div>
                </Col>
            </Row>

            <Row className="g-4 text-center mt-5">
                <Col md={4} className="animate-up" style={{ animationDelay: '0.6s' }}>
                    <Card className="border-0 shadow-sm p-4 h-100 transition-hover">
                        <Card.Body>
                            <FaHandshake className="display-5 text-primary mb-3" />
                            <h5>Trusted Partners</h5>
                            <p className="text-muted small">Collaborating with workshops nationwide.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="animate-up" style={{ animationDelay: '0.7s' }}>
                    <Card className="border-0 shadow-sm p-4 h-100 transition-hover">
                        <Card.Body>
                            <FaUserTie className="display-5 text-primary mb-3" />
                            <h5>Expert Support</h5>
                            <p className="text-muted small">Our agents are available 24/7 to assist you.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="animate-up" style={{ animationDelay: '0.8s' }}>
                    <Card className="border-0 shadow-sm p-4 h-100 transition-hover">
                        <Card.Body>
                            <FaShieldAlt className="display-5 text-primary mb-3" />
                            <h5>Safe Coverage</h5>
                            <p className="text-muted small">Comprehensive plans tailored to your needs.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
