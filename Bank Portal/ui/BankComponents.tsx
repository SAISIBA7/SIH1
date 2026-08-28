import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', hoverEffect = false, style = {} }: CardProps) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '1.75rem',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      className={`bank-card ${hoverEffect ? 'bank-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export const BANK_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1.5px solid #bbf7d0',
  fontSize: '0.95rem',
  color: '#0f172a',
  background: '#f8fafd',
  outline: 'none',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
  transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
};

export const BANK_LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#166534',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

export const BANK_PRIMARY_BTN_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  padding: '0.85rem 1.75rem',
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.28), 0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
};

export const BANK_PAGE_CONTAINER_STYLE: React.CSSProperties = {
  minHeight: '100vh',
  padding: '2.5rem 1.25rem',
};

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '13px',
          background: checked ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#cbd5e1',
          position: 'relative',
          transition: 'background 0.25s, box-shadow 0.25s',
          boxShadow: checked ? '0 2px 8px rgba(22, 163, 74, 0.35)' : 'inset 0 1px 2px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{label}</span>}
    </label>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 30, 60, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2.25rem',
          maxWidth: '480px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 50px -10px rgba(15, 30, 60, 0.35), 0 0 0 1px rgba(212, 226, 244, 0.8)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: '#166534', fontSize: '1.2rem', fontWeight: 800 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 2000,
        background: type === 'success' ? '#166534' : '#991b1b',
        color: '#ffffff',
        padding: '1rem 1.75rem',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08)',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontWeight: 700,
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{type === 'success' ? '✓' : '!'}</span>
      <span>{message}</span>
    </div>
  );
}

