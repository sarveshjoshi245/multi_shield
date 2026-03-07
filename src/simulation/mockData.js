// ==========================================
// MultiShield EWS — Simulated Data & Logic
// ==========================================

// --- USERS ---
export const USERS = {
    treasurer: {
        id: 'EM-204',
        name: 'Rajesh Sharma',
        role: 'Privileged User',
        sector: 'Treasury',
        device: 'MS-LAPTOP-0204',
        registeredIp: '192.168.1.100',
        allowedHours: { start: 8, end: 20 }, // 8AM - 8PM
        location: 'Mumbai HQ',
        avgRiskScore: 14,
    },
    manager: {
        id: 'MG-012',
        name: 'Priya Desai',
        role: 'Manager',
        sector: 'Monitoring',
        device: 'MS-LAPTOP-0012',
        registeredIp: '192.168.1.100',
        allowedHours: { start: 8, end: 20 },
        location: 'Mumbai HQ',
        avgRiskScore: 8,
    },
    admin: {
        id: 'AD-001',
        name: 'Sunita Rao',
        role: 'Admin',
        sector: 'System',
        device: 'MS-SECURE-0001',
        registeredIp: '192.168.1.100',
        allowedHours: { start: 0, end: 24 },
        location: 'Mumbai HQ',
        avgRiskScore: 5,
    },
};

// --- CURRENT SESSION (simulated context) ---
export const CURRENT_SESSION = {
    ip: '192.168.1.104',       // Different from registered → triggers ZTA
    time: new Date().getHours(),
    device: 'MS-LAPTOP-0204',
    location: 'Mumbai HQ',
    browser: 'Chrome 120',
};

// --- ZTA CONTEXT CHECK ---
export function evaluateZTAContext(user) {
    const checks = [];
    let riskDelta = 0;

    // IP Check
    const ipMatch = CURRENT_SESSION.ip === user.registeredIp;
    checks.push({ label: 'Network (IP)', value: CURRENT_SESSION.ip, passed: ipMatch, detail: ipMatch ? 'Corporate Subnet' : 'External / Unknown' });
    if (!ipMatch) riskDelta += 25;

    // Time Check
    const hour = CURRENT_SESSION.time;
    const timeOk = hour >= user.allowedHours.start && hour < user.allowedHours.end;
    checks.push({ label: 'Login Time', value: `${hour}:00`, passed: timeOk, detail: timeOk ? 'Within allowed window' : `Outside ${user.allowedHours.start}:00–${user.allowedHours.end}:00` });
    if (!timeOk) riskDelta += 30;

    // Device Check
    const deviceOk = CURRENT_SESSION.device === user.device;
    checks.push({ label: 'Device', value: CURRENT_SESSION.device, passed: deviceOk, detail: deviceOk ? 'Managed / Registered' : 'Unmanaged Device' });
    if (!deviceOk) riskDelta += 20;

    // Location Check
    const locOk = CURRENT_SESSION.location === user.location;
    checks.push({ label: 'Location', value: CURRENT_SESSION.location, passed: locOk, detail: locOk ? 'Expected geo-zone' : 'Anomalous location' });
    if (!locOk) riskDelta += 15;

    const allPassed = checks.every(c => c.passed);
    const requiresMFA = !allPassed;

    return { checks, riskDelta, allPassed, requiresMFA };
}

