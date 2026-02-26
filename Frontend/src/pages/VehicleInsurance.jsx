import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Tabs, Tab, Accordion, Card, Badge } from 'react-bootstrap';
import { FaCar, FaMotorcycle, FaShieldAlt, FaClock, FaCheckCircle, FaPercentage, FaMobileAlt } from 'react-icons/fa';

const VehicleInsurance = ({ user }) => {
    const [regNumber, setRegNumber] = useState('');
    const [activeTab, setActiveTab] = useState('car');
    const navigate = useNavigate();

    // Claim Form State
    const [claimStep, setClaimStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submittedClaim, setSubmittedClaim] = useState(null);
    const [claimData, setClaimData] = useState({
        policyNumber: '',
        vehicleReg: '',
        incidentDate: '',
        incidentLocation: '',
        description: ''
    });

    const [files, setFiles] = useState({
        policyDocument: null,
        repairEstimate: null
    });

    const handleClaimChange = (e) => {
        setClaimData({ ...claimData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleClaimSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please login to raise a claim.');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('policyNumber', claimData.policyNumber);
            formData.append('userName', user.fullName);
            formData.append('userEmail', user.email);
            formData.append('vehicleNumber', claimData.vehicleReg);
            formData.append('incidentDate', claimData.incidentDate);
            formData.append('description', `Location: ${claimData.incidentLocation}. ${claimData.description}`);

            if (files.policyDocument) {
                formData.append('policyDocument', files.policyDocument);
            }
            if (files.repairEstimate) {
                formData.append('repairEstimate', files.repairEstimate);
            }

            const response = await fetch('http://localhost:5000/api/claims', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setSubmittedClaim(data);
                setSubmitSuccess(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error submitting claim. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setClaimStep(claimStep + 1);
    const prevStep = () => setClaimStep(claimStep - 1);

    const benefits = [
        {
            icon: <FaShieldAlt className="text-primary display-6 mb-3" />,
            title: "Super Fast Claims",
            description: "Most of our claims are settled instantly or within a few hours."
        },
        {
            icon: <FaPercentage className="text-success display-6 mb-3" />,
            title: "Zero Commission",
            description: "Buy directly from us and save up to 70% on your premium."
        },
        {
            icon: <FaClock className="text-info display-6 mb-3" />,
            title: "100% Digital",
            description: "No paperwork. Everything from buying to claims is handled on your phone."
        },
        {
            icon: <FaCheckCircle className="text-warning display-6 mb-3" />,
            title: "Trusted by Millions",
            description: "Over 5 million happy customers trust us with their vehicle protection."
        }
    ];

    const faqs = [
        {
            q: "What documents are required to buy vehicle insurance?",
            a: "With SafeDrive, you don't need any physical documents. Just your vehicle registration number and previous policy details (if any) are enough to get started."
        },
        {
            q: "Does my insurance cover damage from natural calamities?",
            a: "Yes, our Comprehensive and Standard plans cover damages caused by floods, earthquakes, storms, and other natural disasters."
        },
        {
            q: "What is Zero Depreciation cover?",
            a: "Zero Dep means you get the full claim amount without any deduction for depreciation on replaced parts. It's highly recommended for new vehicles."
        },
        {
            q: "How do I renew my expired policy?",
            a: "Refining your expired policy is easy. Just enter your registration number, and we might require a quick inspection (which can often be done via our app) before renewing."
        }
    ];

    return (
        <div className="vehicle-insurance-page pb-5">
            {/* Hero Section */}
            <div className="py-5 mb-5 border-bottom border-opacity-10 border-white" style={{ background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7} className="mb-4 mb-lg-0 animate-up">
                            <h1 className="display-4 fw-bold mb-3 text-white">Vehicle Insurance made <span className="text-gradient">Incredibly Easy</span></h1>
                            <p className="lead text-secondary opacity-75 mb-4">Save up to ₹5,000 on car insurance and ₹1,500 on bike insurance. Buy in just 2 minutes.</p>

                            <Card className="border-0 shadow-lg p-3 p-md-4 rounded-4 glass-panel">
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k)}
                                    className="mb-4 custom-tabs border-0"
                                >
                                    <Tab eventKey="car" title={<span><FaCar className="me-2" /> Car</span>}>
                                        <div className="py-2">
                                            <h5 className="mb-3 text-white">Enter Car Registration Number</h5>
                                            <div className="d-sm-flex gap-2">
                                                <Form.Control
                                                    size="lg"
                                                    placeholder="e.g. MH 01 AB 1234"
                                                    className="mb-2 mb-sm-0 border-2 rounded-3 text-uppercase fw-bold"
                                                    value={regNumber}
                                                    onChange={(e) => setRegNumber(e.target.value)}
                                                />
                                                <Button variant="primary" size="lg" className="px-5 rounded-3 fw-bold">
                                                    View Prices
                                                </Button>
                                            </div>
                                            <small className="text-muted mt-2 d-inline-block">Or <Link to="#" className="text-decoration-none">continue without number</Link></small>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="bike" title={<span><FaMotorcycle className="me-2" /> Bike</span>}>
                                        <div className="py-2">
                                            <h5 className="mb-3 text-white">Enter Bike Registration Number</h5>
                                            <div className="d-sm-flex gap-2">
                                                <Form.Control
                                                    size="lg"
                                                    placeholder="e.g. MH 12 CD 5678"
                                                    className="mb-2 mb-sm-0 border-2 rounded-3 text-uppercase fw-bold"
                                                    value={regNumber}
                                                    onChange={(e) => setRegNumber(e.target.value)}
                                                />
                                                <Button variant="primary" size="lg" className="px-5 rounded-3 fw-bold">
                                                    View Prices
                                                </Button>
                                            </div>
                                            <small className="text-muted mt-2 d-inline-block">Or <Link to="#" className="text-decoration-none">continue without number</Link></small>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card>
                        </Col>
                        <Col lg={5} className="text-center d-none d-lg-block animate-float">
                            <div className="p-5 glass-panel rounded-circle shadow-sm d-inline-block border border-primary border-opacity-25">
                                {activeTab === 'car' ? (
                                    <FaCar className="display-1 text-primary animate-float" />
                                ) : (
                                    <FaMotorcycle className="display-1 text-primary animate-float" />
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Benefits Section */}
            <Container className="py-5">
                <div className="text-center mb-5 animate-up">
                    <Badge bg="rgba(99, 102, 241, 0.1)" className="text-primary px-3 py-2 rounded-pill mb-3 border border-primary border-opacity-25">Why SafeDrive?</Badge>
                    <h2 className="fw-bold text-white">Insurance that actually works for you</h2>
                </div>
                <Row>
                    {benefits.map((benefit, index) => (
                        <Col md={3} sm={6} key={index} className="mb-4 text-center animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="p-4 h-100 rounded-4 glass-panel transition-hover">
                                {benefit.icon}
                                <h5 className="fw-bold mb-3 text-white">{benefit.title}</h5>
                                <p className="text-secondary opacity-75 small">{benefit.description}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Process Section */}
            <div className="py-5" style={{ background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={10} className="mx-auto">
                            <h2 className="display-5 fw-bold mb-5 text-center text-white">Buy insurance in 3 simple steps</h2>
                            <Row>
                                <Col md={4} className="mb-4">
                                    <div className="process-step text-center px-3">
                                        <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>1</div>
                                        <h5 className="fw-bold text-white">Enter Details</h5>
                                        <p className="text-secondary opacity-75">Just your registration number or minor details about your car/bike.</p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div className="process-step text-center px-3">
                                        <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>2</div>
                                        <h5 className="fw-bold text-white">Choose a Plan</h5>
                                        <p className="text-secondary opacity-75">Select from basic liability or comprehensive plans that fit your budget.</p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div className="process-step text-center px-3">
                                        <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>3</div>
                                        <h5 className="fw-bold text-white">Pay & Get Policy</h5>
                                        <p className="text-secondary opacity-75">Make the payment and get your policy document instantly in your email.</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Claim Section */}
            <Container className="py-5 my-5">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="claim-container p-4 p-md-5 rounded-4 shadow-lg glass-panel animate-up">
                            <div className="text-center mb-5">
                                <Badge bg="rgba(239, 68, 68, 0.1)" className="text-danger px-3 py-2 rounded-pill mb-3 border border-danger border-opacity-25">Claim Process</Badge>
                                <h2 className="fw-bold mb-3 text-white">Need to Raise a Claim?</h2>
                                <p className="text-secondary opacity-75">Follow our simple 3-step process to get your claim processed instantly.</p>

                                {submitSuccess ? null : (
                                    <div className="d-flex justify-content-center gap-2 mt-4 claim-steps-indicator">
                                        {[1, 2, 3].map(step => (
                                            <div key={step} className={`step-dot ${claimStep >= step ? 'active' : ''} ${claimStep > step ? 'completed' : ''}`}>
                                                {claimStep > step ? '✓' : step}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {submitSuccess ? (
                                <div className="text-center py-5 animate-up">
                                    <div className="success-icon mb-4 mx-auto" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>✓</div>
                                    <h3 className="fw-bold mb-3 text-white">Claim Submitted Successfully!</h3>
                                    <p className="text-secondary opacity-75 mb-4">Your claim ID is <span className="text-gradient fw-bold" style={{ letterSpacing: '1px' }}>{submittedClaim?.readableId || `#${submittedClaim?._id.substring(submittedClaim._id.length - 6).toUpperCase()}`}</span>. We will review your documents and get back to you within 24 hours.</p>
                                    <Button variant="primary" onClick={() => { setSubmitSuccess(false); setClaimStep(1); }}>
                                        Raise Another Claim
                                    </Button>
                                </div>
                            ) : (
                                <Form onSubmit={handleClaimSubmit}>
                                    {claimStep === 1 && (
                                        <div className="animate-fade-in">
                                            <h4 className="fw-bold mb-4">Step 1: Policy Information</h4>
                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group controlId="policyNumber">
                                                        <Form.Label>Policy Number</Form.Label>
                                                        <Form.Control
                                                            name="policyNumber"
                                                            required
                                                            placeholder="e.g. POL-12345678"
                                                            value={claimData.policyNumber}
                                                            onChange={handleClaimChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group controlId="vehicleReg">
                                                        <Form.Label>Vehicle Registration Number</Form.Label>
                                                        <Form.Control
                                                            name="vehicleReg"
                                                            required
                                                            placeholder="e.g. MH 01 AB 1234"
                                                            value={claimData.vehicleReg}
                                                            onChange={handleClaimChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end mt-4">
                                                <Button variant="primary" onClick={nextStep} disabled={!claimData.policyNumber || !claimData.vehicleReg}>
                                                    Next Step
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {claimStep === 2 && (
                                        <div className="animate-fade-in">
                                            <h4 className="fw-bold mb-4">Step 2: Incident Details</h4>
                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group controlId="incidentDate">
                                                        <Form.Label>Date of Incident</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            name="incidentDate"
                                                            required
                                                            value={claimData.incidentDate}
                                                            onChange={handleClaimChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Form.Group controlId="incidentLocation">
                                                        <Form.Label>Location</Form.Label>
                                                        <Form.Control
                                                            name="incidentLocation"
                                                            required
                                                            placeholder="City, Area"
                                                            value={claimData.incidentLocation}
                                                            onChange={handleClaimChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12} className="mb-3">
                                                    <Form.Group controlId="description">
                                                        <Form.Label>Describe what happened</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            name="description"
                                                            required
                                                            placeholder="Brief description of the accident/damage"
                                                            value={claimData.description}
                                                            onChange={handleClaimChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-between mt-4">
                                                <Button variant="outline-secondary" onClick={prevStep}>
                                                    Back
                                                </Button>
                                                <Button variant="primary" onClick={nextStep} disabled={!claimData.incidentDate || !claimData.description}>
                                                    Next Step
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {claimStep === 3 && (
                                        <div className="animate-fade-in">
                                            <h4 className="fw-bold mb-4">Step 3: Upload Documents</h4>
                                            <Row>
                                                <Col md={6} className="mb-4">
                                                    <div className="file-upload-box p-4 text-center rounded-4 glass-panel transition-hover" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                                        <FaShieldAlt className="display-6 text-primary mb-3" />
                                                        <h6 className="fw-bold text-white">Insurance Policy Document</h6>
                                                        <p className="small text-secondary opacity-75 mb-3">Upload your policy (PDF or Image)</p>
                                                        <Form.Control
                                                            name="policyDocument"
                                                            type="file"
                                                            accept=".pdf,image/*"
                                                            onChange={handleFileChange}
                                                            className="bg-transparent border-white border-opacity-10 text-secondary"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6} className="mb-4">
                                                    <div className="file-upload-box p-4 text-center rounded-4 glass-panel transition-hover" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                                        <FaClock className="display-6 text-success mb-3" />
                                                        <h6 className="fw-bold text-white">Repair & Cost Estimate</h6>
                                                        <p className="small text-secondary opacity-75 mb-3">Upload garage estimate (PDF or Image)</p>
                                                        <Form.Control
                                                            name="repairEstimate"
                                                            type="file"
                                                            accept=".pdf,image/*"
                                                            onChange={handleFileChange}
                                                            className="bg-transparent border-white border-opacity-10 text-secondary"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-between mt-4">
                                                <Button variant="outline-secondary" onClick={prevStep}>
                                                    Back
                                                </Button>
                                                <Button variant="danger" type="submit" disabled={isSubmitting} className="px-5">
                                                    {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* FAQ Section */}
            <div className="py-5" style={{ background: 'radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.08), transparent)' }}>
                <Container className="my-5">
                    <h2 className="fw-bold text-center mb-5 text-white">Frequently Asked Questions</h2>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Accordion flush className="shadow-lg rounded-4 overflow-hidden border border-white border-opacity-10 glass-panel">
                                {faqs.map((faq, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index} className="bg-transparent text-white border-white border-opacity-10">
                                        <Accordion.Header className="fw-bold">{faq.q}</Accordion.Header>
                                        <Accordion.Body className="text-secondary opacity-75">
                                            {faq.a}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default VehicleInsurance;
