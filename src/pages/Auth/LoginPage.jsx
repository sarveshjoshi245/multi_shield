import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Smartphone, Camera, HelpCircle, UserCheck, Key, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USERS, ZTA_STEPS, evaluateZTAContext } from '../../simulation/mockData';
import FaceRecognition from '../../components/FaceRecognition';
import { useTheme } from '../../context/ThemeContext';

const STEP_ICONS = { Lock, Smartphone, Camera, HelpCircle, UserCheck, Key };

export default function LoginPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [phase, setPhase] = useState('credentials');
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [ztaStep, setZtaStep] = useState(0);
    const [ztaProgress, setZtaProgress] = useState([]);
    const [ztaLoading, setZtaLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { key: 'treasurer', label: 'Treasury Officer', color: '#0ea5e9', path: '/treasurer' },
        { key: 'manager', label: 'EWS Manager', color: '#818cf8', path: '/manager' },
        { key: 'admin', label: 'System Admin', color: '#f43f5e', path: '/admin' },
    ];

    const handleCredentialLogin = () => {
        const role = roles.find(r => r.key === selectedRole);
        if (!role) { setError('Select a role'); return; }
        setError('');
        setPhase('otp');
    };

    const handleOTPSubmit = () => {
        if (otp.length < 4) { setError('Enter valid OTP'); return; }
        setError('');

        const ztaResult = evaluateZTAContext(USERS[selectedRole]);
        if (ztaResult.requiresMFA) {
            setPhase('zta');
            setZtaStep(0);
            setZtaProgress([]);
        } else {
            const role = roles.find(r => r.key === selectedRole);
            navigate(role.path);
        }
    };

    const handleZtaStepComplete = (stepIndex) => {
        setZtaProgress(prev => [...prev, stepIndex]);
        if (stepIndex < ZTA_STEPS.length - 1) {
            setTimeout(() => setZtaStep(stepIndex + 1), 300);
        } else {
            setTimeout(() => {
                const role = roles.find(r => r.key === selectedRole);
                navigate(role.path);
            }, 800);
        }
    };

    const simulateStepVerify = (stepIndex) => {
        if (stepIndex === 2) return; // Face recognition handled separately
        setZtaLoading(true);
        setTimeout(() => {
            setZtaLoading(false);
            handleZtaStepComplete(stepIndex);
        }, 1200);
    };

    const currentStep = ZTA_STEPS[ztaStep];
    const StepIcon = currentStep ? STEP_ICONS[currentStep.icon] : Lock;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: isDark
                ? 'radial-gradient(ellipse at top, #0c4a6e 0%, #020617 50%)'
                : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f8fafc 100%)',
        }}>
            <div style={{ maxWidth: 960, width: '100%', display: 'grid', gridTemplateColumns: phase === 'zta' ? '300px 1fr' : '1fr', gap: 24 }}>

                {/* ZTA Sidebar */}
                {phase === 'zta' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: 28, alignSelf: 'start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                            <Shield size={20} color="#0284c7" />
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>ZTA Verification</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {ZTA_STEPS.map((step, i) => {
                                const completed = ztaProgress.includes(i);
                                const active = ztaStep === i;
                                const Icon = STEP_ICONS[step.icon] || Lock;
                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                                        borderRadius: 10,
                                        background: active ? 'var(--risk-blue-bg)' : 'transparent',
                                        border: active ? '1px solid var(--border-active)' : '1px solid transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 99,
                                            background: completed ? 'rgba(16,185,129,0.15)' : active ? 'rgba(14,165,233,0.15)' : 'var(--bg-card-subtle)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            border: `1px solid ${completed ? 'rgba(16,185,129,0.3)' : active ? 'rgba(14,165,233,0.3)' : 'var(--border-subtle)'}`,
                                        }}>
                                            {completed ? <CheckCircle size={14} color="#10b981" /> : <Icon size={14} color={active ? '#0ea5e9' : 'var(--text-faint)'} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 11, fontWeight: active || completed ? 700 : 500, color: completed ? '#10b981' : active ? '#0ea5e9' : 'var(--text-muted)' }}>{step.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: 20, padding: 12, background: 'var(--bg-card-subtle)', borderRadius: 8 }}>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Progress</p>
                            <div style={{ marginTop: 6, height: 4, borderRadius: 99, background: 'var(--border-primary)', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${(ztaProgress.length / ZTA_STEPS.length) * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #10b981)', borderRadius: 99 }} />
                            </div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: '#0ea5e9', marginTop: 6 }}>{ztaProgress.length}/{ZTA_STEPS.length} verified</p>
                        </div>
                    </motion.div>
                )}

                {/* Main Card */}
                <div className="glass-panel" style={{ padding: 40, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #0284c7, #6366f1, #f43f5e)' }} />

                    <AnimatePresence mode="wait">
                        {/* CREDENTIALS */}
                        {phase === 'credentials' && (
                            <motion.div key="cred" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                                    <div style={{ width: 56, height: 56, margin: '0 auto 16px', background: '#0284c7', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Shield color="white" size={28} />
                                    </div>
                                    <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Multi<span style={{ color: '#0ea5e9' }}>Shield</span></h1>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Zero Trust Banking Security Platform</p>
                                </div>

                                {/* Role Selection */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', display: 'block', marginBottom: 12 }}>Select Access Level</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                        {roles.map(role => (
                                            <button key={role.key} onClick={() => setSelectedRole(role.key)}
                                                style={{
                                                    padding: 16, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                                                    border: `1.5px solid ${selectedRole === role.key ? role.color : 'var(--border-primary)'}`,
                                                    background: selectedRole === role.key ? `${role.color}10` : 'var(--bg-card)',
                                                    color: selectedRole === role.key ? role.color : 'var(--text-muted)',
                                                    transition: 'all 0.2s', fontWeight: selectedRole === role.key ? 700 : 500,
                                                    fontSize: 12,
                                                }}>
                                                {role.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Employee ID</label>
                                        <input className="input-field" placeholder="EM-XXX" value={empId} onChange={e => setEmpId(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Password</label>
                                        <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

                                <button onClick={handleCredentialLogin} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                                    Authenticate <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        )}

                        {/* OTP */}
                        {phase === 'otp' && (
                            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                    <div style={{ width: 56, height: 56, margin: '0 auto 16px', background: 'var(--risk-blue-bg)', border: '2px solid var(--border-active)', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Smartphone size={24} color="#0ea5e9" />
                                    </div>
                                    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>OTP Verification</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Enter the 6-digit code sent to your device</p>
                                </div>

                                <input className="input-field" value={otp} onChange={e => setOtp(e.target.value)} placeholder="• • • • • •"
                                    style={{ textAlign: 'center', fontSize: 24, fontFamily: 'monospace', letterSpacing: 12, marginBottom: 20, fontWeight: 700 }} maxLength={6} />

                                {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

                                <button onClick={handleOTPSubmit} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                                    Verify Code <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        )}

                        {/* ZTA Steps */}
                        {phase === 'zta' && currentStep && (
                            <motion.div key={`zta-${ztaStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                    <div style={{ width: 56, height: 56, margin: '0 auto 16px', background: 'var(--risk-blue-bg)', border: '2px solid var(--border-active)', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <StepIcon size={24} color="#0ea5e9" />
                                    </div>
                                    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Step {ztaStep + 1}: {currentStep.label}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>{currentStep.description}</p>
                                </div>

                                {/* Face Recognition step */}
                                {ztaStep === 2 ? (
                                    <FaceRecognition onSuccess={() => handleZtaStepComplete(2)} />
                                ) : (
                                    <>
                                        <div style={{
                                            padding: 16, background: 'var(--bg-card-subtle)', borderRadius: 12,
                                            border: '1px solid var(--border-subtle)', marginBottom: 24, textAlign: 'center'
                                        }}>
                                            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Simulated Value</p>
                                            <p style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, marginTop: 6, color: 'var(--text-primary)' }}>{currentStep.simValue}</p>
                                        </div>

                                        <button onClick={() => simulateStepVerify(ztaStep)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={ztaLoading}>
                                            {ztaLoading ? (
                                                <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
                                            ) : (
                                                <>Verify <ArrowRight size={16} /></>
                                            )}
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
