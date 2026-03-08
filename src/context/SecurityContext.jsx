import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SecurityContext = createContext(null);

export function useSecurityContext() {
    const ctx = useContext(SecurityContext);
    if (!ctx) throw new Error('useSecurityContext must be used within SecurityProvider');
    return ctx;
}

let reviewIdCounter = 1;

export function SecurityProvider({ children }) {
    // Pending reviews visible to Admin in Mailbox
    const [pendingReviews, setPendingReviews] = useState([]);

    // Active overlay for the treasurer user
    const [overlay, setOverlay] = useState(null);
    // overlay = { id, tier: 'approve'|'zta'|'restrict'|'block', status, actionLabel, system, riskScore, factors, blockUntil }

    // Restricted users map: { [reviewId]: { restricted: true, reason, until } }
    const [restrictedUsers, setRestrictedUsers] = useState({});

    // User behavior notifications feed for admin
    const [userNotifications, setUserNotifications] = useState([]);

    // Block timer state
    const [blockTimers, setBlockTimers] = useState({});

    const addNotification = useCallback((type, message, userName, severity = 'info') => {
        setUserNotifications(prev => [{
            id: Date.now(),
            type,
            message,
            userName,
            severity,
            timestamp: new Date().toLocaleString(),
            read: false,
        }, ...prev]);
    }, []);

    // Trigger a risk-based security review
    const triggerSecurityReview = useCallback((userName, actionLabel, system, riskResult) => {
        const id = reviewIdCounter++;
        const { score, factors, enforcement } = riskResult;
        const tier = enforcement.tier;

        const review = {
            id,
            userName,
            actionLabel,
            system,
            timestamp: new Date().toLocaleString(),
            status: tier === 'approve' ? 'Auto-Approved' : 'Pending Review',
            riskScore: score,
            tier,
            factors,
        };

        // Add to admin pending reviews (except auto-approve)
        if (tier !== 'approve') {
            setPendingReviews(prev => [review, ...prev]);
        }

        // Add notification
        if (tier === 'approve') {
            addNotification('approved', `${actionLabel} — Auto-approved (Risk: ${score})`, userName, 'success');
        } else if (tier === 'zta') {
            addNotification('zta_required', `${actionLabel} — ZTA verification required (Risk: ${score})`, userName, 'warning');
        } else if (tier === 'restrict') {
            addNotification('restricted', `${actionLabel} — Access restricted, awaiting admin approval (Risk: ${score})`, userName, 'danger');
        } else if (tier === 'block') {
            addNotification('blocked', `${actionLabel} — User BLOCKED for 30 minutes (Risk: ${score})`, userName, 'critical');
        }

        // Set overlay
        setOverlay({
            id,
            tier,
            status: tier === 'approve' ? 'approved' : 'pending',
            actionLabel,
            system,
            riskScore: score,
            factors,
            enforcement,
        });

        // Auto-approve tier: auto-dismiss after 2.5s
        if (tier === 'approve') {
            setTimeout(() => {
                setOverlay(prev => {
                    if (prev && prev.id === id) return null;
                    return prev;
                });
            }, 2500);
        }

        // Block tier: set up 30-min timer
        if (tier === 'block') {
            const blockUntil = Date.now() + 30 * 60 * 1000;
            setRestrictedUsers(prev => ({
                ...prev,
                [id]: { restricted: true, reason: 'Blocked: Risk score > 90', until: blockUntil }
            }));
        }

        // Restrict tier: mark as restricted, waiting for admin
        if (tier === 'restrict') {
            setRestrictedUsers(prev => ({
                ...prev,
                [id]: { restricted: true, reason: 'Restricted: Risk score 70-90, awaiting admin approval', until: null }
            }));
        }

        return id;
    }, [addNotification]);

    // ZTA verification passed within overlay
    const ztaVerificationPassed = useCallback((id) => {
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'ZTA Verified' } : r)
        );
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'approved' };
            return prev;
        });
        addNotification('zta_passed', 'ZTA verification completed successfully', '', 'success');
        setTimeout(() => {
            setOverlay(prev => {
                if (prev && prev.id === id) return null;
                return prev;
            });
        }, 2000);
    }, [addNotification]);

    // ZTA verification failed within overlay
    const ztaVerificationFailed = useCallback((id) => {
        const blockUntil = Date.now() + 30 * 60 * 1000;
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'ZTA Failed — Blocked' } : r)
        );
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'blocked', tier: 'block' };
            return prev;
        });
        setRestrictedUsers(prev => ({
            ...prev,
            [id]: { restricted: true, reason: 'ZTA verification failed — 30 min lockout', until: blockUntil }
        }));
        addNotification('zta_failed', 'ZTA verification FAILED — User blocked for 30 minutes', '', 'critical');
    }, [addNotification]);

    // Admin approves a review (clears restriction, notifies user)
    const approveReview = useCallback((id) => {
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r)
        );
        // Clear restriction
        setRestrictedUsers(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        // Update overlay if it matches
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'approved' };
            return prev;
        });
        addNotification('admin_approved', 'Admin approved access — restrictions lifted', '', 'success');
        // Auto-dismiss overlay
        setTimeout(() => {
            setOverlay(prev => {
                if (prev && prev.id === id) return null;
                return prev;
            });
        }, 2000);
    }, [addNotification]);

    // Admin blocks a review
    const blockReview = useCallback((id) => {
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'Blocked' } : r)
        );
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'blocked' };
            return prev;
        });
        addNotification('admin_blocked', 'Admin blocked access', '', 'critical');
    }, [addNotification]);

    const dismissOverlay = useCallback(() => {
        setOverlay(null);
    }, []);

    return (
        <SecurityContext.Provider value={{
            pendingReviews,
            overlay,
            restrictedUsers,
            userNotifications,
            triggerSecurityReview,
            ztaVerificationPassed,
            ztaVerificationFailed,
            approveReview,
            blockReview,
            dismissOverlay,
            addNotification,
        }}>
            {children}
        </SecurityContext.Provider>
    );
}
