import { Link } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const InsuranceCard = ({ title, price, features, recommended }) => {
    return (
        <Card className={`h-100 p-0 rounded-4 transition-hover glass-panel ${recommended ? 'border-primary border-opacity-75 shadow-lg' : 'border-white border-opacity-10'}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                zIndex: recommended ? 2 : 1
            }}>
            {recommended && (
                <div className="text-white text-center py-2 fw-bold small"
                    style={{
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderTopLeftRadius: '23px',
                        borderTopRightRadius: '23px',
                        letterSpacing: '1px'
                    }}>
                    RECOMMENDED PLAN
                </div>
            )}
            <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-bold mb-3 fs-3 text-center" style={{ color: '#f8fafc' }}>{title}</Card.Title>
                <div className="text-center mb-4">
                    <span className="fs-1 fw-bold" style={{ color: '#818cf8' }}>${price}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/month</span>
                </div>
                <ListGroup variant="flush" className="mb-4 flex-grow-1 bg-transparent">
                    {features.map((feature, index) => (
                        <ListGroup.Item key={index}
                            className="border-0 px-0 d-flex align-items-start bg-transparent text-white-50"
                            style={{ background: 'transparent' }}>
                            <FaCheckCircle className="text-primary me-2 mt-1" style={{ filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.4))' }} />
                            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>{feature}</span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button
                    as={Link}
                    to="/vehicle-insurance"
                    variant={recommended ? 'primary' : 'outline-light'}
                    className={`w-100 py-3 fw-bold rounded-pill mx-auto mt-auto border-0 ${recommended ? 'shadow-primary' : ''}`}
                    style={{
                        background: recommended ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Choose Plan
                </Button>
            </Card.Body>
        </Card>
    );
};

export default InsuranceCard;
