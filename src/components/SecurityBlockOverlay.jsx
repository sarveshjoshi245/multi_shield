import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useSecurityContext } from '../context/SecurityContext';

export default function SecurityBlockOverlay() {
    const { overlay, dismissOverlay } = useSecurityContext();

    if (!overlay) return null;

    const isPending = overlay.status === 'pending';
    const isApproved = overlay.status === 'approved';
    const isBlocked = overlay.status === 'blocked';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(2, 6, 23, 0.92)',
                    backdropFilter: 'blur(12px)',
                    flexDirection: 'column',
                    gap: 0,
                }}
            >
                {/* Central Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                        maxWidth: 480,
                        width: '90%',
                        textAlign: 'center',
                        padding: 48,
                        borderRadius: 24,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                        border: `1px solid ${isBlocked ? 'rgba(239,68,68,0.2)' : isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(14,165,233,0.15)'}`,
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Icon */}
                    <div style={{ marginBottom: 28 }}>
                        {isPending && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 99, border: '3px solid rgba(14,165,233,0.15)', borderTopColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Shield size={36} color="#0ea5e9" />
                            </motion.div>
                        )}
                        {isApproved && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 99, background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <CheckCircle size={40} color="#10b981" />
                            </motion.div>
                        )}
                        {isBlocked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                style={{ width: 80, height: 80, margin: '0 auto', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <XCircle size={40} color="#ef4444" />
                            </motion.div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: 24,
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                        color: isBlocked ? '#ef4444' : isApproved ? '#10b981' : 'white',
                        marginBottom: 12,
                    }}>
                        {isPending && 'Security Review in Progress'}
                        {isApproved && 'Action Approved'}
                        {isBlocked && 'Action Blocked'}
                    </h2>

                    {/* Message */}
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
                        {isPending && 'This action has been flagged by the security monitoring system and is temporarily paused for administrative review.'}
                        {isApproved && 'The security team has approved this action. You may continue.'}
                        {isBlocked && 'Action blocked by security policy.'}
                    </p>

                    {/* Action detail */}
                    <div style={{
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: 24,
                    }}>
                        <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Flagged Action</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>{overlay.actionLabel}</p>
                        <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>System: {overlay.system}</p>
                    </div>

                    {/* Status indicator */}
                    {isPending && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            >
                                <Loader size={16} color="#0ea5e9" />
                            </motion.div>
                            <span style={{ fontSize: 13, color: '#0ea5e9', fontWeight: 600 }}>Waiting for security team approval...</span>
                        </div>
                    )}

                    {/* Dismiss button for blocked/approved */}
                    {(isApproved || isBlocked) && (
                        <button
                            onClick={dismissOverlay}
                            style={{
                                marginTop: 8,
                                padding: '10px 28px',
                                borderRadius: 10,
                                border: 'none',
                                background: isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                color: isApproved ? '#10b981' : '#ef4444',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {isApproved ? 'Continue Working' : 'Acknowledge & Return'}
                        </button>
                    )}
                </motion.div>

                {/* Lock badge at bottom */}
                {isPending && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 11 }}
                    >
                        <Lock size={12} />
                        <span>Dashboard interaction paused during review</span>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
