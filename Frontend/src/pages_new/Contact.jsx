import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send message');
            }

            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitted(true);
        } catch (submitError) {
            setError(submitError.message || 'Unable to send message right now');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Container className="py-5 my-5 text-center animate-up">
                <div className="bg-success-subtle p-5 rounded-4 shadow-sm border border-success border-opacity-25">
                    <FaCheckCircle className="text-success display-1 mb-4" />
                    <h2 className="fw-bold text-success mb-3">Message Sent!</h2>
                    <p className="fs-5 text-secondary mb-4">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button variant="primary" onClick={() => setSubmitted(false)} className="px-5 py-2 rounded-pill fw-bold">
                        Send Another Message
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5 my-5">
            <div className="text-center mb-5 animate-up">
                <h2 className="display-4 fw-bold text-white">Get in Touch</h2>
                <p className="lead text-secondary opacity-75">We're here to help you 24/7</p>
            </div>

            <Row className="g-5">
                <Col lg={5} className="animate-up" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-5">
                        <h4 className="fw-bold mb-4 text-secondary">Contact Information</h4>
                        <div className="d-flex align-items-center mb-4 text-secondary">
                            <div className="bg-primary-subtle p-3 rounded-circle me-3">
                                <FaPhoneAlt className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Call Us</h6>
                                <span>+1 (800) SAFE-DRIVE</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-4 text-secondary">
                            <div className="bg-primary-subtle p-3 rounded-circle me-3">
                                <FaEnvelope className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Email Us</h6>
                                <span>support@safedrive.com</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center text-secondary">
                            <div className="bg-primary-subtle p-3 rounded-circle me-3">
                                <FaMapMarkerAlt className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Our Office</h6>
                                <span>123 Insurance Ave, 10001</span>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col lg={7} className="animate-up" style={{ animationDelay: '0.4s' }}>
                    <Card className="border-0 shadow-lg p-4 rounded-4">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Send us a Message</h4>
                            <Form onSubmit={handleSubmit}>
                                {error && (
                                    <Alert variant="danger" className="rounded-3 py-2">
                                        {error}
                                    </Alert>
                                )}
                                <Row className="g-3 mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="formName">
                                            <Form.Label className="small fw-bold">Your Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="John Doe"
                                                className="bg-light border-0 py-2 rounded-3"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label className="small fw-bold">Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                className="bg-light border-0 py-2 rounded-3"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="formSubject">
                                    <Form.Label className="small fw-bold">Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        placeholder="Inquiry about..."
                                        className="bg-light border-0 py-2 rounded-3"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formMessage">
                                    <Form.Label className="small fw-bold">Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="message"
                                        placeholder="Tell us how we can help..."
                                        className="bg-light border-0 py-2 rounded-3"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold btn-dynamic shadow" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;
