import React, { createContext, useContext, useState, useCallback } from 'react';

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

    // Overlay state for Treasury user
    const [overlay, setOverlay] = useState(null);
    // overlay = { id, status: 'pending' | 'approved' | 'blocked', actionLabel, system }

    const triggerSecurityReview = useCallback((userName, actionLabel, system) => {
        const id = reviewIdCounter++;
        const review = {
            id,
            userName,
            actionLabel,
            system,
            timestamp: new Date().toLocaleString(),
            status: 'Pending Review',
        };
        setPendingReviews(prev => [review, ...prev]);
        setOverlay({ id, status: 'pending', actionLabel, system });
        return id;
    }, []);

    const approveReview = useCallback((id) => {
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r)
        );
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'approved' };
            return prev;
        });
        // Auto-dismiss the overlay after a brief delay so user sees "approved"
        setTimeout(() => {
            setOverlay(prev => {
                if (prev && prev.id === id) return null;
                return prev;
            });
        }, 2000);
    }, []);

    const blockReview = useCallback((id) => {
        setPendingReviews(prev =>
            prev.map(r => r.id === id ? { ...r, status: 'Blocked' } : r)
        );
        setOverlay(prev => {
            if (prev && prev.id === id) return { ...prev, status: 'blocked' };
            return prev;
        });
    }, []);

    const dismissOverlay = useCallback(() => {
        setOverlay(null);
    }, []);

    return (
        <SecurityContext.Provider value={{
            pendingReviews,
            overlay,
            triggerSecurityReview,
            approveReview,
            blockReview,
            dismissOverlay,
        }}>
            {children}
        </SecurityContext.Provider>
    );
}
