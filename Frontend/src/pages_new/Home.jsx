import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import HeroSection from '../components/HeroSection';
import InsuranceCard from '../components/InsuranceCard';

const Home = () => {
    const plans = [
        {
            title: 'Basic Cover',
            price: '29',
            features: ['Third-party Liability', 'Personal Accident Cover', 'Fire & Theft Support', '24/7 Roadside Assistance'],
            recommended: false
        },
        {
            title: 'Standard Plan',
            price: '59',
            features: ['Basic Cover Features', 'Comprehensive Damage', 'Natural Calamity Cover', 'Glass & Mirror Protection', 'Zero Depreciation'],
            recommended: true
        },
        {
            title: 'Premium Shield',
            price: '99',
            features: ['Standard Plan Features', 'Engine Protection', 'Consumables Cover', 'Key Replacement', 'International Roadside Assistance'],
            recommended: false
        }
    ];

    return (
        <div style={{ background: '#0f0e16', color: '#e2e8f0', minHeight: '100vh' }}>
            <HeroSection />

            <Container id="plans" className="py-5">
                <div className="text-center mb-5 mt-4">
                    <h2 className="fw-bold display-5 mb-3" style={{ background: 'linear-gradient(90deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Our Insurance Plans
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.2rem' }}>Choose the perfect protection for your vehicle</p>
                </div>

                <Row className="g-4">
                    {plans.map((plan, index) => (
                        <Col key={index} lg={4} md={6}>
                            <InsuranceCard {...plan} />
                        </Col>
                    ))}
                </Row>
            </Container>

            <div className="mt-5 py-5" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Container>
                    <div className="p-5 rounded-4 text-center text-md-start glass-panel">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Ready to protect your vehicle?</h2>
                                <p className="mb-0 fs-5" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Join over 1 million happy customers who trust SafeDrive.</p>
                            </Col>
                            <Col md={4} className="text-md-end mt-4 mt-md-0">
                                <Link to="/vehicle-insurance" className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}>
                                    Get Started
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Home;
