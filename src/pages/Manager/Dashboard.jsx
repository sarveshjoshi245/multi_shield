import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, UserCheck, Activity, Zap, Search, Filter, Lock, MessageSquare, AlertCircle, ChevronRight, Eye, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ACTIVITY_LOGS, INCIDENTS, RISK_TIMELINE, getRiskAction } from '../../simulation/mockData';

export default function ManagerDashboard() {
    const [selectedLog, setSelectedLog] = useState(null);
    const [filterLevel, setFilterLevel] = useState('all');

    const filteredLogs = filterLevel === 'all'
        ? ACTIVITY_LOGS
        : ACTIVITY_LOGS.filter(l => {
            const action = getRiskAction(l.riskScore);
            return action.level === filterLevel;
        });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>EWS Monitoring Console</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Real-time Privileged User Activity & Risk Analytics</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 99, background: '#10b981', animation: 'pulse 2s infinite' }} />
                        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Scoping 1.2k Endpoints</span>
                    </div>
                </div>
            </div>

            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                    { icon: Activity, label: 'Event Throughput', value: '4.8k', sub: 'events/sec', color: '#0ea5e9' },
                    { icon: Zap, label: 'Anomalies (1h)', value: String(ACTIVITY_LOGS.filter(l => l.riskScore > 40).length), sub: 'flagged', color: '#f59e0b' },
                    { icon: ShieldAlert, label: 'Auto-Blocked', value: String(ACTIVITY_LOGS.filter(l => l.riskScore > 85).length), sub: 'critical', color: '#ef4444' },
                    { icon: UserCheck, label: 'Active Users', value: String(new Set(ACTIVITY_LOGS.map(l => l.userId)).size), sub: 'monitored', color: '#10b981' },
                ].map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <m.icon size={18} color={m.color} />
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{m.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <h3 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Outfit' }}>{m.value}</h3>
                            <span style={{ color: m.color, fontSize: 11, fontWeight: 700 }}>{m.sub}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Activity Log */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Activity size={18} color="#0ea5e9" /> Behavioral Activity Log
                        </h3>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {['all', 'normal', 'elevated', 'high', 'critical'].map(f => (
                                <button key={f} onClick={() => setFilterLevel(f)}
                                    style={{
                                        padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                                        background: filterLevel === f ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.03)',
                                        color: filterLevel === f ? '#38bdf8' : '#64748b'
                                    }}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {filteredLogs.map((log) => {
                            const risk = getRiskAction(log.riskScore);
                            return (
                                <div key={log.id} onClick={() => setSelectedLog(log)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: log.riskScore > 85 ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${log.riskScore > 85 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: risk.bgColor }}>
                                            {log.riskScore > 40 ? <ShieldAlert size={16} color={risk.color} /> : <UserCheck size={16} color={risk.color} />}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.user} <span style={{ color: '#64748b', fontWeight: 400 }}>({log.role})</span></p>
                                            <p style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.action}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Score</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                <div style={{ width: 60, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${log.riskScore}%`, height: '100%', background: risk.color, borderRadius: 99, transition: 'width 0.5s' }} />
                                                </div>
                                                <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: risk.color }}>{log.riskScore}</span>
                                            </div>
                                        </div>
                                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700, background: risk.bgColor, color: risk.color, border: `1px solid ${risk.borderColor}` }}>
                                            {risk.label}
                                        </span>
                                        <ChevronRight size={14} color="#475569" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar: Risk Trend + Incidents */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-panel" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Systemic Risk Trend</h3>
                        <div style={{ height: 180 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={RISK_TIMELINE}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }} />
                                    <Line type="monotone" dataKey="avgScore" stroke="#6366f1" strokeWidth={3} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Active Incidents</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {INCIDENTS.map(inc => (
                                <div key={inc.id} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', gap: 12 }}>
                                    <div style={{ width: 3, borderRadius: 99, background: inc.severity === 'Critical' ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 700 }}>{inc.type}</p>
                                        <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{inc.user} · {inc.time}</p>
                                        <span style={{ fontSize: 9, fontWeight: 700, color: inc.status === 'Auto-Blocked' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>{inc.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Policy quick-view */}
                    <div className="glass-card" style={{ padding: 20, background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.12)' }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', marginBottom: 12 }}>Policy Enforcement Rules</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: '≤ 40', action: 'Allow & Monitor', color: '#10b981' },
                                { label: '40–70', action: 'MFA + Restrict', color: '#f59e0b' },
                                { label: '70–85', action: 'Restrict Sensitive', color: '#f97316' },
                                { label: '> 85', action: 'BLOCK + Alert Admin', color: '#ef4444' },
                            ].map((r, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                    <span style={{ fontFamily: 'monospace', color: r.color, fontWeight: 700 }}>{r.label}</span>
                                    <span style={{ color: '#94a3b8' }}>{r.action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Investigation Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedLog(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} className="glass-panel" style={{ maxWidth: 640, width: '100%', padding: 32, position: 'relative', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${getRiskAction(selectedLog.riskScore).color}, transparent)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: 14, background: getRiskAction(selectedLog.riskScore).bgColor, border: `1px solid ${getRiskAction(selectedLog.riskScore).borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AlertCircle size={28} color={getRiskAction(selectedLog.riskScore).color} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 22, fontWeight: 700 }}>{selectedLog.user}</h2>
                                        <p style={{ color: '#64748b', fontSize: 13 }}>{selectedLog.role} · {selectedLog.sector} Sector</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedLog(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#94a3b8' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                                <div>
                                    <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>Activity Details</p>
                                    <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                                        {[
                                            ['Action', selectedLog.action],
                                            ['Time', selectedLog.time],
                                            ['IP Address', selectedLog.ip],
                                            ['Device', selectedLog.device],
                                            ['Risk Score', selectedLog.riskScore],
                                        ].map(([k, v], i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                                                <span style={{ color: '#64748b' }}>{k}</span>
                                                <span style={{ fontWeight: 600, fontFamily: k === 'IP Address' || k === 'Risk Score' ? 'monospace' : 'inherit', color: k === 'Risk Score' ? getRiskAction(v).color : 'white' }}>{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>ML Explainability</p>
                                    <div style={{ padding: 14, background: 'rgba(14,165,233,0.04)', borderRadius: 10, border: '1px solid rgba(14,165,233,0.1)' }}>
                                        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, fontStyle: 'italic' }}>
                                            "Behavioral deviation detected: User {selectedLog.userId} typically operates within {selectedLog.sector} sector during standard hours from managed subnet. Current activity shows {selectedLog.riskScore > 70 ? 'significant anomaly in access pattern, volume, or timing' : 'minor deviation from baseline behavior'}. UEBA confidence: {selectedLog.riskScore > 70 ? '94' : '67'}%."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 0', background: '#ef4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>
                                    <Lock size={16} /> Block Identity
                                </button>
                                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px 0' }}>
                                    <MessageSquare size={16} /> Request Clarification
                                </button>
                                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px 0' }}>
                                    <Eye size={16} /> Escalate to Admin
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
    );
}
