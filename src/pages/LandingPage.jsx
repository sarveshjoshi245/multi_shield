import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Zap, ArrowRight, ShieldCheck, Activity, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
    const { isDark, toggleTheme } = useTheme();

    const features = [
        { icon: Lock, title: '6-Layer ZTA Auth', desc: 'Multi-factor identity verification with face recognition, OTP, and hardware token.' },
        { icon: Eye, title: 'Real-Time UEBA', desc: 'Behavioral analytics engine monitors every privileged action in real-time.' },
        { icon: Zap, title: 'AI Risk Scoring', desc: 'Dynamic risk assessment with 4-tier enforcement: approve, ZTA, restrict, block.' },
        { icon: Camera, title: 'Face Recognition', desc: 'Webcam-based biometric verification integrated directly into the ZTA pipeline.' },
        { icon: Activity, title: 'Live Monitoring', desc: 'Event throughput analytics and anomaly detection across all banking sectors.' },
        { icon: ShieldCheck, title: 'Admin Oversight', desc: 'Centralized policy enforcement, approval workflows, and audit trail.' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column',
            background: isDark
                ? 'radial-gradient(ellipse at 30% 0%, #0c4a6e 0%, #020617 50%)'
                : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)',
        }}>
            {/* Header */}
            <header style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: '#0284c7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield color="white" size={20} />
                    </div>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Multi<span style={{ color: '#0ea5e9' }}>Shield</span></span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 12 }}>
                        {isDark ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 24px', fontSize: 13 }}>
                        Sign In <ArrowRight size={14} />
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'var(--risk-blue-bg)', border: '1px solid var(--border-active)', marginBottom: 28 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 99, background: '#10b981' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', letterSpacing: 1 }}>RBI COMPLIANT · ZERO TRUST ARCHITECTURE</span>
                    </div>

                    <h1 style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Outfit', lineHeight: 1.15, marginBottom: 20, color: 'var(--text-primary)' }}>
                        AI-Powered <span style={{ color: '#0ea5e9' }}>Banking Security</span> for Privileged Access
                    </h1>

                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
                        Real-time early warning system that monitors privileged user behavior, enforces zero-trust policies, and prevents insider threats with adaptive AI risk scoring.
                    </p>

                    <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 36px', fontSize: 15, display: 'inline-flex' }}>
                        Enter Secure Environment <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div style={{ padding: '60px 40px 80px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {features.map((feature, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                            className="glass-card" style={{ padding: 28 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--risk-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <feature.icon size={22} color="#0284c7" />
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{feature.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer style={{ padding: '20px 40px', borderTop: '1px solid var(--border-primary)', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--text-faint)' }}>MultiShield · Zero Trust Banking Security · Hackathon Prototype</p>
            </footer>
        </div>
    );
}
