'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockFacilities } from '../data';

export default function AcknowledgementPage() {
  const params = useSearchParams();
  const id = params?.get('id') || 'f1';
  const f = mockFacilities.find(x => x.id === id) || mockFacilities[0];
  const [checked, setChecked] = useState(false);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
      }}
    >
      <style>{`
        .gated-continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(22, 101, 52, 0.45) !important;
        }
        .ack-checkbox-label {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ack-checkbox-label:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: #16a34a !important;
        }
      `}</style>

      {/* Natural Grass Photo Background (Matching Equipment Page - Crisp, Naturally Visible) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/farmer-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.15) saturate(108%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.35) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '540px', width: '100%' }}>
        {/* Central Frosted White Glass Modal (Opacity: 0.88, Blur: 18px) */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(18px) saturate(170%)',
            WebkitBackdropFilter: 'blur(18px) saturate(170%)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2.25rem 2rem',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 1)',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          {/* Header Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1.5px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                margin: '0 auto 0.85rem',
                boxShadow: '0 4px 14px rgba(245,158,11,0.2)',
              }}
            >
              ⚠️
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem', letterSpacing: '-0.01em' }}>
              Important External Redirect
            </h1>
            <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
              Please review and acknowledge before leaving Smart Crop.
            </p>
          </div>

          {/* Bank Destination Card */}
          <div
            style={{
              background: 'rgba(240, 253, 244, 0.9)',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              marginBottom: '1.35rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center',
              boxShadow: '0 1px 4px rgba(22,101,52,0.06)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(22,101,52,0.25)',
              }}
            >
              🏦
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                You are being redirected to
              </div>
              <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem' }}>{f.bankName}</div>
              <div style={{ color: '#166534', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.1rem' }}>
                Official Bank Application Portal
              </div>
            </div>
          </div>

          {/* Clarifications List */}
          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '10px', padding: '0.5rem 1rem', border: '1px solid #e2e8f0' }}>
            {[
              'Smart Crop does not process, approve, or disburse this loan.',
              'Final eligibility, interest rate, documentation, and approval are determined solely by the bank.',
              'You will be redirected to the bank\'s official website to complete your application.',
              'Smart Crop never collects your loan application documents or banking credentials.',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.65rem',
                  padding: '0.6rem 0',
                  borderBottom: i < 3 ? '1px solid #e2e8f0' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ color: '#b45309', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>
                  •
                </span>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Checkbox Acknowledgment */}
          <label
            className="ack-checkbox-label"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: checked ? '#f0fdf4' : '#f8fafd',
              border: checked ? '1.5px solid #16a34a' : '1.5px solid #cbdcf2',
              borderRadius: '12px',
              boxShadow: checked ? '0 0 0 3px rgba(22, 163, 74, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div
              onClick={() => setChecked((c: boolean) => !c)}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                flexShrink: 0,
                marginTop: '1px',
                border: '2px solid',
                borderColor: checked ? '#16a34a' : '#94a3b8',
                background: checked ? '#16a34a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {checked && <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.55, userSelect: 'none', fontWeight: 600 }}>
              I have read and understood the displayed terms and conditions. I understand that Smart Crop is only redirecting me to the bank's official website and is not processing my loan application.
            </span>
          </label>

          {/* Continue Button */}
          <a
            href={checked ? f.applicationUrl : undefined}
            target={checked ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-disabled={!checked}
            className={checked ? 'gated-continue-btn' : ''}
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              background: checked ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : '#cbd5e1',
              color: checked ? '#ffffff' : '#94a3b8',
              padding: '1rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: checked ? '0 4px 18px rgba(22, 101, 52, 0.35)' : 'none',
              cursor: checked ? 'pointer' : 'not-allowed',
              pointerEvents: checked ? 'auto' : 'none',
              marginBottom: '0.75rem',
              transition: 'all 0.15s ease',
            }}
          >
            Continue to Bank Website →
          </a>

          {!checked && (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>
              Please check the acknowledgement box to proceed.
            </p>
          )}

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.76rem', marginTop: '0.9rem', marginBottom: 0 }}>
            🔒 You are leaving Smart Crop to visit the verified portal of <strong>{f.bankName}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

