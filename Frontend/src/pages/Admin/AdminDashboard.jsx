import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardCheck, FaPowerOff, FaChartLine, FaShieldAlt, FaArrowUp, FaCircle } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import { Badge, Form, Button } from 'react-bootstrap';

const AdminDashboard = ({ isSiteDown, toggleSiteStatus, onLogout }) => {
    const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
    const [visible, setVisible] = useState(false);

    const [recentClaims, setRecentClaims] = useState([]);
    const [stats, setStats] = useState([
        { title: 'Total Policies', value: 0, display: '0', icon: <FaShieldAlt />, gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.4)', trend: '+0%' },
        { title: 'Pending Claims', value: 0, display: '0', icon: <FaClipboardCheck />, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', glow: 'rgba(245,158,11,0.4)', trend: '+0%' },
        { title: 'Active Users', value: 0, display: '0', icon: <FaUsers />, gradient: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.4)', trend: '+0%' },
        { title: 'Claim Success', value: 0, display: '0%', icon: <FaChartLine />, gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)', glow: 'rgba(14,165,233,0.4)', trend: '+0%' },
    ]);

    const fetchData = async () => {
        try {
            const claimsRes = await fetch('http://localhost:5000/api/claims');
            const claims = await claimsRes.json();

            // Set top 5 recent claims
            setRecentClaims(claims.slice(0, 5));

            // Calculate stats
            const pending = claims.filter(c => c.status === 'Pending').length;
            const approved = claims.filter(c => c.status === 'Approved').length;
            const successRate = claims.length > 0 ? Math.round((approved / claims.length) * 100) : 0;

            const usersRes = await fetch('http://localhost:5000/api/auth/users');
            const users = await usersRes.json();

            const policiesRes = await fetch('http://localhost:5000/api/policies');
            const policies = await policiesRes.json();

            setStats([
                { title: 'Total Policies', value: policies.length, display: policies.length.toLocaleString(), icon: <FaShieldAlt />, gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.4)', trend: '+12%' },
                { title: 'Pending Claims', value: pending, display: pending.toString(), icon: <FaClipboardCheck />, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', glow: 'rgba(245,158,11,0.4)', trend: '+5%' },
                { title: 'Active Users', value: users.length, display: users.length.toString(), icon: <FaUsers />, gradient: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.4)', trend: '+8%' },
                { title: 'Claim Success', value: successRate, display: `${successRate}%`, icon: <FaChartLine />, gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)', glow: 'rgba(14,165,233,0.4)', trend: '+18%' },
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Entrance animation trigger
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const statusColor = (s) =>
        s === 'Approved' ? '#10b981' : s === 'Pending' ? '#f59e0b' : '#ef4444';
    const statusBg = (s) =>
        s === 'Approved' ? 'rgba(16,185,129,0.12)' : s === 'Pending' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';

    return (
        <>
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
                    background: transparent;
                }
                @media (max-width: 991px) { .admin-sidebar-col { display: none; } }
                .admin-main {
                    flex: 1;
                    padding: 32px 36px;
                    overflow-y: auto;
                    background: #0f0e16;
                }
                /* Header */
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
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
                    margin: 0 0 4px;
                }
                .admin-header-sub { color: rgba(255,255,255,0.4); font-size: 14px; }
                .status-pill {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 16px;
                    border-radius: 999px;
                    font-size: 12px; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 1px;
                    border: 1px solid;
                }
                .status-pill.live {
                    background: rgba(16,185,129,0.12);
                    color: #34d399;
                    border-color: rgba(16,185,129,0.3);
                }
                .status-pill.down {
                    background: rgba(239,68,68,0.12);
                    color: #f87171;
                    border-color: rgba(239,68,68,0.3);
                }
                .status-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    animation: statusPulse 2s infinite;
                }
                .status-dot.live { background: #34d399; }
                .status-dot.down { background: #f87171; animation: none; }
                @keyframes statusPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.4); }
                }
                /* Stat Cards */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 28px;
                }
                @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
                @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } }
                .stat-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    cursor: default;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                    opacity: 0;
                    transform: translateY(24px);
                }
                .stat-card.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .stat-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(255,255,255,0.15);
                }
                .stat-card::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: var(--card-gradient);
                    opacity: 0.06;
                    transition: opacity 0.3s;
                }
                .stat-card:hover::before { opacity: 0.12; }
                .stat-icon-wrap {
                    width: 48px; height: 48px;
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; color: #fff;
                    margin-bottom: 16px;
                    box-shadow: 0 4px 20px var(--card-glow);
                    background: var(--card-gradient);
                    -webkit-transform: translateZ(0); /* Hardware acceleration */
                }
                .stat-label { color: rgba(255,255,255,0.45); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
                .stat-value { font-size: 26px; font-weight: 800; color: #f1f5f9; margin-bottom: 6px; }
                .stat-trend {
                    font-size: 11px; font-weight: 700;
                    color: #34d399;
                    display: flex; align-items: center; gap: 4px;
                }
                /* Bottom grid */
                .bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 20px;
                }
                @media (max-width:1100px) { .bottom-grid { grid-template-columns: 1fr; } }
                .glass-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    overflow: hidden;
                    -webkit-backdrop-filter: blur(12px);
                    backdrop-filter: blur(12px);
                    transition: border-color 0.3s, opacity 0.5s ease, transform 0.5s ease;
                    opacity: 0;
                    transform: translateY(20px);
                }
                .glass-card.visible { opacity: 1; transform: translateY(0); }
                .glass-card:hover { border-color: rgba(255,255,255,0.12); }
                .card-header-bar {
                    padding: 18px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex; align-items: center; justify-content: space-between;
                }
                .card-header-title {
                    font-size: 15px; font-weight: 700; color: #e2e8f0;
                }
                /* Claims table */
                .claims-table { width: 100%; border-collapse: collapse; }
                .claims-table th {
                    padding: 12px 20px;
                    font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
                    color: rgba(255,255,255,0.3); font-weight: 600;
                    background: rgba(255,255,255,0.02);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    text-align: left;
                }
                .claims-table td {
                    padding: 14px 20px;
                    font-size: 13px; color: rgba(255,255,255,0.75);
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                .claims-table tr:last-child td { border-bottom: none; }
                .claims-table tr:hover td { background: rgba(255,255,255,0.03); }
                .claim-id-link {
                    color: #a5b4fc; font-weight: 700; text-decoration: none;
                    transition: color 0.2s;
                }
                .claim-id-link:hover { color: #818cf8; }
                .status-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 999px;
                    font-size: 11px; font-weight: 700;
                }
                /* Control panel */
                .control-panel { padding: 24px; height: 100%; display: flex; flex-direction: column; }
                .control-title {
                    font-size: 15px; font-weight: 700; color: #f87171;
                    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
                }
                .control-desc { color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.6; margin-bottom: 20px; flex: 1; }
                .control-status-row {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    padding: 14px 16px;
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 18px;
                }
                .control-status-label { font-size: 13px; font-weight: 600; color: #e2e8f0; }
                .control-status-sub { font-size: 11px; margin-top: 2px; }
                .control-btn {
                    width: 100%; padding: 14px;
                    border-radius: 14px; border: none;
                    font-size: 14px; font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    letter-spacing: 0.5px;
                }
                .control-btn.shutdown {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(239,68,68,0.3);
                }
                .control-btn.shutdown:hover {
                    box-shadow: 0 6px 28px rgba(239,68,68,0.5);
                    transform: translateY(-2px);
                }
                .control-btn.online {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
                }
                .control-btn.online:hover {
                    box-shadow: 0 6px 28px rgba(16,185,129,0.5);
                    transform: translateY(-2px);
                }
                /* Custom switch */
                .custom-toggle { position: relative; width: 44px; height: 24px; }
                .custom-toggle input { opacity: 0; width: 0; height: 0; }
                .toggle-slider {
                    position: absolute; inset: 0;
                    background: rgba(255,255,255,0.12);
                    border-radius: 999px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .toggle-slider::after {
                    content: '';
                    position: absolute;
                    left: 3px; top: 3px;
                    width: 18px; height: 18px;
                    background: #fff;
                    border-radius: 50%;
                    transition: transform 0.3s;
                }
                input:checked + .toggle-slider { background: #ef4444; }
                input:checked + .toggle-slider::after { transform: translateX(20px); }
            `}</style>

            <div className="admin-page">
                {/* Sidebar */}
                <div className="admin-sidebar-col">
                    <AdminSidebar onLogout={onLogout} />
                </div>

                {/* Main Content */}
                <div className="admin-main">
                    {/* Header */}
                    <div className={`admin-header ${visible ? 'visible' : ''}`}>
                        <div>
                            <h1 className="admin-header-title">System Overview</h1>
                            <p className="admin-header-sub">Welcome back, Administrator</p>
                        </div>
                        <div className={`status-pill ${isSiteDown ? 'down' : 'live'}`}>
                            <span className={`status-dot ${isSiteDown ? 'down' : 'live'}`} />
                            System: {isSiteDown ? 'Maintenance' : 'Live'}
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`stat-card ${visible ? 'visible' : ''}`}
                                style={{
                                    '--card-gradient': stat.gradient,
                                    '--card-glow': stat.glow,
                                    transitionDelay: `${0.1 + i * 0.08}s`,
                                }}
                            >
                                <div className="stat-icon-wrap">{stat.icon}</div>
                                <div className="stat-label">{stat.title}</div>
                                <div className="stat-value">{stat.display}</div>
                                <div className="stat-trend">
                                    <FaArrowUp style={{ fontSize: 9 }} /> {stat.trend} this month
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom: Claims Table + Controls */}
                    <div className="bottom-grid">
                        {/* Claims Table */}
                        <div className={`glass-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <div className="card-header-bar">
                                <span className="card-header-title">Recent Claim Requests</span>
                                <Link to="/admin/claims" style={{ fontSize: 12, color: '#a5b4fc', textDecoration: 'none', fontWeight: 600 }}>
                                    View all →
                                </Link>
                            </div>
                            <table className="claims-table">
                                <thead>
                                    <tr>
                                        <th>Claim ID</th>
                                        <th>User</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentClaims.map((c, i) => (
                                        <tr key={i}>
                                            <td>
                                                <Link to={`/admin/claims/${c._id}`} className="claim-id-link">
                                                    {c.readableId || `#${c._id.substring(c._id.length - 6).toUpperCase()}`}
                                                </Link>
                                            </td>
                                            <td style={{ color: '#e2e8f0', fontWeight: 600 }}>{c.userName}</td>
                                            <td>{c.vehicleNumber}</td>
                                            <td>
                                                <span className="status-badge" style={{
                                                    background: statusBg(c.status),
                                                    color: statusColor(c.status),
                                                }}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                                                {new Date(c.incidentDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* System Control Panel */}
                        <div className={`glass-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.5s' }}>
                            <div className="control-panel">
                                <div className="control-title">
                                    <FaPowerOff /> Master Control
                                </div>
                                <p className="control-desc">
                                    Shutdown the entire website for all users except administrators. Use only for critical maintenance windows.
                                </p>

                                <div className="control-status-row">
                                    <div>
                                        <div className="control-status-label">Live Status</div>
                                        <div className="control-status-sub" style={{ color: isSiteDown ? '#f87171' : '#34d399' }}>
                                            {isSiteDown ? '● Offline' : '● Online'}
                                        </div>
                                    </div>
                                    <label className="custom-toggle">
                                        <input type="checkbox" checked={isSiteDown} onChange={toggleSiteStatus} />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>

                                <button
                                    className={`control-btn ${isSiteDown ? 'online' : 'shutdown'}`}
                                    onClick={toggleSiteStatus}
                                >
                                    {isSiteDown ? '✓ Bring System Online' : '⚡ Emergency Shutdown'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
