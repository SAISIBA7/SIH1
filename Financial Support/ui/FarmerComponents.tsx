import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className = '', hoverEffect = false, style = {} }: GlassCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.50)',
        borderRadius: '14px',
        boxShadow: hoverEffect
          ? '0 12px 28px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.85)'
          : '0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.75)',
        padding: '1.5rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
        ...style,
      }}
      className={`farmer-glass-card ${hoverEffect ? 'farmer-glass-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.05rem', color: '#166534', zIndex: 2 }}>
        🔍
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search facilities...'}
        className="farmer-search-input"
        style={{
          width: '100%',
          padding: '0.8rem 1.1rem 0.8rem 2.9rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          fontSize: '0.95rem',
          color: '#0f172a',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
          transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
        }}
      />
    </div>
  );
}

interface FilterPanelProps {
  crops: string[];
  selectedCrop: string;
  onCrop: (c: string) => void;
  types: string[];
  selectedType: string;
  onType: (t: string) => void;
}

export function FilterPanel({ crops, selectedCrop, onCrop, types, selectedType, onType }: FilterPanelProps) {
  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      type="button"
      className="farmer-filter-chip"
      style={{
        padding: '0.35rem 0.85rem',
        borderRadius: '20px',
        border: active ? '1px solid #16a34a' : '1px solid rgba(255, 255, 255, 0.55)',
        cursor: 'pointer',
        fontSize: '0.78rem',
        fontWeight: active ? 800 : 600,
        background: active
          ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
          : 'rgba(255, 255, 255, 0.35)',
        color: active ? '#ffffff' : '#0f172a',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: active
          ? '0 2px 8px rgba(22, 163, 74, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: '0.85rem' }}>
        <p style={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.4rem' }}>
          Filter by Crop
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {['All', ...crops].map(c => chip(c, c === selectedCrop, () => onCrop(c)))}
        </div>
      </div>
      <div>
        <p style={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.4rem' }}>
          Filter by Facility Type
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {['All', ...types].map(t => chip(t, t === selectedType, () => onType(t)))}
        </div>
      </div>
    </div>
  );
}

interface DisclaimerBoxProps {
  text: string;
}

export function DisclaimerBox({ text }: DisclaimerBoxProps) {
  return (
    <div
      style={{
        background: 'rgba(254, 243, 199, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginTop: '1.5rem',
        boxShadow: '0 4px 16px rgba(180, 83, 9, 0.08)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
        <p style={{ margin: 0, fontSize: '0.84rem', color: '#78350f', lineHeight: 1.6, fontWeight: 600 }}>
          <strong>{text}</strong>
        </p>
      </div>
    </div>
  );
}

