import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, MapPin, Monitor, Wifi, Phone, ArrowRight, CheckCircle2, AlertTriangle, Clock, Fingerprint, HelpCircle, UserCheck, Key, X, ShieldOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USERS, CURRENT_SESSION, evaluateZTAContext, ZTA_STEPS } from '../../simulation/mockData';

export default function LoginPage() {
    const [phase, setPhase] = useState('normal'); // 'normal' | 'zta' | 'blocked'
    const [normalStep, setNormalStep] = useState(1); // 1=password, 2=otp, 3=done
    const [ztaStep, setZtaStep] = useState(0);
    const [role, setRole] = useState('treasurer');
    const [loading, setLoading] = useState(false);
    const [blockTimer, setBlockTimer] = useState(0);
    const [contextChecked, setContextChecked] = useState(false);
    const [ztaFailed, setZtaFailed] = useState(false);
    const navigate = useNavigate();

    const user = USERS[role];
    const ztaResult = evaluateZTAContext(user);

    // Block timer countdown
    useEffect(() => {
        if (blockTimer > 0) {
            const t = setTimeout(() => setBlockTimer(blockTimer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [blockTimer]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // Normal Step 1: Password
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setNormalStep(2);
        }, 1000);
    };

    // Normal Step 2: OTP → then context check
    const handleOTPSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setContextChecked(true);
            if (ztaResult.requiresMFA) {
                // Anomaly detected → activate ZTA engine
                setPhase('zta');
                setZtaStep(1);
            } else {
                // All good → grant access
                setNormalStep(3);
                setTimeout(() => navigate(`/${role}`), 1500);
            }
        }, 1200);
    };

    // ZTA step verification
    const handleZTAStepVerify = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (ztaStep < 6) {
                setZtaStep(ztaStep + 1);
            } else {
                // All 6 passed → grant access
                setPhase('normal');
                setNormalStep(3);
                setTimeout(() => navigate(`/${role}`), 1500);
            }
        }, 1200);
    };

    // ZTA step failure
    const handleZTAFail = () => {
        setZtaFailed(true);
        setPhase('blocked');
        setBlockTimer(30 * 60); // 30 min in seconds
    };

    const anim = { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.35 } };

    const ztaIcons = { Lock, Smartphone: Phone, Fingerprint, HelpCircle, UserCheck, Key };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '15%', right: '5%', width: '30%', height: '30%', background: 'rgba(14,165,233,0.06)', filter: 'blur(100px)', borderRadius: '50%' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: phase === 'zta' ? 560 : 440, padding: 40, transition: 'max-width 0.4s ease' }}>

                {/* === BLOCKED STATE === */}
                {phase === 'blocked' && (
                    <motion.div {...anim} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '20px 0' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldOff size={40} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>Access Blocked</h2>
                        <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 320, lineHeight: 1.7 }}>
                            ZTA verification failed at Step {ztaStep}. Your access has been suspended for 30 minutes. An alert has been sent to the System Admin.
                        </p>
                        <div style={{ fontSize: 48, fontFamily: 'monospace', fontWeight: 700, color: '#ef4444', padding: '16px 32px', background: 'rgba(239,68,68,0.08)', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
                            {formatTime(blockTimer)}
                        </div>
                        <div style={{ padding: 16, background: 'rgba(239,68,68,0.06)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.12)', width: '100%' }}>
                            <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>📧 Admin notified: AD-001 (Sunita Rao)</p>
                            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Incident ID: INC-{Date.now().toString().slice(-6)} · Only Admin can restore access before timer expires.</p>
                        </div>
                    </motion.div>
                )}

                {/* === NORMAL LOGIN FLOW === */}
                {phase === 'normal' && (
                    <>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, background: normalStep === 3 ? '#10b981' : '#0284c7', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 8px 24px ${normalStep === 3 ? 'rgba(16,185,129,0.35)' : 'rgba(2,132,199,0.35)'}`, transition: 'all 0.4s' }}>
                                {normalStep === 3 ? <CheckCircle2 color="white" size={28} /> : <Lock color="white" size={28} />}
                            </div>
                            <h1 style={{ fontSize: 26, fontWeight: 700 }}>{normalStep === 3 ? 'Access Granted' : 'Secure Login'}</h1>
                            <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>{normalStep === 3 ? `Redirecting to ${user.sector} workspace...` : 'Standard authentication'}</p>
                        </div>

                        {/* Progress */}
                        {normalStep < 3 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
                                {['Password', 'OTP'].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: normalStep > i + 1 ? '#10b981' : normalStep === i + 1 ? '#0284c7' : 'rgba(255,255,255,0.05)', color: normalStep >= i + 1 ? 'white' : '#64748b', transition: 'all 0.3s' }}>
                                            {normalStep > i + 1 ? '✓' : i + 1}
                                        </div>
                                        {i < 1 && <div style={{ width: 24, height: 1, background: normalStep > i + 1 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />}
                                    </div>
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* Step 1: Role + Password */}
                            {normalStep === 1 && (
                                <motion.form key="n1" {...anim} onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Select Role</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {Object.entries(USERS).map(([key, u]) => (
                                                <button type="button" key={key} onClick={() => setRole(key)}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: `1px solid ${role === key ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.08)'}`, background: role === key ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)', color: role === key ? 'white' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                                                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{u.role} · {u.sector}</div>
                                                    </div>
                                                    {role === key && <CheckCircle2 size={16} color="#38bdf8" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <input className="input-field" placeholder="Employee ID" defaultValue={user.id} />
                                    <input className="input-field" type="password" placeholder="Password" defaultValue="••••••••" />
                                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 14, marginTop: 4 }} disabled={loading}>
                                        {loading ? 'Verifying...' : 'Continue'} {!loading && <ArrowRight size={15} />}
                                    </button>
                                </motion.form>
                            )}

                            {/* Step 2: OTP */}
                            {normalStep === 2 && (
                                <motion.div key="n2" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                        <Phone size={24} color="#38bdf8" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>OTP Verification</h3>
                                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>A 6-digit code has been sent to {user.device}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                        {[9, 2, 7, 4, 1, 8].map((d, i) => (
                                            <div key={i} style={{ width: 40, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'white' }}>{d}</div>
                                        ))}
                                    </div>
                                    <button onClick={handleOTPSubmit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 14 }} disabled={loading}>
                                        {loading ? 'Verifying OTP & Context...' : 'Verify OTP'} {!loading && <ArrowRight size={15} />}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 3: Access Granted */}
                            {normalStep === 3 && (
                                <motion.div key="n3" {...anim} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }} style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={36} color="#10b981" />
                                    </motion.div>
                                    <p style={{ color: '#64748b', fontSize: 13 }}>Sector-restricted token issued.</p>
                                    <div style={{ width: 28, height: 28, border: '3px solid #0284c7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* === ZTA 6-STEP ENGINE === */}
                {phase === 'zta' && (
                    <motion.div {...anim} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* ZTA Header */}
                        <div style={{ padding: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, display: 'flex', gap: 12 }}>
                            <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>⚡ Zero Trust Engine Activated</p>
                                <p style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)', lineHeight: 1.6, marginTop: 4 }}>
                                    Anomalous context detected (Risk +{ztaResult.riskDelta}). Complete all 6 verification steps. Failure at any step → 30 min lockout + admin alert.
                                </p>
                            </div>
                        </div>

                        {/* Context checks summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {ztaResult.checks.map((c, i) => (
                                <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: c.passed ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${c.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                                    <span style={{ color: '#94a3b8' }}>{c.label}</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: c.passed ? '#10b981' : '#ef4444' }}>{c.passed ? '✓' : '✗'}</span>
                                </div>
                            ))}
                        </div>

                        {/* ZTA Steps Progress */}
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            {ZTA_STEPS.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: ztaStep > s.id ? '#10b981' : ztaStep === s.id ? '#0284c7' : 'rgba(255,255,255,0.05)', color: ztaStep >= s.id ? 'white' : '#475569', transition: 'all 0.3s' }}>
                                        {ztaStep > s.id ? '✓' : s.id}
                                    </div>
                                    {i < 5 && <div style={{ width: 12, height: 1, background: ztaStep > s.id ? '#10b981' : 'rgba(255,255,255,0.08)' }} />}
                                </div>
                            ))}
                        </div>

                        {/* Current ZTA Step */}
                        {ztaStep >= 1 && ztaStep <= 6 && (
                            <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ztaStep === 1 && <Lock size={22} color="#38bdf8" />}
                                        {ztaStep === 2 && <Phone size={22} color="#38bdf8" />}
                                        {ztaStep === 3 && <Fingerprint size={22} color="#38bdf8" />}
                                        {ztaStep === 4 && <HelpCircle size={22} color="#38bdf8" />}
                                        {ztaStep === 5 && <UserCheck size={22} color="#38bdf8" />}
                                        {ztaStep === 6 && <Key size={22} color="#38bdf8" />}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Step {ztaStep}: {ZTA_STEPS[ztaStep - 1]?.label}</h3>
                                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{ZTA_STEPS[ztaStep - 1]?.description}</p>
                                    </div>
                                </div>

                                {/* Simulated input for each step */}
                                {ztaStep === 1 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <input className="input-field" placeholder="Employee ID" defaultValue={user.id} />
                                        <input className="input-field" type="password" placeholder="Password" defaultValue="••••••••" />
                                    </div>
                                )}
                                {ztaStep === 2 && (
                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                        {[9, 2, 7, 4, 1, 8].map((d, i) => (
                                            <div key={i} style={{ width: 40, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: 'white' }}>{d}</div>
                                        ))}
                                    </div>
                                )}
                                {ztaStep === 3 && (
                                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                        <div className="animate-pulse-glow" style={{ width: 80, height: 80, borderRadius: 99, background: 'rgba(14,165,233,0.1)', border: '2px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                            <Fingerprint size={36} color="#38bdf8" />
                                        </div>
                                        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Place your finger on the sensor...</p>
                                    </div>
                                )}
                                {ztaStep === 4 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <p style={{ fontSize: 12, color: '#94a3b8' }}>What city were you born in?</p>
                                        <input className="input-field" type="text" placeholder="Your answer" defaultValue="Mumbai" />
                                    </div>
                                )}
                                {ztaStep === 5 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <p style={{ fontSize: 12, color: '#94a3b8' }}>Enter the authorization code from your reporting manager:</p>
                                        <input className="input-field" placeholder="MGR-CODE-XXXX" defaultValue="MGR-CODE-8847" style={{ fontFamily: 'monospace', letterSpacing: 2 }} />
                                    </div>
                                )}
                                {ztaStep === 6 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
                                        <p style={{ fontSize: 12, color: '#94a3b8' }}>Insert your hardware security token:</p>
                                        <div style={{ padding: '12px 20px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', fontFamily: 'monospace', fontSize: 18, letterSpacing: 4, fontWeight: 700, color: '#10b981' }}>
                                            TOKEN-4488-XR
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={handleZTAFail} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <X size={14} /> Fail Step (Demo)
                            </button>
                            <button onClick={handleZTAStepVerify} className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '12px 0', fontSize: 13 }} disabled={loading}>
                                {loading ? 'Verifying...' : ztaStep === 6 ? 'Complete & Enter System' : `Verify Step ${ztaStep}`} {!loading && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </motion.div>
                )}

                <p style={{ textAlign: 'center', fontSize: 8, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginTop: 28 }}>
                    Protected by Zero Trust AI Architecture
                </p>
            </motion.div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
