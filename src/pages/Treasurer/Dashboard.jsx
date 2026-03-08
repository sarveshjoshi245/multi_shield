import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, Activity, Wallet, Globe, ArrowUpRight, FileText, Send, RefreshCcw, Database, UserCog, AlertTriangle, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TREASURY_TRANSACTIONS, MARKET_TICKERS, LIQUIDITY_TREND, PORTFOLIO_ALLOCATION, PENDING_LOANS, calculateActionRisk } from '../../simulation/mockData';
import { useSecurityContext } from '../../context/SecurityContext';
import { useTheme } from '../../context/ThemeContext';
import RiskApprovalOverlay from '../../components/RiskApprovalOverlay';

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
    const { isDark } = useTheme();

    const executeAction = (actionType, params, label) => {
        const result = calculateActionRisk(actionType, params);
        const system = SYSTEM_MAP[actionType] || 'Treasury';

        setActionLogs(prev => [{ action: label, time: new Date().toLocaleTimeString(), system, tier: result.enforcement.tier }, ...prev]);

        triggerSecurityReview('Rajesh Sharma (EM-204)', label, system, result);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'loans', label: 'Loan Approvals', icon: FileText },
        { id: 'transfers', label: 'Fund Transfers', icon: Send },
        { id: 'actions', label: 'Quick Actions', icon: RefreshCcw },
    ];

    const tooltipStyle = {
        background: isDark ? '#0f172a' : '#ffffff',
        border: `1px solid var(--border-primary)`,
        borderRadius: 10,
        fontSize: 12,
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in-up">
            <RiskApprovalOverlay />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Reserve Bank Compliant</p>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>Treasury Control Center</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Portfolio, Loans, Transfers & Market Operations</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                                borderRadius: 10,
                                border: `1px solid ${activeTab === t.id ? 'var(--border-active)' : 'var(--border-primary)'}`,
                                background: activeTab === t.id ? 'var(--risk-blue-bg)' : 'var(--bg-card)',
                                color: activeTab === t.id ? '#0284c7' : 'var(--text-muted)',
                                cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s'
                            }}>
                            <t.icon size={14} /> {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {KPIs.map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--risk-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <kpi.icon size={18} color="#0284c7" />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99,
                                background: kpi.up ? 'var(--risk-green-bg)' : 'var(--risk-red-bg)',
                                color: kpi.up ? '#10b981' : '#ef4444', fontSize: 10, fontWeight: 700
                            }}>
                                {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {kpi.change}
                            </div>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{kpi.label}</p>
                        <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{kpi.value}</h3>
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
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                            <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={tooltipStyle} />
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
                                            <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={9} width={85} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>{PORTFOLIO_ALLOCATION.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    {PORTFOLIO_ALLOCATION.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '3px 0', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: 2, background: item.color }} />{item.name}</span>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{(item.value / 10).toFixed(0)} Cr</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Transactions + Tickers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Transactions</h3>
                                    <span style={{ padding: '3px 8px', borderRadius: 6, background: 'var(--risk-blue-bg)', color: '#0284c7', fontSize: 9, fontWeight: 700 }}>LIVE</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {TREASURY_TRANSACTIONS.map((txn, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: 12,
                                            background: txn.status === 'Flagged' ? 'var(--risk-red-bg)' : 'var(--bg-card-subtle)',
                                            border: `1px solid ${txn.status === 'Flagged' ? 'rgba(239,68,68,0.15)' : 'var(--border-subtle)'}`,
                                            borderRadius: 10
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: txn.status === 'Flagged' ? 'var(--risk-red-bg)' : 'var(--risk-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ArrowUpRight size={14} color={txn.status === 'Flagged' ? '#ef4444' : '#10b981'} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{txn.entity}</p>
                                                    <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>{txn.ref} · {txn.time} · {txn.type}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{txn.amount}</p>
                                                <p style={{ fontSize: 9, fontWeight: 700, color: txn.status === 'Flagged' ? '#ef4444' : txn.status === 'Pending' ? '#f59e0b' : 'var(--text-muted)' }}>{txn.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} color="#818cf8" /> Market Indicators</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {MARKET_TICKERS.map((t, i) => (
                                        <div key={i} style={{ padding: 12, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
                                            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.label}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{t.price}</span>
                                                <span style={{ fontSize: 10, color: t.up === true ? '#10b981' : t.up === false ? '#ef4444' : 'var(--text-muted)' }}>{t.change}</span>
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
                                    <FileText size={18} color="#0284c7" /> Pending Loan Approvals
                                </h3>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', padding: '3px 8px', background: 'var(--risk-yellow-bg)', borderRadius: 6 }}>{PENDING_LOANS.length} PENDING</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                                    <thead>
                                        <tr>
                                            {['Loan ID', 'Borrower', 'Amount', 'Sector', 'Rating', 'Tenure', 'Flags', 'Action'].map(h => (
                                                <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--border-primary)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PENDING_LOANS.map(loan => (
                                            <tr key={loan.id} style={{ background: 'var(--bg-card-subtle)' }}>
                                                <td style={{ padding: '12px', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>{loan.id}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{loan.borrower}</p>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>₹{loan.amount} Cr</td>
                                                <td style={{ padding: '12px', fontSize: 11, color: 'var(--text-muted)' }}>{loan.sector}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: loan.rating.startsWith('A') ? 'var(--risk-green-bg)' : 'var(--risk-yellow-bg)', color: loan.rating.startsWith('A') ? '#10b981' : '#f59e0b' }}>{loan.rating}</span>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: 11, color: 'var(--text-muted)' }}>{loan.tenure}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        {loan.isNPA && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, background: 'var(--risk-red-bg)', color: '#ef4444' }}>NPA</span>}
                                                        {loan.isNewBorrower && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, background: 'var(--risk-yellow-bg)', color: '#f59e0b' }}>NEW</span>}
                                                        {!loan.isNPA && !loan.isNewBorrower && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <button onClick={() => executeAction('loan_approval', loan, `Approve Loan ${loan.id}: ₹${loan.amount} Cr to ${loan.borrower}`)}
                                                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'var(--risk-blue-bg)', color: '#0284c7', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
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
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Send size={16} color="#0284c7" /> Initiate Fund Transfer
                                </h3>
                                <TransferForm onExecute={executeAction} />
                            </div>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Globe size={16} color="#818cf8" /> FX Trade Execution
                                </h3>
                                <FXTradeForm onExecute={executeAction} />
                            </div>
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Briefcase size={16} color="#f59e0b" /> Bond Settlement
                                </h3>
                                <BondForm onExecute={executeAction} />
                            </div>
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
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                                                borderRadius: 12, border: '1px solid var(--border-primary)',
                                                background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                                            }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <q.icon size={18} color={q.color} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{q.label}</p>
                                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Click to execute</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Log */}
                            <div className="glass-panel" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Shield size={16} color="#0284c7" /> Session Action Log
                                </h3>
                                {actionLogs.length === 0 ? (
                                    <p style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', padding: 32 }}>No actions performed yet this session</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {actionLogs.slice(0, 10).map((log, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: 10, background: 'var(--bg-card-subtle)', borderRadius: 8,
                                                border: '1px solid var(--border-subtle)'
                                            }}>
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <p style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{log.action}</p>
                                                    <p style={{ fontSize: 9, color: 'var(--text-faint)', marginTop: 2 }}>{log.time}</p>
                                                </div>
                                                <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8 }}>{log.system}</span>
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

// --- Sub-components for transfer forms ---

function TransferForm({ onExecute }) {
    const [amount, setAmount] = useState(25);
    const [isForeign, setIsForeign] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Beneficiary</label>
                <input className="input-field" defaultValue="State Bank of India — Corporate" />
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Amount (₹ Cr)</label>
                <input className="input-field" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
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
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Currency Pair</label>
                <select className="input-field" onChange={e => setIsExotic(e.target.value === 'exotic')} style={{ appearance: 'auto' }}>
                    <option value="standard">USD/INR (Standard)</option>
                    <option value="standard">EUR/INR (Standard)</option>
                    <option value="exotic">TRY/INR (Exotic)</option>
                    <option value="exotic">ZAR/INR (Exotic)</option>
                </select>
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Notional ($M)</label>
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
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Security</label>
                <input className="input-field" defaultValue="GOI 7.26% 2033 G-Sec" />
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Settlement Amount (₹ Cr)</label>
                <input className="input-field" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
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
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Dataset</label>
                <select className="input-field" style={{ appearance: 'auto' }}>
                    <option>Treasury Transaction Logs</option>
                    <option>Customer Account Records</option>
                    <option>Loan Disbursement Data</option>
                </select>
            </div>
            <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Number of Records</label>
                <input className="input-field" type="number" value={records} onChange={e => setRecords(Number(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }} />
            </div>
            <button onClick={() => onExecute('data_export', { records }, `Export ${records.toLocaleString()} records`)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Request Export
            </button>
        </div>
    );
}
