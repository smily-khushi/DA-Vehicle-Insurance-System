import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaShieldAlt, FaCheckCircle, FaStar, FaCarCrash } from 'react-icons/fa';

const HeroSection = () => {
    return (
        <div className="hero-section py-5 mb-5 overflow-hidden">
            <div className="hero-shape shape-1 animate-pulse"></div>
            <div className="hero-shape shape-2 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <Container className="position-relative py-5">
                <Row className="align-items-center g-5">
                    <Col lg={7} className="text-center text-lg-start mb-5 mb-lg-0">
                        <Badge bg="rgba(99, 102, 241, 0.1)" className="text-primary px-3 py-2 rounded-pill mb-4 border border-primary border-opacity-25 animate-up" style={{ animationDelay: '0.2s' }}>
                            <FaStar className="me-2" /> Top Rated Vehicle Insurance 2024
                        </Badge>

                        <h1 className="display-3 fw-bold mb-4 lh-sm animate-up text-white" style={{ animationDelay: '0.3s' }}>
                            Your Journey, <span className="text-gradient">Fully Protected</span>
                        </h1>

                        <p className="lead mb-5 text-secondary fs-4 animate-up" style={{ animationDelay: '0.4s' }}>
                            Drive with confidence. Get customized vehicle insurance plans with
                            comprehensive coverage and 24/7 priority support.
                        </p>

                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start animate-up" style={{ animationDelay: '0.5s' }}>
                            <Button
                                size="lg"
                                variant="primary"
                                className="px-5 py-3 rounded-pill fw-bold shadow"
                                as={Link}
                                to="/vehicle-insurance"
                            >
                                Get a Quote Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline-light"
                                className="px-5 py-3 rounded-pill fw-bold border-2"
                                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                View Plans
                            </Button>
                        </div>

                        <div className="mt-5 d-flex gap-4 justify-content-center justify-content-lg-start animate-up" style={{ animationDelay: '0.6s' }}>
                            <div className="d-flex align-items-center text-muted">
                                <FaCheckCircle className="text-success me-2" />
                                <span className="small fw-medium">Instant Policy</span>
                            </div>
                            <div className="d-flex align-items-center text-muted">
                                <FaCheckCircle className="text-success me-2" />
                                <span className="small fw-medium">Paperless Process</span>
                            </div>
                        </div>
                    </Col>

                    <Col lg={5} className="hero-image-container d-none d-lg-block">
                        <div className="position-relative animate-float">
                            <div className="rounded-4 overflow-hidden glass-panel p-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '400px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}>
                                    <FaShieldAlt className="display-1 text-primary opacity-25" />
                                </div>
                            </div>

                            {/* Floating Dynamic Cards */}
                            <div className="hero-card-floating position-absolute" style={{ top: '10%', left: '-15%', padding: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                                <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                                        <FaCheckCircle className="text-success fs-5" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold text-white small">Claim Settled</h6>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>Just 2 hours ago</small>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-card-floating position-absolute" style={{ bottom: '10%', right: '-5%', padding: '1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                                <div className="d-flex align-items-center">
                                    <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                                        <FaCarCrash className="text-warning fs-5" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold text-white small">24/7 RSA</h6>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>Road Side Assistance</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HeroSection;
