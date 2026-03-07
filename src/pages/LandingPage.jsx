import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Activity, Lock, Zap, Users, Database, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
});

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* BG blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '35%', height: '35%', background: 'rgba(14,165,233,0.08)', filter: 'blur(120px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '30%', background: 'rgba(244,63,94,0.06)', filter: 'blur(120px)', borderRadius: '50%' }} />

            {/* Nav */}
            <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: '#0284c7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(2,132,199,0.4)' }}>
                        <Shield color="white" size={22} />
                    </div>
                    <span style={{ fontSize: 22, fontFamily: 'Outfit', fontWeight: 700, color: 'white' }}>
                        Multi<span style={{ color: '#0ea5e9' }}>Shield</span>
                    </span>
                </div>
                <Link to="/login" className="btn-primary">Enterprise Login</Link>
            </nav>

            {/* Hero */}
            <main style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 140, paddingBottom: 80, paddingLeft: 32, paddingRight: 32, display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', width: 'fit-content' }}>
                        <Zap size={12} /> Zero Trust AI Security
                    </motion.div>

                    <motion.h1 {...fadeUp(0.1)} style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.08, color: 'white' }}>
                        AI-Powered Insider{' '}
                        <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Risk Detection
                        </span>
                    </motion.h1>

                    <motion.p {...fadeUp(0.2)} style={{ fontSize: 18, color: '#94a3b8', maxWidth: 520, lineHeight: 1.7 }}>
                        Continuously monitor privileged user behaviour across core banking, treasury, and loan systems. Detect anomalies, enforce Zero Trust policies, and prevent insider fraud — all in real time.
                    </motion.p>

                    <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', paddingTop: 8 }}>
                        <Link to="/login" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                            Launch Live Demo <ChevronRight size={18} />
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div {...fadeUp(0.5)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {[
                            { value: '3 Roles', sub: 'Admin · Manager · User' },
                            { value: '4 Sectors', sub: 'Treasury · Loans · Core · CustDB' },
                            { value: 'Real-time', sub: 'UEBA Risk Scoring' },
                        ].map((s, i) => (
                            <div key={i}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'Outfit' }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.sub}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Architecture Card */}
                <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ flex: 1, minWidth: 340 }}>
                    <div className="glass-panel" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)' }} />

                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Activity size={18} color="#0ea5e9" /> System Architecture Flow
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { icon: Users, label: 'User Login Request', sub: 'Admin / Manager / Privileged User' },
                                { icon: Lock, label: 'Zero Trust Gateway', sub: 'MFA + Device + IP + Time Verification' },
                                { icon: Shield, label: 'RBAC + Sector Access Control', sub: 'Micro-segmented banking sectors' },
                                { icon: Activity, label: 'Activity Logging & UEBA Engine', sub: 'Real-time behavioural analysis' },
                                { icon: Zap, label: 'ML Risk Score Calculation', sub: 'Dynamic scoring per action' },
                                { icon: Database, label: 'Policy Decision Engine', sub: '≤40 Allow · 40-70 MFA · 70-85 Restrict · >85 Block' },
                                { icon: Eye, label: 'Manager Dashboard & Admin Alerts', sub: 'Triage, investigate, respond' },
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <step.icon size={16} color="#38bdf8" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{step.label}</div>
                                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{step.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