// --- RISK SCORE → ACTION MAPPING ---
export function getRiskAction(score) {
    if (score <= 40) return { level: 'normal', label: 'Allow & Monitor', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' };
    if (score <= 70) return { level: 'elevated', label: 'MFA + Restrict Access', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' };
    if (score <= 85) return { level: 'high', label: 'Restrict Sensitive Data', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.2)' };
    return { level: 'critical', label: 'BLOCK + Alert Admin', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' };
}

// --- ADMIN POLICIES (editable in UI) ---
export const DEFAULT_POLICIES = {
    maxTransactionLimit: 10000000,    // ₹1 Crore
    maxDbRecords: 5000,
    allowedLoginStart: 8,
    allowedLoginEnd: 20,
    criticalBlockThreshold: 85,
    mfaThreshold: 40,
    restrictThreshold: 70,
    sectorsEnabled: ['Treasury', 'Loans', 'Core Banking', 'Customer DB'],
};

// --- ACTIVITY LOGS (mock feed) ---
export const ACTIVITY_LOGS = [
    { id: 1, userId: 'EM-204', user: 'Rajesh Sharma', role: 'Treasurer', action: 'Approved ₹8.5 Cr RTGS Transfer', sector: 'Treasury', riskScore: 12, time: '10:24 AM', ip: '192.168.1.100', device: 'MS-LAPTOP-0204' },
    { id: 2, userId: 'EM-330', user: 'Amit Patel', role: 'Loan Officer', action: 'Exported 4,200 customer records', sector: 'Loans', riskScore: 58, time: '10:58 AM', ip: '192.168.1.100', device: 'MS-LAPTOP-0330' },
    { id: 3, userId: 'EM-102', user: 'Neha Gupta', role: 'DB Admin', action: 'Bulk download: 12,000 records', sector: 'Customer DB', riskScore: 92, time: '11:15 AM', ip: '157.42.18.92', device: 'UNKNOWN-DEVICE' },
    { id: 4, userId: 'EM-204', user: 'Rajesh Sharma', role: 'Treasurer', action: 'FX Spot Execution USD/INR $40M', sector: 'Treasury', riskScore: 18, time: '11:30 AM', ip: '192.168.1.100', device: 'MS-LAPTOP-0204' },
    { id: 5, userId: 'EM-551', user: 'Vikram Joshi', role: 'Treasury Clerk', action: 'Off-hours login from public IP', sector: 'Treasury', riskScore: 74, time: '11:42 PM', ip: '103.21.58.14', device: 'MS-LAPTOP-0551' },
    { id: 6, userId: 'EM-102', user: 'Neha Gupta', role: 'DB Admin', action: 'Attempted privilege escalation', sector: 'Customer DB', riskScore: 96, time: '11:55 AM', ip: '157.42.18.92', device: 'UNKNOWN-DEVICE' },
    { id: 7, userId: 'EM-330', user: 'Amit Patel', role: 'Loan Officer', action: 'Modified 3 loan disbursement records', sector: 'Loans', riskScore: 42, time: '12:05 PM', ip: '192.168.1.100', device: 'MS-LAPTOP-0330' },
    { id: 8, userId: 'EM-204', user: 'Rajesh Sharma', role: 'Treasurer', action: 'Approved ₹15 Cr bond settlement', sector: 'Treasury', riskScore: 35, time: '12:20 PM', ip: '192.168.1.100', device: 'MS-LAPTOP-0204' },
];

// --- TREASURY DATA ---
export const TREASURY_TRANSACTIONS = [
    { ref: 'TXN-90928', entity: 'RBI Repo Window', amount: '₹500.00 Cr', type: 'Repo', time: '10:24 AM', status: 'Settled' },
    { ref: 'TXN-90931', entity: 'HDFC Corporate Bond', amount: '₹1,202.45 Cr', type: 'Bond', time: '11:15 AM', status: 'Pending' },
    { ref: 'TXN-90935', entity: 'FX Spot USD/INR', amount: '$40.00 Mn', type: 'FX', time: '11:45 AM', status: 'Settled' },
    { ref: 'TXN-90940', entity: '364D Treasury Bill', amount: '₹250.00 Cr', type: 'T-Bill', time: '12:02 PM', status: 'Flagged' },
    { ref: 'TXN-90945', entity: 'SBI G-Sec Purchase', amount: '₹780.00 Cr', type: 'G-Sec', time: '12:30 PM', status: 'Settled' },
];

export const MARKET_TICKERS = [
    { label: 'India 10Y G-Sec', price: '7.12%', change: '+0.04%', up: true },
    { label: 'USD/INR', price: '82.94', change: '-0.12', up: false },
    { label: 'Brent Crude', price: '$82.14', change: '+0.88', up: true },
    { label: 'RBI Repo Rate', price: '6.50%', change: '0.00', up: null },
    { label: 'Call Money Rate', price: '6.75%', change: '-0.02', up: false },
    { label: 'Nifty 50', price: '22,474', change: '+145', up: true },
];

export const LIQUIDITY_TREND = [
    { day: 'Mon', lcr: 1.20 },
    { day: 'Tue', lcr: 1.15 },
    { day: 'Wed', lcr: 1.34 },
    { day: 'Thu', lcr: 1.28 },
    { day: 'Fri', lcr: 1.45 },
    { day: 'Sat', lcr: 1.42 },
    { day: 'Sun', lcr: 1.50 },
];

export const PORTFOLIO_ALLOCATION = [
    { name: 'Treasury Bonds', value: 4200, color: '#0ea5e9' },
    { name: 'Corporate Debt', value: 3100, color: '#6366f1' },
    { name: 'FX Reserves', value: 2800, color: '#f43f5e' },
    { name: 'Equities', value: 1500, color: '#f59e0b' },
    { name: 'Money Market', value: 2900, color: '#10b981' },
];

// --- RISK HISTORY ---
export const RISK_TIMELINE = [
    { time: '08:00', avgScore: 8 },
    { time: '09:00', avgScore: 12 },
    { time: '10:00', avgScore: 15 },
    { time: '10:30', avgScore: 45 },
    { time: '11:00', avgScore: 32 },
    { time: '11:30', avgScore: 74 },
    { time: '12:00', avgScore: 89 },
    { time: '12:30', avgScore: 42 },
];

// --- INCIDENTS ---
export const INCIDENTS = [
    { id: 'INC-001', userId: 'EM-102', user: 'Neha Gupta', type: 'Bulk Data Exfiltration', severity: 'Critical', status: 'Open', time: '11:15 AM', riskScore: 92, detail: 'Downloaded 12,000 records from Customer DB — exceeds policy limit of 5,000. Access from unregistered IP 157.42.18.92.' },
    { id: 'INC-002', userId: 'EM-551', user: 'Vikram Joshi', type: 'Off-hours Sector Access', severity: 'High', status: 'Under Review', time: '11:42 PM', riskScore: 74, detail: 'Accessed Treasury system at 11:42 PM from public IP 103.21.58.14. Outside allowed window (8:00–20:00).' },
    { id: 'INC-003', userId: 'EM-102', user: 'Neha Gupta', type: 'Privilege Escalation Attempt', severity: 'Critical', status: 'Auto-Blocked', time: '11:55 AM', riskScore: 96, detail: 'Attempted to access Treasury sector from Customer DB context. Cross-sector access denied by micro-segmentation policy.' },
];
