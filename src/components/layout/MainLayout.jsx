import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Activity, Database, Users, Settings, LogOut, ChevronLeft, Search, Bell, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { USERS, CURRENT_SESSION } from '../../simulation/mockData';

export default function MainLayout({ children, role }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const user = USERS[role] || USERS.treasurer;

    const menuItems = {
        treasurer: [
            { path: '/treasurer', label: 'Treasury Overview', icon: LayoutDashboard },
            { path: '/treasurer/transactions', label: 'Transactions', icon: Wallet },
            { path: '/treasurer/analytics', label: 'Risk Exposure', icon: Activity },
        ],
        manager: [
            { path: '/manager', label: 'Live Monitoring', icon: Activity },
            { path: '/manager/users', label: 'Privileged Users', icon: Users },
            { path: '/manager/incidents', label: 'Incidents', icon: Shield },
        ],
        admin: [
            { path: '/admin', label: 'Control Center', icon: Database },
            { path: '/admin/policies', label: 'Policy Engine', icon: Settings },
            { path: '/admin/managers', label: 'Audit Managers', icon: Users },
        ]
    };

    const navItems = menuItems[role] || [];
    const sideW = collapsed ? 80 : 260;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: sideW, transition: 'width 0.3s ease', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'relative', flexShrink: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}>
                {/* Collapse Toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{ position: 'absolute', right: -12, top: 72, width: 24, height: 24, borderRadius: 99, background: '#0284c7', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                </button>

                {/* Logo */}
                <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, background: '#0284c7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Shield color="white" size={20} />
                    </div>
                    {!collapsed && <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>Multi<span style={{ color: '#0ea5e9' }}>Shield</span></span>}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px' : '10px 14px', borderRadius: 10, textDecoration: 'none', color: active ? '#38bdf8' : '#94a3b8', background: active ? 'rgba(14,165,233,0.1)' : 'transparent', border: active ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent', transition: 'all 0.2s', fontSize: 13, fontWeight: active ? 600 : 500, justifyContent: collapsed ? 'center' : 'flex-start' }}>
                                <item.icon size={18} />
                                {!collapsed && item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {!collapsed && (
                        <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 12 }}>
                            <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', fontWeight: 700 }}>Authenticated As</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'white', marginTop: 4 }}>{user.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: 99, background: '#10b981', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#10b981' }}>{user.id} · {user.sector}</span>
                            </div>
                        </div>
                    )}
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: '#94a3b8', textDecoration: 'none', fontSize: 13, transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                        <LogOut size={16} />
                        {!collapsed && 'Terminate Session'}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header */}
                <header style={{ height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 20 }}>
                    <div style={{ position: 'relative', maxWidth: 400, flex: 1 }}>
                        <Search size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search transactions, logs, users..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '8px 16px 8px 36px', color: 'white', fontSize: 13, outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={18} color="#94a3b8" />
                            <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: 99, background: '#f43f5e' }} />
                        </div>
                        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.08)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{user.sector} Sector</p>
                                <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#38bdf8' }}>{CURRENT_SESSION.ip}</p>
                            </div>
                            <div style={{ width: 36, height: 36, borderRadius: 99, background: 'linear-gradient(135deg, #0284c7, #6366f1)', border: '2px solid rgba(255,255,255,0.1)' }} />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                    {children}
                </div>
            </main>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
    );
}
