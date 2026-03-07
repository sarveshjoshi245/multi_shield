import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, Activity, Wallet, Globe, ArrowUpRight, FileText, Send, RefreshCcw, Database, UserCog, AlertTriangle, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TREASURY_TRANSACTIONS, MARKET_TICKERS, LIQUIDITY_TREND, PORTFOLIO_ALLOCATION, PENDING_LOANS, calculateActionRisk } from '../../simulation/mockData';
import { useSecurityContext } from '../../context/SecurityContext';
import SecurityBlockOverlay from '../../components/SecurityBlockOverlay';

const KPIs = [
    { label: 'Assets Under Management', value: '₹14,502 Cr', change: '+2.4%', up: true, icon: Briefcase },
    { label: 'Liquidity Coverage (LCR)', value: '142.5%', change: '-0.8%', up: false, icon: Activity },
    { label: 'Net Interest Margin', value: '3.12%', change: '+0.15%', up: true, icon: TrendingUp },
    { label: 'Cash & Balances (RBI)', value: '₹890 Cr', change: '+1.2%', up: true, icon: Wallet },
];

const SYSTEM_MAP = {
    fund_transfer: 'Transfers',
    fx_trade: 'FX Trading',
    bond_settlement: 'Treasury',
    data_export: 'Data Export',
    loan_approval: 'Treasury',
    account_modification: 'Treasury',
};

