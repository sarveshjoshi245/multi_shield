import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, MapPin, Monitor, Wifi, Phone, ArrowRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USERS, CURRENT_SESSION, evaluateZTAContext } from '../../simulation/mockData';

export default function LoginPage() {
    const [step, setStep] = useState(1); // 1=credentials, 2=context, 3=mfa, 4=approved
    const [role, setRole] = useState('treasurer');
    const [loading, setLoading] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const navigate = useNavigate();

    const user = USERS[role];
    const ztaResult = evaluateZTAContext(user);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep(2); }, 1200);
    };

    const handleContextContinue = () => {
        if (ztaResult.requiresMFA) {
            setStep(3);
        } else {
            setStep(4);
            setTimeout(() => navigate(`/${role}`), 1500);
        }
    };

    const handleMFA = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep(4); setTimeout(() => navigate(`/${role}`), 1500); }, 1500);
    };

    const anim = { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.35 } };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '15%', right: '5%', width: '30%', height: '30%', background: 'rgba(14,165,233,0.06)', filter: 'blur(100px)', borderRadius: '50%' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: 440, padding: 40 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 56, height: 56, background: '#0284c7', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(2,132,199,0.35)' }}>
                        <Lock color="white" size={28} />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Zero Trust Gateway</h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Every access request is verified. Every time.</p>
                </div>

                {/* Step indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                    {['Credentials', 'Context Check', 'MFA', 'Access'].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: step > i + 1 ? '#10b981' : step === i + 1 ? '#0284c7' : 'rgba(255,255,255,0.05)', color: step >= i + 1 ? 'white' : '#64748b', transition: 'all 0.3s' }}>
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            {i < 3 && <div style={{ width: 20, height: 1, background: step > i + 1 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: Credentials */}
                    {step === 1 && (
                        <motion.form key="s1" {...anim} onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Select Role</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {Object.entries(USERS).map(([key, u]) => (
                                        <button type="button" key={key} onClick={() => setRole(key)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: `1px solid ${role === key ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.08)'}`, background: role === key ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)', color: role === key ? 'white' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{u.role} · {u.sector}</div>
                                            </div>
                                            {role === key && <CheckCircle2 size={18} color="#38bdf8" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <input className="input-field" placeholder="Employee ID" defaultValue={user.id} />
                            <input className="input-field" type="password" placeholder="Secure Passcode" defaultValue="••••••••" />
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15, marginTop: 8 }} disabled={loading}>
                                {loading ? 'Authenticating...' : 'Verify Identity'} {!loading && <ArrowRight size={16} />}
                            </button>
                        </motion.form>
                    )}

                    {/* STEP 2: Context Verification */}
                    {step === 2 && (
                        <motion.div key="s2" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ padding: 20, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 14 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                    <Shield size={14} /> Contextual Verification
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {ztaResult.checks.map((c, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                                            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                {c.label === 'Network (IP)' && <Wifi size={12} />}
                                                {c.label === 'Login Time' && <Clock size={12} />}
                                                {c.label === 'Device' && <Monitor size={12} />}
                                                {c.label === 'Location' && <MapPin size={12} />}
                                                {c.label}
                                            </span>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontFamily: 'monospace', color: c.passed ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{c.value}</span>
                                                <div style={{ fontSize: 10, color: c.passed ? '#10b981' : '#f59e0b', marginTop: 2 }}>{c.detail}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {ztaResult.requiresMFA && (
                                <div style={{ padding: 16, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
                                    <AlertTriangle size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>ZTA Anomaly Detected</p>
                                        <p style={{ fontSize: 11, color: 'rgba(245,158,11,0.8)', lineHeight: 1.6, marginTop: 4 }}>
                                            Contextual deviations detected. Risk score elevated by +{ztaResult.riskDelta}. Additional MFA verification required per policy.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!ztaResult.requiresMFA && (
                                <div style={{ padding: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <CheckCircle2 size={24} color="#10b981" />
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>All context checks passed. Zero Trust pattern confirmed.</p>
                                </div>
                            )}

                            <button onClick={handleContextContinue} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15 }}>
                                {ztaResult.requiresMFA ? 'Proceed to MFA Challenge' : 'Enter System'} <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: MFA */}
                    {step === 3 && (
                        <motion.div key="s3" {...anim} style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
                            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                <Phone size={28} color="#f59e0b" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Multi-Factor Authentication</h3>
                                <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>A 6-digit OTP has been sent to your registered device ({user.device})</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                {[9, 2, 7, 4, 1, 8].map((d, i) => (
                                    <div key={i} style={{ width: 44, height: 52, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: 'white' }}>
                                        {d}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleMFA} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15, marginTop: 8 }} disabled={loading}>
                                {loading ? 'Verifying OTP...' : 'Verify & Enter System'} {!loading && <ArrowRight size={16} />}
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: Access Granted */}
                    {step === 4 && (
                        <motion.div key="s4" {...anim} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }} style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={36} color="#10b981" />
                            </motion.div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>Access Granted</h3>
                            <p style={{ color: '#64748b', fontSize: 13 }}>Sector-restricted token issued. Redirecting to {user.sector} workspace...</p>
                            <div style={{ width: 32, height: 32, border: '3px solid #0284c7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <p style={{ textAlign: 'center', fontSize: 9, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginTop: 32 }}>
                    Protected by Zero Trust AI Architecture
                </p>
            </motion.div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
