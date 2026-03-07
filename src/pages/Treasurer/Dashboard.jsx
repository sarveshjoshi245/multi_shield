import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, Activity, Wallet, Globe, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TREASURY_TRANSACTIONS, MARKET_TICKERS, LIQUIDITY_TREND, PORTFOLIO_ALLOCATION } from '../../simulation/mockData';

const KPIs = [
    { label: 'Assets Under Management', value: '₹14,502 Cr', change: '+2.4%', up: true, icon: Briefcase },
    { label: 'Liquidity Coverage (LCR)', value: '142.5%', change: '-0.8%', up: false, icon: Activity },
    { label: 'Net Interest Margin', value: '3.12%', change: '+0.15%', up: true, icon: TrendingUp },
    { label: 'Cash & Balances (RBI)', value: '₹890 Cr', change: '+1.2%', up: true, icon: Wallet },
];

export default function TreasurerDashboard() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="animate-fade-in-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700 }}>Treasury Control Center</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Portfolio, Liquidity & Market Operations</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-secondary" style={{ fontSize: 12 }}>Download Report</button>
                    <button className="btn-primary" style={{ fontSize: 12 }}>New Trade</button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {KPIs.map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <kpi.icon size={20} color="#0ea5e9" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: kpi.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: kpi.up ? '#10b981' : '#ef4444', fontSize: 11, fontWeight: 700 }}>
                                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.change}
                            </div>
                        </div>
                        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{kpi.label}</p>
                        <h3 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>{kpi.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Liquidity Chart */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Liquidity Coverage Trend</h3>
                    <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={LIQUIDITY_TREND}>
                                <defs>
                                    <linearGradient id="lcr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                                <Area type="monotone" dataKey="lcr" stroke="#0ea5e9" strokeWidth={3} fill="url(#lcr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Portfolio */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Portfolio Allocation</h3>
                    <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PORTFOLIO_ALLOCATION} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {PORTFOLIO_ALLOCATION.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        {PORTFOLIO_ALLOCATION.map((item, i) => {
                            const total = PORTFOLIO_ALLOCATION.reduce((s, p) => s + p.value, 0);
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', color: '#94a3b8' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                                        {item.name}
                                    </span>
                                    <span style={{ fontWeight: 700, color: 'white' }}>₹{(item.value / 10).toFixed(0)} Cr ({((item.value / total) * 100).toFixed(1)}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Transactions + Tickers Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Transactions */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Transactions</h3>
                        <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(14,165,233,0.1)', color: '#38bdf8', fontSize: 10, fontWeight: 700 }}>LIVE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {TREASURY_TRANSACTIONS.map((txn, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${txn.status === 'Flagged' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: txn.status === 'Flagged' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ArrowUpRight size={16} color={txn.status === 'Flagged' ? '#ef4444' : '#10b981'} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{txn.entity}</p>
                                        <p style={{ fontSize: 10, color: '#64748b' }}>Ref: {txn.ref} · {txn.time} · {txn.type}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}>{txn.amount}</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: txn.status === 'Flagged' ? '#ef4444' : txn.status === 'Pending' ? '#f59e0b' : '#64748b' }}>{txn.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market Tickers */}
                <div className="glass-panel" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Globe size={18} color="#818cf8" /> Market Indicators
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {MARKET_TICKERS.map((t, i) => (
                            <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t.label}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit' }}>{t.price}</span>
                                    <span style={{ fontSize: 11, color: t.up === true ? '#10b981' : t.up === false ? '#ef4444' : '#64748b' }}>{t.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 20, padding: 16, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 10 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', marginBottom: 4 }}>📊 AI Insight</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                            System liquidity in moderate surplus. Repo window activity expected to increase ahead of bond auction. MultiShield AI is calibrated for heightened end-of-quarter volume patterns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
