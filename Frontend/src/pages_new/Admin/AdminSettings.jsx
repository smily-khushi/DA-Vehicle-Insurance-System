import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Nav, Tab } from 'react-bootstrap';
import { FaUser, FaLock, FaBell, FaGlobe, FaShieldAlt, FaSave, FaTrash, FaCheckCircle } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';

const AdminSettings = ({ onLogout }) => {
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setSaveStatus('saving');
        setTimeout(() => {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        }, 1500);
    };

    return (
        <div className="admin-page">
            <style>{`
                .admin-page {
                    display: flex;
                    min-height: 100vh;
                    background: #0f0e16;
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                }
                .admin-sidebar-col {
                    width: 240px;
                    min-width: 240px;
                    padding: 16px;
                }
                .admin-main {
                    flex: 1;
                    padding: 32px 36px;
                    background: #0f0e16;
                }
                .admin-header {
                    margin-bottom: 36px;
                    opacity: 0;
                    transform: translateY(-16px);
                    transition: all 0.5s ease;
                }
                .admin-header.visible { opacity: 1; transform: translateY(0); }
                .admin-header-title {
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(90deg, #e2e8f0, #a5b4fc);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                    margin-bottom: 4px;
                }
                .admin-header-sub { color: rgba(255,255,255,0.4); font-size: 14px; }

                .settings-container {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 32px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .settings-container.visible { opacity: 1; transform: translateY(0); }

                @media (max-width: 991px) {
                    .settings-container { grid-template-columns: 1fr; }
                    .admin-sidebar-col { display: none; }
                }

                .settings-nav {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 20px;
                    padding: 16px;
                    height: fit-content;
                    position: sticky;
                    top: 32px;
                }
                .settings-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: rgba(255, 255, 255, 0.5);
                    text-decoration: none;
                    border-radius: 12px;
                    transition: all 0.2s;
                    margin-bottom: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                }
                .settings-nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.9);
                }
                .settings-nav-item.active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }

                .settings-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 20px;
                    padding: 32px;
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                }
                .settings-card-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .settings-label {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                .settings-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: #fff;
                    padding: 12px 16px;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                .settings-input:focus {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                    color: #fff;
                    outline: none;
                }

                .save-btn {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 700;
                    font-size: 14px;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
                }

                .danger-zone {
                    margin-top: 40px;
                    border-top: 1px solid rgba(239, 68, 68, 0.1);
                    padding-top: 32px;
                }
                .danger-title {
                    color: #f87171;
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
            `}</style>

            <div className="admin-sidebar-col">
                <AdminSidebar onLogout={onLogout} />
            </div>

            <div className="admin-main">
                <div className={`admin-header ${visible ? 'visible' : ''}`}>
                    <h1 className="admin-header-title">Admin Settings</h1>
                    <p className="admin-header-sub">Configure your system preferences and security</p>
                </div>

                <div className={`settings-container ${visible ? 'visible' : ''}`}>
                    <div className="settings-nav">
                        <div className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <FaUser /> Profile
                        </div>
                        <div className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                            <FaLock /> Security
                        </div>
                        <div className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                            <FaBell /> Notifications
                        </div>
                        <div className={`settings-nav-item ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
                            <FaGlobe /> System Config
                        </div>
                    </div>

                    <div className="settings-content">
                        {activeTab === 'profile' && (
                            <div className="settings-card shadow-lg animate-fade-in">
                                <h2 className="settings-card-title"><FaUser className="text-primary" /> Profile Information</h2>
                                <Form onSubmit={handleSave}>
                                    <Row>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">Full Name</Form.Label>
                                            <Form.Control className="settings-input" defaultValue="System Administrator" />
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">Email Address</Form.Label>
                                            <Form.Control className="settings-input" defaultValue="admin@safedrive.com" />
                                        </Col>
                                        <Col md={12} className="mb-4">
                                            <Form.Label className="settings-label">Admin Role</Form.Label>
                                            <Form.Control className="settings-input" defaultValue="Super Admin" disabled />
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" className="save-btn" disabled={saveStatus === 'saving'}>
                                            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? <><FaCheckCircle /> Saved</> : <><FaSave /> Save Changes</>}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="settings-card shadow-lg animate-fade-in">
                                <h2 className="settings-card-title"><FaLock className="text-warning" /> Security Settings</h2>
                                <Form onSubmit={handleSave}>
                                    <div className="mb-4">
                                        <Form.Label className="settings-label">Current Password</Form.Label>
                                        <Form.Control type="password" className="settings-input" placeholder="••••••••" />
                                    </div>
                                    <Row>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">New Password</Form.Label>
                                            <Form.Control type="password" className="settings-input" placeholder="Enter new password" />
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">Confirm New Password</Form.Label>
                                            <Form.Control type="password" className="settings-input" placeholder="Confirm new password" />
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end mb-4">
                                        <Button type="submit" className="save-btn">
                                            <FaLock /> Update Password
                                        </Button>
                                    </div>

                                    <div className="danger-zone">
                                        <h3 className="danger-title">Danger Zone</h3>
                                        <p className="text-secondary small mb-3">Proceed with caution. These actions cannot be undone.</p>
                                        <Button variant="outline-danger" className="d-flex align-items-center gap-2" style={{ borderRadius: '10px' }}>
                                            <FaTrash /> Deactivate Account
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="settings-card shadow-lg animate-fade-in">
                                <h2 className="settings-card-title"><FaBell className="text-info" /> Notification Preferences</h2>
                                <Form onSubmit={handleSave}>
                                    <div className="mb-4 p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <Form.Check
                                            type="switch"
                                            id="new-claim-notify"
                                            label="New Claim Notifications"
                                            defaultChecked
                                            className="text-white mb-2"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="user-reg-notify"
                                            label="User Registration Alerts"
                                            defaultChecked
                                            className="text-white mb-2"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="system-health-notify"
                                            label="System Health Reports"
                                            className="text-white"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" className="save-btn">
                                            <FaSave /> Save Preferences
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="settings-card shadow-lg animate-fade-in">
                                <h2 className="settings-card-title"><FaGlobe className="text-secondary" /> System Configuration</h2>
                                <Form onSubmit={handleSave}>
                                    <Row>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">System Environment</Form.Label>
                                            <Form.Select className="settings-input">
                                                <option>Production (Live)</option>
                                                <option>Staging</option>
                                                <option>Development</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <Form.Label className="settings-label">Backup Frequency</Form.Label>
                                            <Form.Select className="settings-input">
                                                <option>Daily</option>
                                                <option>Weekly</option>
                                                <option>Monthly</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" className="save-btn">
                                            <FaSave /> Update Config
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
