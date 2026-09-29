import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle2, X } from 'lucide-react';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  isAlert?: boolean; // If true, only shows OK button (replaces alert)
}

interface ConfirmContextType {
  confirm: (options: ConfirmDialogOptions | string) => Promise<boolean>;
  alert: (messageOrOptions: ConfirmDialogOptions | string) => Promise<void>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// Standalone global trigger so functions outside React components can also open popups
let globalConfirmHandler: ((options: ConfirmDialogOptions) => Promise<boolean>) | null = null;

export const showConfirmModal = (options: ConfirmDialogOptions | string): Promise<boolean> => {
  if (globalConfirmHandler) {
    const opts: ConfirmDialogOptions = typeof options === 'string' ? { message: options } : options;
    return globalConfirmHandler(opts);
  }
  // Fallback to native if context not ready yet
  const msg = typeof options === 'string' ? options : options.message;
  return Promise.resolve(window.confirm(msg));
};

export const showAlertModal = (options: ConfirmDialogOptions | string): Promise<void> => {
  if (globalConfirmHandler) {
    const opts: ConfirmDialogOptions = typeof options === 'string'
      ? { message: options, isAlert: true }
      : { ...options, isAlert: true };
    return globalConfirmHandler(opts).then(() => {});
  }
  const msg = typeof options === 'string' ? options : options.message;
  window.alert(msg);
  return Promise.resolve();
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<(ConfirmDialogOptions & { resolve: (val: boolean) => void }) | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const openDialog = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        ...options,
        resolve,
      });
    });
  }, []);

  useEffect(() => {
    globalConfirmHandler = openDialog;
    return () => {
      globalConfirmHandler = null;
    };
  }, [openDialog]);

  // Focus confirm button when dialog opens & listen for Escape/Enter
  useEffect(() => {
    if (!dialog) return;

    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        dialog.resolve(false);
        setDialog(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialog]);

  const handleConfirm = () => {
    if (dialog) {
      dialog.resolve(true);
      setDialog(null);
    }
  };

  const handleCancel = () => {
    if (dialog) {
      dialog.resolve(false);
      setDialog(null);
    }
  };

  const confirm = useCallback(
    (options: ConfirmDialogOptions | string) => {
      const opts: ConfirmDialogOptions = typeof options === 'string' ? { message: options } : options;
      return openDialog(opts);
    },
    [openDialog]
  );

  const alert = useCallback(
    (messageOrOptions: ConfirmDialogOptions | string) => {
      const opts: ConfirmDialogOptions = typeof messageOrOptions === 'string'
        ? { message: messageOrOptions, isAlert: true }
        : { ...messageOrOptions, isAlert: true };
      return openDialog(opts).then(() => {});
    },
    [openDialog]
  );

  // Derive visuals from dialog options
  const isDelete = dialog?.message.toLowerCase().includes('delete') || dialog?.message.toLowerCase().includes('remove');
  const isReject = dialog?.message.toLowerCase().includes('reject');
  const type: ConfirmType = dialog?.type || (isDelete || isReject ? 'danger' : 'info');

  const defaultTitle = dialog?.title || (
    dialog?.isAlert
      ? 'Notification'
      : isDelete
      ? 'Confirm Deletion'
      : isReject
      ? 'Confirm Rejection'
      : 'Please Confirm'
  );

  const defaultConfirmText = dialog?.confirmText || (
    dialog?.isAlert
      ? 'Understood'
      : isDelete
      ? 'Yes, Delete'
      : isReject
      ? 'Yes, Reject'
      : 'Confirm'
  );

  const defaultCancelText = dialog?.cancelText || 'Cancel';

  const getThemeDetails = () => {
    switch (type) {
      case 'danger':
        return {
          icon: isDelete ? <Trash2 size={24} color="#e11d48" /> : <AlertTriangle size={24} color="#e11d48" />,
          iconBg: '#ffe4e6',
          iconBorder: '#fecdd3',
          confirmBtnBg: '#e11d48',
          confirmBtnHover: '#be123c',
          confirmBtnShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} color="#d97706" />,
          iconBg: '#fef3c7',
          iconBorder: '#fde68a',
          confirmBtnBg: '#d97706',
          confirmBtnHover: '#b45309',
          confirmBtnShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={24} color="#059669" />,
          iconBg: '#ecfdf5',
          iconBorder: '#a7f3d0',
          confirmBtnBg: '#059669',
          confirmBtnHover: '#047857',
          confirmBtnShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
        };
      case 'info':
      default:
        return {
          icon: <Info size={24} color="#2563eb" />,
          iconBg: '#eff6ff',
          iconBorder: '#bfdbfe',
          confirmBtnBg: '#2563eb',
          confirmBtnHover: '#1d4ed8',
          confirmBtnShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}

      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'confirmFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          onClick={handleCancel}
        >
          <style>{`
            @keyframes confirmFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes confirmPopIn {
              from {
                opacity: 0;
                transform: scale(0.92) translateY(8px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '430px',
              padding: '24px',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'confirmPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={handleCancel}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Icon Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: theme.iconBg,
                  border: `1px solid ${theme.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {theme.icon}
              </div>
              <div style={{ paddingRight: '24px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {defaultTitle}
                </h3>
                {dialog.subtitle && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    {dialog.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div
              style={{
                fontSize: '0.92rem',
                color: '#334155',
                lineHeight: 1.55,
                marginBottom: '22px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                fontWeight: 500,
                wordBreak: 'break-word',
              }}
            >
              {dialog.message}
            </div>

            {/* Action Buttons Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              {!dialog.isAlert && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    height: '42px',
                    padding: '0 16px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#475569',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  {defaultCancelText}
                </button>
              )}

              <button
                ref={confirmBtnRef}
                type="button"
                onClick={handleConfirm}
                style={{
                  flex: dialog.isAlert ? undefined : 1,
                  minWidth: dialog.isAlert ? '120px' : undefined,
                  height: '42px',
                  padding: '0 20px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: theme.confirmBtnBg,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: theme.confirmBtnShadow,
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.confirmBtnHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.confirmBtnBg)}
              >
                {defaultConfirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
};