export default function TreasurerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [actionLogs, setActionLogs] = useState([]);
    const { triggerSecurityReview } = useSecurityContext();

    // Action handlers — risk is computed silently, no score shown to user
    const executeAction = (actionType, params, label) => {
        const result = calculateActionRisk(actionType, params);
        const system = SYSTEM_MAP[actionType] || 'Treasury';

        // Log the action (no score visible)
        setActionLogs(prev => [{ action: label, time: new Date().toLocaleTimeString(), system }, ...prev]);

        // If risk is elevated, trigger the security review overlay
        if (result.score > 40) {
            triggerSecurityReview('Rajesh Sharma (EM-204)', label, system);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'loans', label: 'Loan Approvals', icon: FileText },
        { id: 'transfers', label: 'Fund Transfers', icon: Send },
        { id: 'actions', label: 'Quick Actions', icon: RefreshCcw },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in-up">
            {/* Security Block Overlay */}
            <SecurityBlockOverlay />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Treasury Control Center</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Portfolio, Loans, Transfers & Market Operations</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${activeTab === t.id ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.06)'}`, background: activeTab === t.id ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)', color: activeTab === t.id ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s' }}>
                            <t.icon size={14} /> {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs — always visible */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {KPIs.map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <kpi.icon size={18} color="#0ea5e9" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: kpi.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: kpi.up ? '#10b981' : '#ef4444', fontSize: 10, fontWeight: 700 }}>
                                {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {kpi.change}
                            </div>
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{kpi.label}</p>
                        <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Outfit' }}>{kpi.value}</h3>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* === OVERVIEW TAB === */}
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Liquidity Coverage Trend</h3>
                                <div style={{ height: 240 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={LIQUIDITY_TREND}>
                                            <defs><linearGradient id="lcr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                                            <Area type="monotone" dataKey="lcr" stroke="#0ea5e9" strokeWidth={3} fill="url(#lcr)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Portfolio Allocation</h3>
                                <div style={{ height: 180 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={PORTFOLIO_ALLOCATION} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={85} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>{PORTFOLIO_ALLOCATION.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    {PORTFOLIO_ALLOCATION.map((item, i) => {
                                        return (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '3px 0', color: '#94a3b8' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: 2, background: item.color }} />{item.name}</span>
                                                <span style={{ fontWeight: 700, color: 'white' }}>₹{(item.value / 10).toFixed(0)} Cr</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Transactions + Tickers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Transactions</h3>
                                    <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(14,165,233,0.1)', color: '#38bdf8', fontSize: 9, fontWeight: 700 }}>LIVE</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {TREASURY_TRANSACTIONS.map((txn, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: txn.status === 'Flagged' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${txn.status === 'Flagged' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 10 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: txn.status === 'Flagged' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ArrowUpRight size={14} color={txn.status === 'Flagged' ? '#ef4444' : '#10b981'} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 12, fontWeight: 600 }}>{txn.entity}</p>
                                                    <p style={{ fontSize: 9, color: '#64748b' }}>{txn.ref} · {txn.time} · {txn.type}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>{txn.amount}</p>
                                                <p style={{ fontSize: 9, fontWeight: 700, color: txn.status === 'Flagged' ? '#ef4444' : txn.status === 'Pending' ? '#f59e0b' : '#64748b' }}>{txn.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} color="#818cf8" /> Market Indicators</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {MARKET_TICKERS.map((t, i) => (
                                        <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                            <p style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.label}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Outfit' }}>{t.price}</span>
                                                <span style={{ fontSize: 10, color: t.up === true ? '#10b981' : t.up === false ? '#ef4444' : '#64748b' }}>{t.change}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === LOAN APPROVALS TAB === */}
                {activeTab === 'loans' && (
                    <motion.div key="loans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="glass-panel" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FileText size={18} color="#0ea5e9" /> Pending Loan Approvals
                                </h3>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', padding: '3px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 6 }}>{PENDING_LOANS.length} PENDING</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                                    <thead>
                                        <tr>
                                            {['Loan ID', 'Borrower', 'Amount', 'Sector', 'Rating', 'Tenure', 'Flags', 'Action'].map(h => (
                                                <th key={h} style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PENDING_LOANS.map(loan => (
                                            <tr key={loan.id} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <td style={{ padding: '12px', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>{loan.id}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <p style={{ fontSize: 13, fontWeight: 600 }}>{loan.borrower}</p>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: 14, fontFamily: 'monospace', fontWeight: 700 }}>₹{loan.amount} Cr</td>
                                                <td style={{ padding: '12px', fontSize: 11, color: '#94a3b8' }}>{loan.sector}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: loan.rating.startsWith('A') ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: loan.rating.startsWith('A') ? '#10b981' : '#f59e0b' }}>{loan.rating}</span>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: 11, color: '#94a3b8' }}>{loan.tenure}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        {loan.isNPA && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>NPA</span>}
                                                        {loan.isNewBorrower && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>NEW</span>}
                                                        {!loan.isNPA && !loan.isNewBorrower && <span style={{ fontSize: 10, color: '#64748b' }}>—</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <button onClick={() => executeAction('loan_approval', loan, `Approve Loan ${loan.id}: ₹${loan.amount} Cr to ${loan.borrower}`)}
                                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === FUND TRANSFERS TAB === */}
                {activeTab === 'transfers' && (
                    <motion.div key="transfers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            {/* RTGS/NEFT */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Send size={16} color="#0ea5e9" /> Initiate Fund Transfer
                                </h3>
                                <TransferForm onExecute={executeAction} />
                            </div>

                            {/* FX Trade */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Globe size={16} color="#818cf8" /> FX Trade Execution
                                </h3>
                                <FXTradeForm onExecute={executeAction} />
                            </div>

                            {/* Bond Settlement */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Briefcase size={16} color="#f59e0b" /> Bond Settlement
                                </h3>
                                <BondForm onExecute={executeAction} />
                            </div>

                            {/* Data Export */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Database size={16} color="#10b981" /> Data Export Request
                                </h3>
                                <ExportForm onExecute={executeAction} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === QUICK ACTIONS TAB === */}
                {activeTab === 'actions' && (
                    <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {[
                                        { label: 'Modify VIP Account', action: 'account_modification', params: { isVIP: true, limitsChanged: true }, icon: UserCog, color: '#f59e0b' },
                                        { label: 'Modify Dormant Account', action: 'account_modification', params: { isDormant: true }, icon: AlertTriangle, color: '#ef4444' },
                                        { label: 'Export 8,000 Records', action: 'data_export', params: { records: 8000 }, icon: Database, color: '#f97316' },
                                        { label: 'Export 200 Records', action: 'data_export', params: { records: 200 }, icon: Database, color: '#10b981' },
                                        { label: 'FX $60M Exotic Pair', action: 'fx_trade', params: { amount: 60, isExotic: true }, icon: Globe, color: '#ef4444' },
                                        { label: 'Bond ₹300 Cr Off-Market', action: 'bond_settlement', params: { amount: 300, isOffMarket: true }, icon: Briefcase, color: '#ef4444' },
                                    ].map((q, i) => (
                                        <button key={i} onClick={() => executeAction(q.action, q.params, q.label)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <q.icon size={18} color={q.color} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{q.label}</p>
                                                <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Click to execute</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Log */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Shield size={16} color="#38bdf8" /> Session Action Log
                                </h3>
                                {actionLogs.length === 0 ? (
                                    <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', padding: 32 }}>No actions performed yet this session</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {actionLogs.slice(0, 10).map((log, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <p style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.action}</p>
                                                    <p style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{log.time}</p>
                                                </div>
                                                <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0, marginLeft: 8 }}>{log.system}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Sub-components for transfer forms (no risk previews) ---

function TransferForm({ onExecute }) {
    const [amount, setAmount] = useState(25);
    const [isForeign, setIsForeign] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Beneficiary</label>
                <input className="input-field" defaultValue="State Bank of India — Corporate" />
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Amount (₹ Cr)</label>
                <input className="input-field" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
                <input type="checkbox" checked={isForeign} onChange={e => setIsForeign(e.target.checked)} style={{ accentColor: '#0284c7' }} />
                International Wire Transfer
            </label>
            <button onClick={() => onExecute('fund_transfer', { amount, isForeign }, `RTGS Transfer ₹${amount} Cr${isForeign ? ' (International)' : ''}`)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Execute Transfer
            </button>
        </div>
    );
}

function FXTradeForm({ onExecute }) {
    const [amount, setAmount] = useState(15);
    const [isExotic, setIsExotic] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Currency Pair</label>
                <select className="input-field" onChange={e => setIsExotic(e.target.value === 'exotic')} style={{ appearance: 'auto' }}>
                    <option value="standard">USD/INR (Standard)</option>
                    <option value="standard">EUR/INR (Standard)</option>
                    <option value="exotic">TRY/INR (Exotic)</option>
                    <option value="exotic">ZAR/INR (Exotic)</option>
                </select>
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Notional ($M)</label>
                <input className="input-field" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <button onClick={() => onExecute('fx_trade', { amount, isExotic }, `FX Trade ${isExotic ? '(Exotic)' : ''} $${amount}M`)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Execute Trade
            </button>
        </div>
    );
}

function BondForm({ onExecute }) {
    const [amount, setAmount] = useState(75);
    const [isOffMarket, setIsOffMarket] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Security</label>
                <input className="input-field" defaultValue="GOI 7.26% 2033 G-Sec" />
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Settlement Amount (₹ Cr)</label>
                <input className="input-field" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
                <input type="checkbox" checked={isOffMarket} onChange={e => setIsOffMarket(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                Off-Market Pricing
            </label>
            <button onClick={() => onExecute('bond_settlement', { amount, isOffMarket }, `Bond Settlement ₹${amount} Cr${isOffMarket ? ' (Off-Market)' : ''}`)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Settle Bond
            </button>
        </div>
    );
}

function ExportForm({ onExecute }) {
    const [records, setRecords] = useState(500);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Dataset</label>
                <select className="input-field" style={{ appearance: 'auto' }}>
                    <option>Treasury Transaction Logs</option>
                    <option>Customer Account Records</option>
                    <option>Loan Disbursement Data</option>
                </select>
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Number of Records</label>
                <input className="input-field" type="number" value={records} onChange={e => setRecords(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <button onClick={() => onExecute('data_export', { records }, `Export ${records.toLocaleString()} records`)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Request Export
            </button>
        </div>
    );
}
