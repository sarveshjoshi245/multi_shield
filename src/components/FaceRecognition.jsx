import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, Loader } from 'lucide-react';

/**
 * FaceRecognition component — uses webcam via getUserMedia.
 * Simulates face detection with scanning animation.
 * Props:
 *  - onSuccess: () => void — called when face is "recognized"
 *  - onFail: () => void — called on failure (demo button)
 */
export default function FaceRecognition({ onSuccess, onFail }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('initializing'); // initializing | scanning | success | error | denied
    const [scanProgress, setScanProgress] = useState(0);
    const streamRef = useRef(null);

    // Start webcam
    useEffect(() => {
        let cancelled = false;

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, facingMode: 'user' }
                });
                if (cancelled) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                setStatus('scanning');
            } catch (err) {
                if (!cancelled) setStatus('denied');
            }
        }

        startCamera();

        return () => {
            cancelled = true;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    // Scanning animation — simulate face detection over ~3 seconds
    useEffect(() => {
        if (status !== 'scanning') return;
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setStatus('success');
                // Stop camera after success
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }
                setTimeout(() => {
                    onSuccess?.();
                }, 1200);
            }
        }, 60);

        return () => clearInterval(interval);
    }, [status, onSuccess]);

    // Draw scanning overlay on canvas
    useEffect(() => {
        if (status !== 'scanning' || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animFrame;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Face oval guide
            ctx.strokeStyle = scanProgress > 60 ? '#10b981' : '#0ea5e9';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, canvas.height / 2, 70, 90, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Scanning line
            const lineY = (canvas.height * (scanProgress % 100)) / 100;
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 80, lineY);
            ctx.lineTo(canvas.width / 2 + 80, lineY);
            ctx.stroke();

            // Corner brackets
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const bw = 80;
            const bh = 100;
            ctx.strokeStyle = scanProgress > 60 ? '#10b981' : '#38bdf8';
            ctx.lineWidth = 3;
            ctx.setLineDash([]);

            // Top-left
            ctx.beginPath(); ctx.moveTo(cx - bw, cy - bh + 20); ctx.lineTo(cx - bw, cy - bh); ctx.lineTo(cx - bw + 20, cy - bh); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(cx + bw - 20, cy - bh); ctx.lineTo(cx + bw, cy - bh); ctx.lineTo(cx + bw, cy - bh + 20); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(cx - bw, cy + bh - 20); ctx.lineTo(cx - bw, cy + bh); ctx.lineTo(cx - bw + 20, cy + bh); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(cx + bw - 20, cy + bh); ctx.lineTo(cx + bw, cy + bh); ctx.lineTo(cx + bw, cy + bh - 20); ctx.stroke();

            animFrame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animFrame);
    }, [status, scanProgress]);

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* Webcam viewport */}
            <div style={{
                width: 220, height: 220, borderRadius: '50%', overflow: 'hidden',
                border: `3px solid ${status === 'success' ? '#10b981' : status === 'denied' ? '#ef4444' : '#0ea5e9'}`,
                position: 'relative',
                boxShadow: status === 'success'
                    ? '0 0 30px rgba(16,185,129,0.3)'
                    : '0 0 30px rgba(14,165,233,0.2)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
            }}>
                {status !== 'denied' && (
                    <>
                        <video
                            ref={videoRef}
                            style={{
                                width: 280, height: 280,
                                objectFit: 'cover',
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%) scaleX(-1)',
                            }}
                            muted playsInline
                        />
                        <canvas
                            ref={canvasRef}
                            width={280} height={280}
                            style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%) scaleX(-1)',
                                pointerEvents: 'none',
                            }}
                        />
                    </>
                )}

                {/* Success overlay */}
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(16,185,129,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <CheckCircle size={48} color="#10b981" />
                    </motion.div>
                )}

                {/* Denied state */}
                {status === 'denied' && (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-card-subtle)',
                        flexDirection: 'column', gap: 8,
                    }}>
                        <Camera size={32} color="var(--text-muted)" />
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 16px' }}>Camera access denied</p>
                    </div>
                )}
            </div>

            {/* Status text */}
            <div>
                {status === 'initializing' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <Loader size={14} color="#0ea5e9" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Initializing camera...</span>
                    </div>
                )}
                {status === 'scanning' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                            <Camera size={14} color="#0ea5e9" />
                            <span style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 600 }}>Scanning face... {scanProgress}%</span>
                        </div>
                        <div style={{ width: 200, height: 4, borderRadius: 99, background: 'var(--border-primary)', overflow: 'hidden', margin: '0 auto' }}>
                            <motion.div
                                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #0ea5e9, #10b981)' }}
                                animate={{ width: `${scanProgress}%` }}
                            />
                        </div>
                    </div>
                )}
                {status === 'success' && (
                    <p style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>✓ Face recognized — Identity verified</p>
                )}
                {status === 'denied' && (
                    <p style={{ fontSize: 12, color: '#ef4444' }}>Please allow camera access to proceed</p>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
