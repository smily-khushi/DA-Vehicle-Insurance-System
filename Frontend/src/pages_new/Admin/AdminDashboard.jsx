import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardCheck, FaPowerOff, FaChartLine, FaShieldAlt, FaArrowUp, FaCircle, FaMapMarkerAlt, FaExclamationTriangle, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import { Badge, Form, Button } from 'react-bootstrap';

const AdminDashboard = ({ isSiteDown, toggleSiteStatus, onLogout }) => {
    const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
    const [visible, setVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [claimsData, setClaimsData] = useState([]);
    const [visibleNotifications, setVisibleNotifications] = useState([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

            // Generate claims data for chart (last 7 days)
            const dailyClaimsCount = Array(7).fill(0);
            const today = new Date();
            claims.forEach(claim => {
                const claimDate = new Date(claim.incidentDate);
                const dayDiff = Math.floor((today - claimDate) / (1000 * 60 * 60 * 24));
                if (dayDiff >= 0 && dayDiff < 7) {
                    dailyClaimsCount[6 - dayDiff]++;
                }
            });
            setClaimsData(dailyClaimsCount);

            // Generate notifications based on recent PENDING claims only
            const newNotifications = [];
            if (claims.length > 0) {
                const pendingClaims = claims.filter(c => c.status === 'Pending');
                const now = new Date();
                
                // Only show newly arrived pending claims (created within last 24 hours)
                pendingClaims.slice(0, 3).forEach(claim => {
                    const createdTime = new Date(claim.createdAt || claim.incidentDate);
                    const hoursDiff = (now - createdTime) / (1000 * 60 * 60);
                    
                    // Show only if created within last 24 hours
                    if (hoursDiff <= 24) {
                        newNotifications.push({
                            id: claim._id,
                            message: `New pending claim from ${claim.userName}`,
                            type: 'warning',
                            time: createdTime
                        });
                    }
                });
            }
            setNotifications(newNotifications);
            setVisibleNotifications(newNotifications);

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
        // Polling keeps dashboard data fresh without realtime sockets.
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Entrance animation trigger
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Auto-dismiss notifications after 3 seconds
    useEffect(() => {
        if (visibleNotifications.length > 0) {
            const timer = setTimeout(() => {
                setVisibleNotifications([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visibleNotifications]);

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
                .admin-mobile-menu-btn {
                    display: none;
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.14);
                    background: rgba(255,255,255,0.06);
                    color: #e2e8f0;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    cursor: pointer;
                }
                .admin-mobile-sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(2, 6, 23, 0.65);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.25s ease;
                    z-index: 1200;
                }
                .admin-mobile-sidebar-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .admin-mobile-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: min(84vw, 320px);
                    padding: 16px;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    z-index: 1300;
                }
                .admin-mobile-sidebar.open { transform: translateX(0); }
                .admin-mobile-sidebar-close {
                    position: absolute;
                    right: 18px;
                    top: 18px;
                    width: 34px;
                    height: 34px;
                    border: none;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.08);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                }
                @media (min-width: 992px) {
                    .admin-mobile-sidebar,
                    .admin-mobile-sidebar-overlay {
                        display: none;
                    }
                }
                .admin-main {
                    flex: 1;
                    padding: 32px 36px;
                    overflow-y: auto;
                    background: #0f0e16;
                }
                @media (max-width: 991px) {
                    .admin-main { padding: 20px 16px 24px; }
                    .admin-mobile-menu-btn { display: inline-flex; }
                    .admin-header {
                        align-items: center;
                        gap: 14px;
                    }
                    .admin-header-title { font-size: 24px; }
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
                /* Notifications */
                .notifications-container {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    z-index: 1000;
                }
                .notification-item {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 10px;
                    backdrop-filter: blur(10px);
                    animation: slideIn 0.3s ease;
                }
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-item.warning { border-left: 4px solid #f59e0b; }
                .notification-item.info { border-left: 4px solid #0ea5e9; }
                .notification-item.success { border-left: 4px solid #10b981; }

                /* Charts Grid */
                .charts-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 20px;
                    margin-bottom: 28px;
                }
                @media (max-width:1100px) { .charts-grid { grid-template-columns: 1fr; } }

                .chart-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 24px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .chart-card.visible { opacity: 1; transform: translateY(0); }
                .chart-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

                /* Line Chart */
                .line-chart-container { height: 300px; position: relative; display: flex; align-items: flex-end; gap: 6px; }
                .chart-bar {
                    flex: 1;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 8px 8px 0 0;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
                    animation: barGrow 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes barGrow {
                    from { height: 0; opacity: 0; }
                    to { height: 100%; opacity: 1; }
                }
                .chart-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 11px; color: rgba(255,255,255,0.4); white-space: nowrap; }

                /* Pie Chart */
                .pie-chart { width: 200px; height: 200px; border-radius: 50%; position: relative; }
                .pie-legend { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
                .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.7); }
                .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
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
                <div
                    className={`admin-mobile-sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className={`admin-mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
                    <button
                        className="admin-mobile-sidebar-close"
                        onClick={() => setIsMobileSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        <FaTimes />
                    </button>
                    <AdminSidebar
                        onLogout={onLogout}
                        onNavigate={() => setIsMobileSidebarOpen(false)}
                    />
                </div>

                {/* Notifications */}
                <div className="notifications-container">
                    {visibleNotifications.map((notif, i) => (
                        <div key={i} className={`notification-item ${notif.type}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaBell style={{ fontSize: '12px', color: notif.type === 'warning' ? '#f59e0b' : '#0ea5e9' }} />
                                <div>
                                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>{notif.message}</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Just now</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="admin-sidebar-col">
                    <AdminSidebar onLogout={onLogout} />
                </div>

                {/* Main Content */}
                <div className="admin-main">
                    {/* Header */}
                    <div className={`admin-header ${visible ? 'visible' : ''}`}>
                        <button
                            className="admin-mobile-menu-btn"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <FaBars />
                        </button>
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
                    <div className="charts-grid">
                        {/* Claims Line Chart */}
                        <div className={`chart-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
                            <div className="chart-title">
                                <FaChartLine /> Claims Submitted (Last 7 Days)
                            </div>
                            <svg width="100%" height="300" viewBox="0 0 760 300" preserveAspectRatio="none" style={{ marginBottom: '20px' }}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                {claimsData && claimsData.length > 0 && (() => {
                                    const maxCount = Math.max(...claimsData, 1);
                                    const chartWidth = 760;
                                    const chartHeight = 300;
                                    const paddingX = 40;
                                    const paddingTop = 20;
                                    const paddingBottom = 36;
                                    const plotWidth = chartWidth - (paddingX * 2);
                                    const plotHeight = chartHeight - paddingTop - paddingBottom;
                                    const pointSpacing = claimsData.length > 1 ? plotWidth / (claimsData.length - 1) : 0;
                                    
                                    const points = claimsData.map((count, i) => {
                                        const x = paddingX + (i * pointSpacing);
                                        const y = paddingTop + (1 - (count / maxCount)) * plotHeight;
                                        return { x, y, count };
                                    });

                                    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

                                    return (
                                        <>
                                            <polyline
                                                points={polylinePoints}
                                                fill="none"
                                                stroke="url(#lineGradient)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' }}
                                            />
                                            <defs>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur"/>
                                                        <feMergeNode in="SourceGraphic"/>
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            {points.map((point, i) => (
                                                <g key={i}>
                                                    <circle cx={point.x} cy={point.y} r="6" fill="rgba(99,102,241,0.2)" filter="url(#glow)" />
                                                    <circle cx={point.x} cy={point.y} r="3" fill="#818cf8" style={{ animation: 'pointGlow 2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                                                    <text x={point.x} y={point.y - 15} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12" fontWeight="700">{point.count}</text>
                                                </g>
                                            ))}
                                            <g>
                                                {claimsData.map((_, i) => {
                                                    const x = paddingX + (i * pointSpacing);
                                                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                    const today = new Date();
                                                    const day = new Date(today);
                                                    day.setDate(day.getDate() - (6 - i));
                                                    return (
                                                        <text key={i} x={x} y="294" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">{days[day.getDay()]}</text>
                                                    );
                                                })}
                                            </g>
                                        </>
                                    );
                                })()}
                                <style>{`
                                    @keyframes pointGlow {
                                        0%, 100% { r: 3; opacity: 0.8; }
                                        50% { r: 5; opacity: 1; }
                                    }
                                `}</style>
                            </svg>
                        </div>

                        {/* City Distribution Pie Chart */}
                        <div className={`chart-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <div className="chart-title">
                                <FaMapMarkerAlt /> Claims by City
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <svg width="160" height="160" style={{ marginBottom: '12px' }}>
                                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="12" strokeDasharray="113 377" />
                                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="12" strokeDasharray="94 377" strokeDashoffset="-113" />
                                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="12" strokeDasharray="70 377" strokeDashoffset="-207" />
                                    <circle cx="80" cy="80" r="50" fill="#0f0e16" />
                                    <text x="80" y="85" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="20" fontWeight="700">3 Cities</text>
                                </svg>
                                <div className="pie-legend">
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(99,102,241,0.6)' }} /> Mumbai - 30%</div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(16,185,129,0.6)' }} /> Delhi - 25%</div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(245,158,11,0.6)' }} /> Bangalore - 18%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accident Reasons Chart */}
                    <div className={`chart-card ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.45s', marginBottom: '28px' }}>
                        <div className="chart-title">
                            <FaExclamationTriangle /> Claim Reasons Distribution
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Accidents</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>45%</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>↑ 12% vs last month</div>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Theft</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>28%</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>↓ 5% vs last month</div>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(14,165,233,0.1)', borderRadius: '10px', border: '1px solid rgba(14,165,233,0.2)' }}>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Damage</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0ea5e9' }}>27%</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>→ No change</div>
                            </div>
                        </div>
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
