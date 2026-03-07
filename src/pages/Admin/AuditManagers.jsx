import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, User, Activity, Clock, Shield, Monitor, ShieldAlert, CheckCircle, Ban, Key } from 'lucide-react';
import { getRiskAction } from '../../simulation/mockData';

const INITIAL_LOGS = [
    { id: 1, user: 'Neha Gupta', activity: 'Bulk Data Download', riskScore: 92, time: '02:13 AM', status: 'Open', behavior: 'Attempted download of 12,000 sensitive records', device: 'UNKNOWN-DEVICE', ip: '157.42.18.92', explanation: 'Deviation from normal behavior baseline. Volume exceeds daily average by 400%.' },
    { id: 2, user: 'Vikram Joshi', activity: 'Off-hours Treasury Access', riskScore: 74, time: '11:42 PM', status: 'Under Review', behavior: 'Login attempt to Treasury DB from public network', device: 'MS-LAPTOP-0551', ip: '103.21.58.14', explanation: 'Access attempt during restricted hours (11 PM). Typical activity ends at 8 PM.' },
    { id: 3, user: 'Raj Mehta', activity: 'Unknown Device Login', riskScore: 88, time: '02:05 AM', status: 'Open', behavior: 'Login attempt from unauthorized Macbook Pro', device: 'APPLE-MACBOOK-AIR', ip: '1.24.51.109', explanation: 'Device MAC address not found in corporate asset register.' },
];

export default function AuditManagers() {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [selectedIncident, setSelectedIncident] = useState(null);

    const handleAction = (status) => {
        if (!selectedIncident) return;
        setLogs(logs.map(l => l.id === selectedIncident.id ? { ...l, status } : l));
        setSelectedIncident({ ...selectedIncident, status });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 700 }}>Audit Managers</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Review and investigate suspicious security incidents across all sectors</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
                {/* Activity Logs Table */}
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ShieldAlert size={20} color="#f43f5e" /> Suspicious Activity Logs
                        </h3>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#f43f5e', background: 'rgba(244,63,94,0.1)', padding: '4px 10px', borderRadius: 6 }}>{logs.filter(l => l.status === 'Open').length} UNRESOLVED</span>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['User', 'Activity', 'Risk Score', 'Time', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '16px 32px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr 
                                        key={log.id} 
                                        onClick={() => setSelectedIncident(log)}
                                        style={{ 
                                            borderBottom: '1px solid rgba(255,255,255,0.03)', 
                                            cursor: 'pointer',
                                            background: selectedIncident?.id === log.id ? 'rgba(14,165,233,0.05)' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                        className="hover-row"
                                    >
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 99, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={14} color="#94a3b8" />
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{log.user}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px', fontSize: 13, color: '#e2e8f0' }}>{log.activity}</td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ height: 6, width: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${log.riskScore}%`, background: getRiskAction(log.riskScore).color }} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: getRiskAction(log.riskScore).color }}>{log.riskScore}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px', fontSize: 13, color: '#64748b' }}>{log.time}</td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span style={{ 
                                                fontSize: 10, 
                                                fontWeight: 700, 
                                                padding: '4px 8px', 
                                                borderRadius: 6, 
                                                background: log.status === 'Approved' ? 'rgba(16,185,129,0.1)' : log.status === 'Blocked' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                                color: log.status === 'Approved' ? '#10b981' : log.status === 'Blocked' ? '#ef4444' : '#f59e0b',
                                                textTransform: 'uppercase'
                                            }}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Incident Review Panel */}
                <div style={{ position: 'sticky', top: 32 }}>
                    <AnimatePresence mode="wait">
                        {selectedIncident ? (
                            <motion.div 
                                key={selectedIncident.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-panel" 
                                style={{ padding: 24, border: `1px solid ${getRiskAction(selectedIncident.riskScore).borderColor}` }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Incident Details</h3>
                                    <button onClick={() => setSelectedIncident(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>×</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>User Entity</p>
                                        <p style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{selectedIncident.user}</p>
                                        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Device/IP</p>
                                                <p style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{selectedIncident.device}</p>
                                                <p style={{ fontSize: 10, color: '#0ea5e9', fontFamily: 'monospace' }}>{selectedIncident.ip}</p>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Timestamp</p>
                                                <p style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{selectedIncident.time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Detected Behavior</label>
                                        <div style={{ padding: 12, background: 'rgba(244,63,94,0.05)', borderRadius: 8, border: '1px solid rgba(244,63,94,0.1)', marginTop: 8 }}>
                                            <p style={{ fontSize: 13, color: '#f43f5e', fontWeight: 600 }}>{selectedIncident.behavior}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Automated Explanation</label>
                                        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 }}>{selectedIncident.explanation}</p>
                                    </div>

                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <p style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Admin Actions</p>
                                        <button onClick={() => handleAction('Approved')} className="btn-secondary" style={{ justifyContent: 'center', width: '100%', borderColor: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                                            <CheckCircle size={16} /> Approve Access
                                        </button>
                                        <button onClick={() => handleAction('Blocked')} className="btn-secondary" style={{ justifyContent: 'center', width: '100%', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                                            <Ban size={16} /> Block User
                                        </button>
                                        <button onClick={() => handleAction('Under Review')} className="btn-secondary" style={{ justifyContent: 'center', width: '100%', borderColor: 'rgba(14,165,233,0.2)', color: '#0ea5e9' }}>
                                            <Key size={16} /> Request MFA
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderStyle: 'dashed' }}>
                                <Shield size={40} color="#1e293b" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: '#64748b', fontSize: 14 }}>Select an incident log to review details and take action</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .hover-row:hover {
                    background: rgba(255,255,255,0.02) !important;
                }
            `}</style>
        </div>
    );
}
