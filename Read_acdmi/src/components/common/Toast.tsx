import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success', duration = 3800) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getTheme = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={18} color="#059669" />,
          badgeBg: '#ecfdf5',
          borderAccent: '#10b981',
          progressColor: '#10b981'
        };
      case 'error':
        return {
          icon: <AlertCircle size={18} color="#e11d48" />,
          badgeBg: '#fff1f2',
          borderAccent: '#f43f5e',
          progressColor: '#f43f5e'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} color="#d97706" />,
          badgeBg: '#fffbeb',
          borderAccent: '#f59e0b',
          progressColor: '#f59e0b'
        };
      case 'info':
      default:
        return {
          icon: <Info size={18} color="#2563eb" />,
          badgeBg: '#eff6ff',
          borderAccent: '#3b82f6',
          progressColor: '#3b82f6'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Embedded CSS for Toast Animations */}
      <style>{`
        @keyframes toastSlideDown {
          0% {
            opacity: 0;
            transform: translate3d(0, -20px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .bca-toast-card {
          animation: toastSlideDown 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.25s ease;
        }
        .bca-toast-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.18);
        }
      `}</style>

      {/* Toast container: TOP-RIGHT */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          const theme = getTheme(toast.type);
          const durationSec = ((toast.duration || 3800) / 1000).toFixed(2);

          return (
            <div
              key={toast.id}
              className="bca-toast-card"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '14px',
                boxShadow: '0 18px 32px -8px rgba(15, 23, 42, 0.15), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                overflow: 'hidden'
              }}
            >
              {/* Left Accent Indicator Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: theme.borderAccent
                }}
              />

              {/* Icon badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: theme.badgeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)'
                }}
              >
                {theme.icon}
              </div>

              {/* Title & Message */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: '4px' }}>
                <h4
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: 0,
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {toast.title}
                </h4>
                {toast.message && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#475569',
                      margin: '4px 0 0 0',
                      lineHeight: 1.45,
                      fontWeight: 500
                    }}
                  >
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
                title="Dismiss"
              >
                <X size={15} />
              </button>

              {/* Bottom Countdown Progress Bar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2.5px',
                  backgroundColor: theme.progressColor,
                  opacity: 0.6,
                  animation: `toastProgress ${durationSec}s linear forwards`
                }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
