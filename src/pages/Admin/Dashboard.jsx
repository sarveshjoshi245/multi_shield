import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldCheck, Users, Database, Save, RefreshCcw, AlertTriangle, Lock, Sliders, Bell, Eye, Mail } from 'lucide-react';
import { DEFAULT_POLICIES, INCIDENTS, ACTIVITY_LOGS, getRiskAction } from '../../simulation/mockData';

export default function AdminDashboard() {
    const [policies, setPolicies] = useState({ ...DEFAULT_POLICIES });

    const updatePolicy = (key, value) => setPolicies(prev => ({ ...prev, [key]: value }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Control Center</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Global Policies, Sector Limits & Manager Oversight</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-secondary" style={{ fontSize: 12 }}><Mail size={14} /> Mailbox</button>
                    <button className="btn-secondary" style={{ fontSize: 12 }}><RefreshCcw size={14} /> Reset Defaults</button>
                    <button className="btn-primary" style={{ fontSize: 12 }}><Save size={14} /> Push to Edge</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Left: Policy Engine */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Risk Thresholds */}
                    <div className="glass-panel" style={{ padding: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sliders size={22} color="#818cf8" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Policy Decision Engine</h2>
                                <p style={{ fontSize: 12, color: '#64748b' }}>Configure automated risk-based access control</p>
                            </div>
                        </div>

                        {/* Block Threshold */}
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Critical Block Threshold</h4>
                                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Score at which user is auto-blocked & admin notified</p>
                                </div>
                                <span style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>{policies.criticalBlockThreshold}</span>
                            </div>
                            <input type="range" min="50" max="99" value={policies.criticalBlockThreshold} onChange={e => updatePolicy('criticalBlockThreshold', Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', fontWeight: 700, marginTop: 4 }}>
                                <span>Conservative (50)</span><span>Aggressive (99)</span>
                            </div>
                        </div>

                        {/* MFA Threshold */}
                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>MFA Trigger Threshold</h4>
                                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Score above which MFA is required & access restricted</p>
                                </div>
                                <span style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b' }}>{policies.mfaThreshold}</span>
                            </div>
                            <input type="range" min="20" max="70" value={policies.mfaThreshold} onChange={e => updatePolicy('mfaThreshold', Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
                        </div>

                        {/* Risk Score Table */}
                        <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>Active Enforcement Rules</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { range: `≤ ${policies.mfaThreshold}`, action: 'Allow activity and monitor', color: '#10b981' },
                                    { range: `${policies.mfaThreshold}–${policies.restrictThreshold}`, action: 'Require MFA + restrict to essential modules', color: '#f59e0b' },
                                    { range: `${policies.restrictThreshold}–${policies.criticalBlockThreshold}`, action: 'Restrict sensitive data access', color: '#f97316' },
                                    { range: `> ${policies.criticalBlockThreshold}`, action: 'BLOCK action + alert admin', color: '#ef4444' },
                                ].map((r, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '8px 12px', background: `${r.color}08`, borderRadius: 8, border: `1px solid ${r.color}15` }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: r.color, minWidth: 60 }}>{r.range}</span>
                                        <span style={{ color: '#94a3b8' }}>{r.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Policy Toggles */}
                    <div className="glass-panel" style={{ padding: 32 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Security Policies</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            {[
                                { label: 'Off-hours MFA', desc: `Enforce MFA outside ${policies.allowedLoginStart}:00–${policies.allowedLoginEnd}:00`, active: true },
                                { label: 'IP Geo-fencing', desc: 'Restrict to corporate subnet IPs only', active: true },
                                { label: 'Cross-Sector Lock', desc: 'Block single-session multi-sector access', active: true },
                                { label: 'Bulk Export Limit', desc: `Max ${policies.maxDbRecords.toLocaleString()} records per export`, active: true },
                            ].map((p, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</h4>
                                        <p style={{ fontSize: 10, color: '#64748b', marginTop: 2, maxWidth: 180, lineHeight: 1.5 }}>{p.desc}</p>
                                    </div>
                                    <button style={{ width: 40, height: 22, borderRadius: 99, background: p.active ? '#0284c7' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', position: 'relative' }}>
                                        <div style={{ width: 16, height: 16, borderRadius: 99, background: 'white', position: 'absolute', top: 3, transition: 'all 0.2s', ...(p.active ? { right: 3 } : { left: 3 }) }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sector Limits */}
                    <div className="glass-panel" style={{ padding: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <Database size={20} color="#10b981" />
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Sector Operational Limits</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                            {[
                                { sector: 'Treasury', limit: `₹${(policies.maxTransactionLimit / 100000).toLocaleString()} L`, type: 'Max Transaction' },
                                { sector: 'Loan Origination', limit: `${policies.maxDbRecords.toLocaleString()} Recs`, type: 'Max DB Export' },
                                { sector: 'Customer DB', limit: 'Read/Write', type: 'Access Level' },
                                { sector: 'Core Banking', limit: `${policies.allowedLoginStart}:00–${policies.allowedLoginEnd}:00`, type: 'Login Window' },
                            ].map((s, i) => (
                                <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, textAlign: 'center' }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{s.sector}</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit', marginTop: 8, color: 'white' }}>{s.limit}</p>
                                    <p style={{ fontSize: 10, color: '#38bdf8', marginTop: 4 }}>{s.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Manager Audit + Incidents + ZTA Health */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Critical Incidents */}
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Bell size={16} color="#ef4444" /> Critical Alerts
                            </h3>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', padding: '3px 8px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>{INCIDENTS.filter(i => i.severity === 'Critical').length} ACTIVE</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {INCIDENTS.map(inc => (
                                <div key={inc.id} style={{ padding: 14, background: inc.severity === 'Critical' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${inc.severity === 'Critical' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 700 }}>{inc.type}</p>
                                            <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{inc.user} · Score: <span style={{ fontFamily: 'monospace', color: getRiskAction(inc.riskScore).color, fontWeight: 700 }}>{inc.riskScore}</span></p>
                                        </div>
                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 4, background: inc.status === 'Auto-Blocked' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: inc.status === 'Auto-Blocked' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>{inc.status}</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>{inc.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Manager Audit */}
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ShieldCheck size={16} color="#f43f5e" /> Manager Activity Audit
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { name: 'MG-012 (Priya D.)', action: 'Resolved Incident INC-001', time: 'Just Now', flag: false },
                                { name: 'MG-005 (Karan M.)', action: 'Overrode ZTA flag for EM-204', time: '14m ago', flag: true },
                                { name: 'MG-012 (Priya D.)', action: 'Viewed 8 activity logs', time: '1h ago', flag: false },
                            ].map((log, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10 }}>
                                    <div style={{ width: 3, borderRadius: 99, background: log.flag ? '#f43f5e' : '#0ea5e9', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600 }}>{log.name}</p>
                                        <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{log.action}</p>
                                        <p style={{ fontSize: 9, color: '#475569', marginTop: 4, fontWeight: 700 }}>{log.time}</p>
                                    </div>
                                    {log.flag && <AlertTriangle size={14} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ZTA Health */}
                    <div className="glass-card" style={{ padding: 20, background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.12)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Lock size={16} color="#38bdf8" />
                            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>ZTA Health</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                ['Contexts Validated', '14,204'],
                                ['Context Failures', '12'],
                                ['MFA Success Rate', '99.2%'],
                                ['Active Sessions', '47'],
                            ].map(([k, v], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                    <span style={{ color: '#94a3b8' }}>{k}</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'white' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
