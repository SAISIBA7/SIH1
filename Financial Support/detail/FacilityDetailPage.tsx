'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mockFacilities, DISCLAIMER } from '../data';
import { GlassCard, DisclaimerBox } from '../ui/FarmerComponents';

export default function FacilityDetailPage() {
  const params = useSearchParams();
  const id = params?.get('id') || 'f1';
  const f = mockFacilities.find(x => x.id === id) || mockFacilities[0];
  const [showTerms, setShowTerms] = useState(false);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: '0.75rem',
        padding: '0.65rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.45)',
      }}
    >
      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', alignSelf: 'center' }}>
        {label}
      </span>
      <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{value}</span>
    </div>
  );

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        .farmer-back-link {
          transition: transform 0.2s, background-color 0.2s;
        }
        .farmer-back-link:hover {
          transform: translateX(-3px);
          background: rgba(255, 255, 255, 0.85) !important;
          color: #166534 !important;
        }
        .apply-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(22, 101, 52, 0.4) !important;
        }
        .terms-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.85) !important;
          transform: translateY(-1px);
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
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(0, 0, 0, 0.05) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, padding: '2.25rem 1.25rem 3.5rem', maxWidth: '780px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link
          href="/financial-support/list"
          className="farmer-back-link"
          style={{
            color: '#166534',
            fontSize: '0.85rem',
            textDecoration: 'none',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '1.25rem',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: '0.45rem 1rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          ← Back to All Facilities
        </Link>

        {/* Facility Header GlassCard (Clean White Frosted Glass) */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  boxShadow: '0 2px 8px rgba(22,101,52,0.25)',
                }}
              >
                🏦
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0b1a0e', fontSize: '1.1rem' }}>{f.bankName}</div>
                {f.bankVerified && (
                  <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', marginTop: '0.1rem' }}>
                    ✓ VERIFIED BANK PARTNER
                  </div>
                )}
              </div>
            </div>
            <span
              style={{
                background: 'rgba(220, 252, 231, 0.95)',
                color: '#166534',
                border: '1px solid rgba(74, 222, 128, 0.5)',
                padding: '0.3rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.76rem',
                fontWeight: 800,
              }}
            >
              {f.facilityType}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0b1a0e', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            {f.facilityName}
          </h1>
          <p style={{ color: '#334155', margin: 0, lineHeight: 1.6, fontSize: '0.92rem' }}>{f.detailedDescription}</p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.75rem', marginBottom: 0, fontWeight: 500 }}>
            Last Updated by Bank: <strong style={{ color: '#0f172a' }}>{f.lastUpdated}</strong>
          </p>
        </GlassCard>

        {/* Financial Info GlassCard */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💰</span>
            <h2 style={{ color: '#0b1a0e', fontWeight: 800, fontSize: '0.98rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Loan Amount &amp; Terms
            </h2>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
            {f.minAmount} – {f.maxAmount}
          </div>
          <InfoRow label="Interest Rate" value={f.interestRate} />
          <InfoRow label="Tenure Period" value={f.tenure} />
          <InfoRow label="Repayment Mode" value={f.repayment} />
          <InfoRow label="Processing Fee" value={f.processingFee} />
          {f.otherCharges && <InfoRow label="Other Charges" value={f.otherCharges} />}
        </GlassCard>

        {/* Eligibility GlassCard */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>👥</span>
            <h2 style={{ color: '#0b1a0e', fontWeight: 800, fontSize: '0.98rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Eligibility Criteria
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {f.farmerType.map(t => (
              <li key={t} style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> Eligible: {t}
              </li>
            ))}
            <li style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> Minimum Land Holding: <strong>{f.minLand}</strong>
            </li>
            <li style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> Eligible Crops: <strong>{f.cropTypes.join(', ')}</strong>
            </li>
            <li style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> Applicable States: {f.states.join(', ')}
            </li>
            <li style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> Applicable Districts: {f.districts.join(', ')}
            </li>
            {f.otherEligibility && (
              <li style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> {f.otherEligibility}
              </li>
            )}
          </ul>
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.75rem 0.9rem',
              background: 'rgba(254, 243, 199, 0.85)',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.45)',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350f', fontStyle: 'italic', fontWeight: 600 }}>
              You may be eligible. Final eligibility and approval are determined by the bank.
            </p>
          </div>
        </GlassCard>

        {/* Required Documents GlassCard */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📑</span>
            <h2 style={{ color: '#0b1a0e', fontWeight: 800, fontSize: '0.98rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Required Documents
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {f.documents.map(d => (
              <li key={d} style={{ display: 'flex', gap: '0.5rem', padding: '0.4rem 0.65rem', color: '#0f172a', fontSize: '0.88rem', fontWeight: 600, background: 'rgba(255,255,255,0.55)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.65)' }}>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> {d}
              </li>
            ))}
          </ul>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.75rem', marginBottom: 0, fontStyle: 'italic' }}>
            ℹ️ Document submission happens securely on the bank's official website, not on Smart Crop.
          </p>
        </GlassCard>

        {/* Benefits GlassCard */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🌟</span>
            <h2 style={{ color: '#0b1a0e', fontWeight: 800, fontSize: '0.98rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Facility Benefits
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {f.benefits.map(b => (
              <li key={b} style={{ display: 'flex', gap: '0.65rem', padding: '0.35rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> {b}
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Terms GlassCard */}
        <GlassCard style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📜</span>
            <h2 style={{ color: '#0b1a0e', fontWeight: 800, fontSize: '0.98rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Terms &amp; Conditions
            </h2>
          </div>
          <button
            onClick={() => setShowTerms((s: boolean) => !s)}
            className="terms-toggle-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              color: '#1e4078',
              padding: '0.55rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.15s',
            }}
          >
            {showTerms ? '▲ Hide Terms Summary' : '▼ View Terms Summary'}
          </button>
          {showTerms && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                fontSize: '0.88rem',
                color: '#334155',
                lineHeight: 1.6,
                border: '1px solid rgba(255, 255, 255, 0.75)',
              }}
            >
              <p style={{ margin: 0 }}>{f.termsText}</p>
              {f.termsUrl && (
                <a
                  href={f.termsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1d4ed8', fontWeight: 700, display: 'inline-block', marginTop: '0.75rem', textDecoration: 'underline' }}
                >
                  View Full Terms on Bank Official Website →
                </a>
              )}
            </div>
          )}
        </GlassCard>

        {/* Disclaimer - Section 33 verbatim */}
        <DisclaimerBox text={DISCLAIMER} />

        {/* CTA Container */}
        <div style={{ marginTop: '1.75rem' }}>
          <GlassCard style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.9rem 1.1rem',
                background: 'rgba(254, 243, 199, 0.85)',
                borderRadius: '10px',
                marginBottom: '1.25rem',
                border: '1px solid rgba(245, 158, 11, 0.45)',
              }}
            >
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, color: '#78350f', fontSize: '0.85rem', lineHeight: 1.55 }}>
                <strong>IMPORTANT NOTICE:</strong>
                <br />
                Final eligibility, interest rate, approval and terms are determined solely by {f.bankName}. Smart Crop does not process, approve, or disburse loans.
              </p>
            </div>

            <Link
              href={`/financial-support/acknowledgement?id=${f.id}`}
              className="apply-cta-btn"
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1.05rem',
                boxShadow: '0 4px 16px rgba(22, 101, 52, 0.3)',
                letterSpacing: '0.01em',
                transition: 'all 0.15s ease',
              }}
            >
              Apply on Bank Website →
            </Link>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}


