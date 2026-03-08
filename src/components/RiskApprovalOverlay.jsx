import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Lock, Loader, Mail, Clock, AlertTriangle, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useSecurityContext } from '../context/SecurityContext';

/**
 * RiskApprovalOverlay — unified overlay for all 4 risk tiers.
 * Replaces the old SecurityBlockOverlay.
 */
export default function RiskApprovalOverlay() {
    const { overlay, dismissOverlay, ztaVerificationPassed, ztaVerificationFailed } = useSecurityContext();
    const [ztaCode, setZtaCode] = useState('');
    const [ztaLoading, setZtaLoading] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);

    // Block timer setup
    useEffect(() => {
        if (overlay?.tier === 'block' && overlay?.status === 'pending') {
            setBlockTimer(30 * 60);
        }
        if (overlay?.status === 'blocked') {
            setBlockTimer(30 * 60);
        }
    }, [overlay?.tier, overlay?.status]);

    // Countdown
    useEffect(() => {
        if (blockTimer > 0) {
            const t = setTimeout(() => setBlockTimer(blockTimer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [blockTimer]);

    if (!overlay) return null;

    const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const isApproved = overlay.status === 'approved';
    const isBlocked = overlay.status === 'blocked';
    const isPending = overlay.status === 'pending';

    const handleZTAVerify = () => {
        setZtaLoading(true);
        setTimeout(() => {
            setZtaLoading(false);
            if (ztaCode.trim().length > 0) {
                ztaVerificationPassed(overlay.id);
            }
        }, 1500);
    };

    const handleZTAFail = () => {
        ztaVerificationFailed(overlay.id);
    };

    const tierConfig = {
        approve: {
            color: '#10b981',
            bgAccent: 'rgba(16,185,129,0.06)',
            borderAccent: 'rgba(16,185,129,0.2)',
            icon: <CheckCircle size={36} color="#10b981" />,
            title: 'Action Approved',
            subtitle: 'This action has been approved and logged.',
        },
        zta: {
            color: '#f59e0b',
            bgAccent: 'rgba(245,158,11,0.06)',
            borderAccent: 'rgba(245,158,11,0.2)',
            icon: <Shield size={36} color="#f59e0b" />,
            title: 'Zero Trust Verification Required',
            subtitle: 'Elevated risk detected. Complete ZTA verification to proceed.',
        },
        restrict: {
            color: '#f97316',
            bgAccent: 'rgba(249,115,22,0.06)',
            borderAccent: 'rgba(249,115,22,0.2)',
            icon: <AlertTriangle size={36} color="#f97316" />,
            title: 'Access Restricted',
            subtitle: 'Your access has been restricted. Admin has been notified and must approve.',
        },
        block: {
            color: '#ef4444',
            bgAccent: 'rgba(239,68,68,0.06)',
            borderAccent: 'rgba(239,68,68,0.2)',
            icon: <Lock size={36} color="#ef4444" />,
            title: 'BLOCKED — 30 Min Lockout',
            subtitle: 'All access blocked. Admin has been notified for manual review.',
        },
    };

    const currentTier = isBlocked ? 'block' : overlay.tier;
    const cfg = tierConfig[currentTier] || tierConfig.block;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)',
                    flexDirection: 'column',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        maxWidth: 500, width: '90%', textAlign: 'center',
                        padding: '40px 36px',
                        borderRadius: 20,
                        background: 'var(--bg-card)',
                        border: `1px solid ${isApproved ? 'rgba(16,185,129,0.3)' : cfg.borderAccent}`,
                        boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Top accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '20px 20px 0 0', background: `linear-gradient(90deg, ${isApproved ? '#10b981' : cfg.color}, transparent)` }} />

                    {/* Icon */}
                    <div style={{ marginBottom: 20 }}>
                        {isApproved ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                                style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 99, background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={36} color="#10b981" />
                            </motion.div>
                        ) : isBlocked ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                                style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <XCircle size={36} color="#ef4444" />
                            </motion.div>
                        ) : isPending && overlay.tier === 'approve' ? (
                            <div style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 99, background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={36} color="#10b981" />
                            </div>
                        ) : (
                            <div style={{ width: 72, height: 72, margin: '0 auto', borderRadius: 99, background: cfg.bgAccent, border: `2px solid ${cfg.borderAccent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cfg.icon}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: 22, fontWeight: 700, fontFamily: 'Outfit',
                        color: isApproved ? '#10b981' : isBlocked ? '#ef4444' : cfg.color,
                        marginBottom: 8,
                    }}>
                        {isApproved ? 'Action Approved ✓' : cfg.title}
                    </h2>

                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
                        {isApproved ? 'You may continue working.' : cfg.subtitle}
                    </p>

                    {/* Action detail */}
                    <div style={{
                        padding: '10px 16px',
                        background: 'var(--bg-card-subtle)',
                        borderRadius: 10,
                        border: '1px solid var(--border-primary)',
                        marginBottom: 20,
                        textAlign: 'left',
                    }}>
                        <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Action Details</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{overlay.actionLabel}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>System: {overlay.system} · Risk Score: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: cfg.color }}>{overlay.riskScore}</span></p>
                    </div>

                    {/* === TIER-SPECIFIC CONTENT === */}

                    {/* APPROVE: auto-dismiss, just show success */}
                    {(overlay.tier === 'approve' || isApproved) && (
                        <button onClick={dismissOverlay} style={{
                            padding: '10px 28px', borderRadius: 10, border: 'none',
                            background: 'rgba(16,185,129,0.1)', color: '#10b981',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}>
                            Continue Working
                        </button>
                    )}

                    {/* ZTA TIER: verification challenge */}
                    {overlay.tier === 'zta' && isPending && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                            <div style={{ padding: 14, background: 'rgba(245,158,11,0.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)' }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>🔐 Enter ZTA Confirmation Code</p>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 10 }}>Complete verification to proceed. Failure will result in 30-minute lockout.</p>
                                <input
                                    className="input-field"
                                    placeholder="ZTA-CONFIRM-XXXX"
                                    value={ztaCode}
                                    onChange={e => setZtaCode(e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: 2 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={handleZTAFail}
                                    style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                    <X size={14} /> Fail (Demo)
                                </button>
                                <button onClick={handleZTAVerify}
                                    className="btn-primary"
                                    style={{ flex: 2, justifyContent: 'center', padding: '10px 0', fontSize: 13, background: '#f59e0b', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
                                    disabled={ztaLoading || !ztaCode.trim()}>
                                    {ztaLoading ? 'Verifying...' : 'Verify & Approve'} {!ztaLoading && <ArrowRight size={14} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* RESTRICT TIER: waiting for admin */}
                    {overlay.tier === 'restrict' && isPending && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ padding: 14, background: 'rgba(249,115,22,0.06)', borderRadius: 10, border: '1px solid rgba(249,115,22,0.15)', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <Mail size={18} color="#f97316" />
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#f97316' }}>Admin Notified via Email</p>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>AD-001 (Sunita Rao) has been alerted. Waiting for admin to approve your access.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '8px 0' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                                    <Loader size={16} color="#f97316" />
                                </motion.div>
                                <span style={{ fontSize: 13, color: '#f97316', fontWeight: 600 }}>Waiting for admin approval...</span>
                            </div>
                        </div>
                    )}

                    {/* BLOCK TIER: countdown timer */}
                    {(overlay.tier === 'block' || isBlocked) && !isApproved && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center' }}>
                            <div style={{
                                fontSize: 40, fontFamily: 'monospace', fontWeight: 700, color: '#ef4444',
                                padding: '14px 28px', background: 'rgba(239,68,68,0.06)',
                                borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)',
                            }}>
                                <Clock size={18} color="#ef4444" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                                {fmt(blockTimer)}
                            </div>
                            <div style={{ padding: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)' }}>
                                <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>📧 Admin AD-001 (Sunita Rao) notified</p>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>All actions blocked. Only Admin can restore access before timer expires.</p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Bottom lock badge */}
                {isPending && overlay.tier !== 'approve' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-faint)', fontSize: 11 }}>
                        <Lock size={12} />
                        <span>Dashboard interaction paused during review</span>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
