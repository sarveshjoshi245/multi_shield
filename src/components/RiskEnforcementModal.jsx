import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, AlertTriangle, Lock, ShieldOff, ArrowRight, X, Mail, Clock } from 'lucide-react';

/**
 * RiskEnforcementModal — shown when treasurer performs a risky action.
 * Props:
 *  - riskResult: { score, factors, enforcement: { tier, label, icon, color, bgColor, borderColor, description } }
 *  - actionLabel: string description of the action attempted
 *  - onClose: () => void
 *  - onApprove: () => void  (for ZTA tier after verification)
 */
export default function RiskEnforcementModal({ riskResult, actionLabel, onClose, onApprove }) {
    const [ztaVerified, setZtaVerified] = useState(false);
    const [ztaLoading, setZtaLoading] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);
    const [adminNotified, setAdminNotified] = useState(false);

    const { score, factors, enforcement } = riskResult;

    useEffect(() => {
        if (enforcement.tier === 'block') {
            setBlockTimer(30 * 60);
            setAdminNotified(true);
        }
        if (enforcement.tier === 'restrict') {
            setAdminNotified(true);
        }
    }, [enforcement.tier]);

    useEffect(() => {
        if (blockTimer > 0) {
            const t = setTimeout(() => setBlockTimer(blockTimer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [blockTimer]);

    const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleZTAVerify = () => {
        setZtaLoading(true);
        setTimeout(() => {
            setZtaLoading(false);
            setZtaVerified(true);
        }, 1500);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={enforcement.tier === 'block' ? undefined : onClose}>
            <motion.div initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88 }} className="glass-panel" style={{ maxWidth: 520, width: '100%', padding: 32, position: 'relative', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${enforcement.color}, transparent)` }} />

                {/* Close button (not for block) */}
                {enforcement.tier !== 'block' && (
                    <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={16} />
                    </button>
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: enforcement.bgColor, border: `2px solid ${enforcement.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                        {enforcement.icon}
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: enforcement.color }}>{enforcement.label}</h2>
                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Action: {actionLabel}</p>
                    </div>
                </div>

                {/* Risk Score Bar */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>RISK SCORE</span>
                        <span style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 700, color: enforcement.color }}>{score}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${enforcement.color}, ${enforcement.color}88)` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: '#475569', fontWeight: 700 }}>
                        <span>0 — Safe</span><span>40</span><span>70</span><span>90</span><span>100 — Critical</span>
                    </div>
                </div>

                {/* Risk Factors */}
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Risk Factors</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {factors.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                                <div style={{ width: 4, height: 4, borderRadius: 99, background: enforcement.color, flexShrink: 0 }} />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enforcement description */}
                <div style={{ padding: 14, background: enforcement.bgColor, border: `1px solid ${enforcement.borderColor}`, borderRadius: 10, marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: enforcement.color, lineHeight: 1.7 }}>{enforcement.description}</p>
                </div>

                {/* === TIER SPECIFIC UI === */}

                {/* APPROVE TIER */}
                {enforcement.tier === 'approve' && (
                    <button onClick={() => { onApprove?.(); onClose(); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 14 }}>
                        <CheckCircle2 size={16} /> Action Logged & Approved
                    </button>
                )}

                {/* ZTA TIER */}
                {enforcement.tier === 'zta' && !ztaVerified && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ padding: 16, background: 'rgba(245,158,11,0.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)' }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 8 }}>🔐 Zero Trust Verification Required</p>
                            <input className="input-field" placeholder="Enter ZTA Confirmation Code" defaultValue="ZTA-CONFIRM-7782" style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 2 }} />
                        </div>
                        <button onClick={handleZTAVerify} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 14, background: '#f59e0b', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }} disabled={ztaLoading}>
                            {ztaLoading ? 'Verifying ZTA...' : 'Verify & Approve Action'} {!ztaLoading && <ArrowRight size={14} />}
                        </button>
                    </div>
                )}
                {enforcement.tier === 'zta' && ztaVerified && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
                        <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>ZTA Verified — Action Approved</p>
                        <button onClick={() => { onApprove?.(); onClose(); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 13, marginTop: 12 }}>
                            Close
                        </button>
                    </motion.div>
                )}

                {/* RESTRICT TIER */}
                {enforcement.tier === 'restrict' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ padding: 14, background: 'rgba(249,115,22,0.06)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.15)', display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Mail size={18} color="#f97316" />
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#f97316' }}>Admin Notified via Email</p>
                                <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>AD-001 (Sunita Rao) has been alerted. Your access is now restricted to view-only mode until admin re-enables it.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 13 }}>
                            <Lock size={14} /> Acknowledge (View-Only Mode)
                        </button>
                    </div>
                )}

                {/* BLOCK TIER */}
                {enforcement.tier === 'block' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 44, fontFamily: 'monospace', fontWeight: 700, color: '#ef4444', padding: '14px 28px', background: 'rgba(239,68,68,0.08)', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
                            <Clock size={20} color="#ef4444" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                            {fmt(blockTimer)}
                        </div>
                        <div style={{ padding: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)' }}>
                            <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>📧 Admin AD-001 (Sunita Rao) notified</p>
                            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>All actions blocked. Only Admin can restore access before timer expires.</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
