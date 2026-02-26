import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChartBar, FaUsers, FaFileInvoice, FaShieldAlt,
    FaSignOutAlt, FaCog, FaTachometerAlt
} from 'react-icons/fa';

const AdminSidebar = ({ onLogout }) => {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        { title: 'Overview', path: '/admin', icon: <FaTachometerAlt /> },
        { title: 'Users', path: '/admin/users', icon: <FaUsers /> },
        { title: 'Policies', path: '/admin/policies', icon: <FaShieldAlt /> },
        { title: 'Claims', path: '/admin/claims', icon: <FaFileInvoice /> },
        { title: 'Settings', path: '/admin/settings', icon: <FaCog /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                .admin-sidebar-wrap {
                    background: linear-gradient(160deg, #0f0c29, #302b63, #24243e);
                    border-radius: 20px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 28px 16px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
                    position: relative;
                    overflow: hidden;
                }
                .admin-sidebar-wrap::before {
                    content: '';
                    position: absolute;
                    top: -60px; left: -60px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%);
                    pointer-events: none;
                }
                .admin-sidebar-wrap::after {
                    content: '';
                    position: absolute;
                    bottom: -60px; right: -40px;
                    width: 180px; height: 180px;
                    background: radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%);
                    pointer-events: none;
                }
                .sidebar-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 8px;
                    margin-bottom: 36px;
                }
                .sidebar-brand-icon {
                    width: 42px; height: 42px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; color: #fff;
                    box-shadow: 0 4px 15px rgba(99,102,241,0.5);
                    animation: iconPulse 3s ease-in-out infinite;
                }
                @keyframes iconPulse {
                    0%, 100% { box-shadow: 0 4px 15px rgba(99,102,241,0.5); }
                    50% { box-shadow: 0 4px 25px rgba(139,92,246,0.8); }
                }
                .sidebar-brand-text {
                    font-size: 17px; font-weight: 800;
                    background: linear-gradient(90deg, #a5b4fc, #e879f9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: 0.5px;
                }
                .sidebar-brand-sub {
                    font-size: 10px;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-top: 1px;
                }
                .sidebar-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    margin: 0 8px 20px;
                }
                .sidebar-section-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: rgba(255,255,255,0.3);
                    padding: 0 14px;
                    margin-bottom: 10px;
                }
                .sidebar-nav {
                    display: flex; flex-direction: column; gap: 4px; flex: 1;
                }
                .sidebar-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 11px 14px;
                    border-radius: 12px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.55);
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    border: none; background: transparent; width: 100%; text-align: left;
                }
                .sidebar-nav-item::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
                    border-radius: inherit;
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .sidebar-nav-item:hover::before,
                .sidebar-nav-item.hovered::before { opacity: 1; }
                .sidebar-nav-item:hover,
                .sidebar-nav-item.hovered {
                    color: rgba(255,255,255,0.9);
                    transform: translateX(4px);
                }
                .sidebar-nav-item.active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
                    transform: translateX(0);
                }
                .sidebar-nav-item.active::before { opacity: 0; }
                .sidebar-nav-item .item-icon {
                    font-size: 15px;
                    transition: transform 0.2s ease;
                    flex-shrink: 0;
                }
                .sidebar-nav-item:hover .item-icon { transform: scale(1.15); }
                .sidebar-nav-item.active .item-icon { transform: scale(1.1); }
                .active-indicator {
                    position: absolute; right: 10px;
                    width: 6px; height: 6px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 6px rgba(255,255,255,0.8);
                    animation: blink 2s ease-in-out infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .sidebar-footer {
                    border-top: 1px solid rgba(255,255,255,0.08);
                    padding-top: 16px;
                    margin-top: 8px;
                }
                .sidebar-logout {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 11px 14px;
                    border-radius: 12px;
                    color: rgba(248,113,113,0.8);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    border: none; background: transparent; width: 100%;
                }
                .sidebar-logout:hover {
                    background: rgba(239,68,68,0.15);
                    color: #f87171;
                    transform: translateX(4px);
                }
                .sidebar-logout .item-icon { font-size: 15px; }
                /* Entry animation */
                .sidebar-nav-item:nth-child(1) { animation: slideIn 0.3s ease 0.05s both; }
                .sidebar-nav-item:nth-child(2) { animation: slideIn 0.3s ease 0.1s both; }
                .sidebar-nav-item:nth-child(3) { animation: slideIn 0.3s ease 0.15s both; }
                .sidebar-nav-item:nth-child(4) { animation: slideIn 0.3s ease 0.2s both; }
                .sidebar-nav-item:nth-child(5) { animation: slideIn 0.3s ease 0.25s both; }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-16px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            <div className="admin-sidebar-wrap">
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon"><FaShieldAlt /></div>
                    <div>
                        <div className="sidebar-brand-text">SafeDrive</div>
                        <div className="sidebar-brand-sub">Admin Console</div>
                    </div>
                </div>

                <div className="sidebar-divider" />
                <div className="sidebar-section-label">Navigation</div>

                {/* Nav Links */}
                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''} ${hoveredItem === index ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <span className="item-icon">{item.icon}</span>
                            <span>{item.title}</span>
                            {isActive(item.path) && <span className="active-indicator" />}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={onLogout}>
                        <FaSignOutAlt className="item-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
