import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, ShieldCheck, Clock, Laptop, Database, Save, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PolicyEngine() {
    const [settings, setSettings] = useState({
        blockThreshold: 85,
        mfaThreshold: 40,
        accessHours: '08:00–20:00',
        allowedDevices: 'Corporate Laptop / Registered Devices',
        restrictedSystems: 'Treasury DB, Customer DB',
        offHoursDetection: true,
        unknownDeviceDetection: true,
        bulkDataDetection: true,
    });

    const [showToast, setShowToast] = useState(false);
    const { isDark } = useTheme();

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Policy Engine</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Configure security protocols and zero-trust orchestration</p>
                </div>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px' }}>
                    <Save size={18} /> Save Policy
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Policy Configuration Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sliders size={20} color="#818cf8" />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Risk Threshold Settings</h2>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 600 }}>Critical Block Threshold</span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{settings.blockThreshold}</span>
                            </div>
                            <input
                                type="range" min="0" max="100"
                                value={settings.blockThreshold}
                                onChange={(e) => setSettings({ ...settings, blockThreshold: e.target.value })}
                                style={{ width: '100%', accentColor: '#ef4444' }}
                            />
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 600 }}>MFA Trigger Threshold</span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>{settings.mfaThreshold}</span>
                            </div>
                            <input
                                type="range" min="0" max="100"
                                value={settings.mfaThreshold}
                                onChange={(e) => setSettings({ ...settings, mfaThreshold: e.target.value })}
                                style={{ width: '100%', accentColor: '#f59e0b' }}
                            />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={20} color="#10b981" />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Zero Trust Policy Rules</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { icon: Clock, label: 'Allow Access Hours', value: settings.accessHours, key: 'accessHours' },
                                { icon: Laptop, label: 'Allowed Devices', value: settings.allowedDevices, key: 'allowedDevices' },
                                { icon: Database, label: 'Restricted Systems', value: settings.restrictedSystems, key: 'restrictedSystems' },
                            ].map(field => (
                                <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <field.icon size={16} color="var(--text-muted)" />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{field.label}</p>
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                                            className="input-field"
                                            style={{ marginTop: 4, padding: '6px 10px', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Policy Toggle Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-panel" style={{ padding: 24, height: '100%' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Rule Enforcement Toggles</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {[
                                { label: 'Enable Off-hours Access Detection', desc: 'Force MFA or block access outside defined operational hours', key: 'offHoursDetection' },
                                { label: 'Enable Unknown Device Detection', desc: 'Restrict access to managed corporate hardware only', key: 'unknownDeviceDetection' },
                                { label: 'Enable Bulk Data Download Detection', desc: 'Monitor and limit large database export operations', key: 'bulkDataDetection' },
                            ].map((policy) => (
                                <div key={policy.key} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: 16, background: 'var(--bg-card-subtle)', borderRadius: 12,
                                    border: '1px solid var(--border-subtle)'
                                }}>
                                    <div>
                                        <h4 style={{ fontSize: 14, fontWeight: 600 }}>{policy.label}</h4>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{policy.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, [policy.key]: !settings[policy.key] })}
                                        style={{
                                            width: 44, height: 24, borderRadius: 99,
                                            background: settings[policy.key] ? '#0284c7' : 'var(--border-primary)',
                                            border: 'none', cursor: 'pointer', position: 'relative',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ x: settings[policy.key] ? 20 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            style={{ width: 18, height: 18, borderRadius: 99, background: 'white', position: 'absolute', top: 3, left: 3 }}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        style={{
                            position: 'fixed', bottom: 40, left: '50%',
                            background: '#0ea5e9', color: 'white',
                            padding: '12px 24px', borderRadius: 12,
                            display: 'flex', alignItems: 'center', gap: 10,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                            zIndex: 1000
                        }}
                    >
                        <CheckCircle size={20} />
                        <span style={{ fontWeight: 600 }}>Policy updated successfully</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
