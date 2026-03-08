import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ShieldCheck, Users, Database, Save, RefreshCcw, AlertTriangle, Lock, Sliders, Bell, Eye, Mail, CheckCircle, XCircle, Clock, X, Inbox, Activity, Shield } from 'lucide-react';
import { DEFAULT_POLICIES, INCIDENTS, ACTIVITY_LOGS, getRiskAction } from '../../simulation/mockData';
import { useSecurityContext } from '../../context/SecurityContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminDashboard() {
    const [policies, setPolicies] = useState({ ...DEFAULT_POLICIES });
    const [showMailbox, setShowMailbox] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { pendingReviews, approveReview, blockReview, userNotifications } = useSecurityContext();
    const { isDark } = useTheme();

    const updatePolicy = (key, value) => setPolicies(prev => ({ ...prev, [key]: value }));
    const pendingCount = pendingReviews.filter(r => r.status === 'Pending Review').length;
    const unreadNotifs = userNotifications.filter(n => !n.read).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Control Center</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Global Policies, Sector Limits & Manager Oversight</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Notifications */}
                    <button onClick={() => { setShowNotifications(!showNotifications); setShowMailbox(false); }} className="btn-secondary" style={{ fontSize: 12, position: 'relative' }}>
                        <Activity size={14} /> Behavior Feed
                        {unreadNotifs > 0 && (
                            <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 99, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {unreadNotifs}
                            </span>
                        )}
                    </button>
                    {/* Mailbox */}
                    <button onClick={() => { setShowMailbox(!showMailbox); setShowNotifications(false); }} className="btn-secondary" style={{ fontSize: 12, position: 'relative' }}>
                        <Mail size={14} /> Mailbox
                        {pendingCount > 0 && (
                            <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 99, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button className="btn-secondary" style={{ fontSize: 12 }}><RefreshCcw size={14} /> Reset</button>
                    <button className="btn-primary" style={{ fontSize: 12 }}><Save size={14} /> Push to Edge</button>
                </div>
            </div>

            {/* User Behavior Notifications Feed */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="glass-panel" style={{ padding: 24, border: '1px solid rgba(245,158,11,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Activity size={18} color="#f59e0b" /> User Behavior Feed
                                </h3>
                                <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            {userNotifications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40 }}>
                                    <Activity size={32} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No behavior notifications yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                                    {userNotifications.map(notif => {
                                        const sevColors = { success: '#10b981', warning: '#f59e0b', danger: '#f97316', critical: '#ef4444', info: '#0ea5e9' };
                                        const c = sevColors[notif.severity] || '#0ea5e9';
                                        return (
                                            <div key={notif.id} style={{ padding: 12, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 10, display: 'flex', gap: 10 }}>
                                                <div style={{ width: 3, borderRadius: 99, background: c, flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{notif.message}</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{notif.timestamp}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mailbox Overlay Panel */}
            <AnimatePresence>
                {showMailbox && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-active)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Inbox size={18} color="#0ea5e9" /> Security Review Mailbox
                                </h3>
                                <button onClick={() => setShowMailbox(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {pendingReviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40 }}>
                                    <Mail size={32} color="var(--text-faint)" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No pending security reviews</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {pendingReviews.map(review => {
                                        const isPending = review.status === 'Pending Review';
                                        const isApproved = review.status === 'Approved' || review.status === 'ZTA Verified' || review.status === 'Auto-Approved';
                                        const isBlocked = review.status === 'Blocked' || review.status.includes('Failed');

                                        const tierColors = { zta: '#f59e0b', restrict: '#f97316', block: '#ef4444', approve: '#10b981' };
                                        const tierLabels = { zta: 'ZTA Required', restrict: 'Restricted', block: 'Blocked', approve: 'Auto-Approved' };

                                        return (
                                            <div key={review.id} style={{
                                                padding: 20,
                                                background: isPending ? 'rgba(245,158,11,0.04)' : isApproved ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
                                                border: `1px solid ${isPending ? 'rgba(245,158,11,0.12)' : isApproved ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}`,
                                                borderRadius: 12,
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                    <div>
                                                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{review.userName}</p>
                                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{review.actionLabel}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: `${tierColors[review.tier] || '#0ea5e9'}15`, color: tierColors[review.tier] || '#0ea5e9' }}>
                                                            {tierLabels[review.tier] || review.tier}
                                                        </span>
                                                        <span style={{
                                                            fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase',
                                                            background: isPending ? 'rgba(245,158,11,0.15)' : isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                                            color: isPending ? '#f59e0b' : isApproved ? '#10b981' : '#ef4444',
                                                        }}>
                                                            {review.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                                                    <div>
                                                        <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>System</p>
                                                        <p style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: 'var(--text-primary)' }}>{review.system}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Risk Score</p>
                                                        <p style={{ fontSize: 12, fontWeight: 700, marginTop: 2, fontFamily: 'monospace', color: tierColors[review.tier] || '#0ea5e9' }}>{review.riskScore}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Timestamp</p>
                                                        <p style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: 'var(--text-primary)' }}>{review.timestamp}</p>
                                                    </div>
                                                </div>

                                                {isPending && (
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button onClick={() => approveReview(review.id)}
                                                            style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                            <CheckCircle size={14} /> Approve & Lift Restriction
                                                        </button>
                                                        <button onClick={() => blockReview(review.id)}
                                                            style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                            <XCircle size={14} /> Block Action
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configure automated risk-based access control</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Critical Block Threshold</h4>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Score at which user is auto-blocked & admin notified</p>
                                </div>
                                <span style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>{policies.criticalBlockThreshold}</span>
                            </div>
                            <input type="range" min="50" max="99" value={policies.criticalBlockThreshold} onChange={e => updatePolicy('criticalBlockThreshold', Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-faint)', fontWeight: 700, marginTop: 4 }}>
                                <span>Conservative (50)</span><span>Aggressive (99)</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>MFA Trigger Threshold</h4>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Score above which MFA is required & access restricted</p>
                                </div>
                                <span style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b' }}>{policies.mfaThreshold}</span>
                            </div>
                            <input type="range" min="20" max="70" value={policies.mfaThreshold} onChange={e => updatePolicy('mfaThreshold', Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
                        </div>

                        <div style={{ padding: 16, background: 'var(--bg-card-subtle)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Active Enforcement Rules</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { range: `≤ ${policies.mfaThreshold}`, action: 'Allow activity and monitor', color: '#10b981' },
                                    { range: `${policies.mfaThreshold}–${policies.restrictThreshold}`, action: 'ZTA verification + restrict to essential', color: '#f59e0b' },
                                    { range: `${policies.restrictThreshold}–${policies.criticalBlockThreshold}`, action: 'Restrict access + notify admin', color: '#f97316' },
                                    { range: `> ${policies.criticalBlockThreshold}`, action: 'BLOCK + 30min lockout + alert admin', color: '#ef4444' },
                                ].map((r, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '8px 12px', background: `${r.color}08`, borderRadius: 8, border: `1px solid ${r.color}15` }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: r.color, minWidth: 60 }}>{r.range}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{r.action}</span>
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
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, maxWidth: 180, lineHeight: 1.5 }}>{p.desc}</p>
                                    </div>
                                    <button style={{ width: 40, height: 22, borderRadius: 99, background: p.active ? '#0284c7' : 'var(--border-primary)', border: 'none', cursor: 'pointer', position: 'relative' }}>
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
                                <div key={i} style={{ padding: 20, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 12, textAlign: 'center' }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.sector}</p>
                                    <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit', marginTop: 8, color: 'var(--text-primary)' }}>{s.limit}</p>
                                    <p style={{ fontSize: 10, color: '#0284c7', marginTop: 4 }}>{s.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Incidents + Audit + Health */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Bell size={16} color="#ef4444" /> Critical Alerts
                            </h3>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', padding: '3px 8px', background: 'var(--risk-red-bg)', borderRadius: 6 }}>{INCIDENTS.filter(i => i.severity === 'Critical').length} ACTIVE</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {INCIDENTS.map(inc => (
                                <div key={inc.id} style={{ padding: 14, background: inc.severity === 'Critical' ? 'var(--risk-red-bg)' : 'var(--bg-card-subtle)', border: `1px solid ${inc.severity === 'Critical' ? 'rgba(239,68,68,0.12)' : 'var(--border-subtle)'}`, borderRadius: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{inc.type}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{inc.user} · Score: <span style={{ fontFamily: 'monospace', color: getRiskAction(inc.riskScore).color, fontWeight: 700 }}>{inc.riskScore}</span></p>
                                        </div>
                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 4, background: inc.status === 'Auto-Blocked' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: inc.status === 'Auto-Blocked' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>{inc.status}</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>{inc.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                <div key={i} style={{ display: 'flex', gap: 10, padding: 12, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                                    <div style={{ width: 3, borderRadius: 99, background: log.flag ? '#f43f5e' : '#0ea5e9', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{log.name}</p>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{log.action}</p>
                                        <p style={{ fontSize: 9, color: 'var(--text-faint)', marginTop: 4, fontWeight: 700 }}>{log.time}</p>
                                    </div>
                                    {log.flag && <AlertTriangle size={14} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 20, background: 'var(--risk-blue-bg)', border: '1px solid var(--border-active)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Lock size={16} color="#0284c7" />
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
                                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
    );
}
