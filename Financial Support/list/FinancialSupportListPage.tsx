'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockFacilities } from '../data';
import { SearchBar, FilterPanel } from '../ui/FarmerComponents';

const ALL_CROPS = Array.from(new Set(mockFacilities.flatMap(f => f.cropTypes)));
const ALL_TYPES = Array.from(new Set(mockFacilities.map(f => f.facilityType)));
const PUBLISHED = mockFacilities.filter(f => f.status === 'Published');

export default function FinancialSupportListPage() {
  const [search, setSearch] = useState('');
  const [crop, setCrop] = useState('All');
  const [type, setType] = useState('All');

  const filtered = PUBLISHED.filter(f => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      f.facilityName.toLowerCase().includes(q) ||
      f.bankName.toLowerCase().includes(q) ||
      f.facilityType.toLowerCase().includes(q);
    const matchCrop = crop === 'All' || f.cropTypes.includes(crop);
    const matchType = type === 'All' || f.facilityType === type;
    return matchSearch && matchCrop && matchType;
  });

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <style>{`
        .farmer-search-input:focus {
          border-color: #16a34a !important;
          background: rgba(255, 255, 255, 0.75) !important;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2) !important;
        }
        .facility-glass-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .facility-glass-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.32) !important;
          border-color: rgba(34, 197, 94, 0.55) !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06), 0 0 16px rgba(34, 197, 94, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
        }
        .farmer-filter-chip:hover {
          transform: translateY(-1px);
        }
        .farmer-apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 101, 52, 0.35) !important;
        }
      `}</style>

      {/* Natural Grass Photo Background (Matching Equipment Page - Crisp, Naturally Visible, Ambient Light) */}
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

      <div style={{ position: 'relative', zIndex: 1, padding: '2.25rem 1.25rem 3.5rem', maxWidth: '1060px', margin: '0 auto' }}>
        {/* Main Banner Container with Clean White Frosted Glassmorphism (Opacity: 0.22, Blur: 14px) */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.50)',
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.75)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(220, 252, 231, 0.95)', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#166534', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                <span>🏦</span>
                <span>FINANCIAL SUPPORT</span>
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0b1a0e', margin: '0.65rem 0 0.3rem', letterSpacing: '-0.02em' }}>
                Agricultural Financial Facilities
              </h1>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 500, margin: 0, lineHeight: 1.45 }}>
                Discover agricultural financial facilities from verified banks. These are <strong style={{ color: '#166534' }}>potentially relevant</strong> to your farming profile.
              </p>
            </div>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#166534',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              📍 Odisha Region
            </span>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '1.25rem' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by facility name, bank, or facility type..." />
          </div>

          {/* Filters */}
          <FilterPanel crops={ALL_CROPS} selectedCrop={crop} onCrop={setCrop} types={ALL_TYPES} selectedType={type} onType={setType} />
        </div>

        {/* Results count indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.25rem' }}>
          <p style={{ color: '#0b1a0e', fontSize: '0.92rem', fontWeight: 800, margin: 0 }}>
            Showing {filtered.length} potentially relevant {filtered.length === 1 ? 'facility' : 'facilities'}
          </p>
        </div>

        {/* Floating Clean White Glass Cards Grid (Opacity: 0.22, Blur: 14px) */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.55)',
              borderRadius: '14px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ color: '#0b1a0e', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>No matching facilities found</h3>
            <p style={{ color: '#475569', fontWeight: 500, margin: 0 }}>Try clearing some of your search terms or filters above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(f => (
              <article
                key={f.id}
                className="facility-glass-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(14px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        background: 'rgba(220, 252, 231, 0.95)',
                        color: '#166534',
                        border: '1px solid rgba(74, 222, 128, 0.5)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {f.facilityType}
                    </span>
                    {f.bankVerified && (
                      <span
                        style={{
                          color: '#15803d',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: 'rgba(240, 253, 244, 0.9)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '14px',
                          border: '1px solid rgba(134, 239, 172, 0.5)',
                        }}
                      >
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b1a0e', margin: '0 0 0.3rem', letterSpacing: '-0.01em' }}>
                    {f.facilityName}
                  </h2>
                  <p style={{ color: '#166534', fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.65rem' }}>
                    🏦 {f.bankName}
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.86rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
                    {f.shortDescription}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Interest Rate', value: f.interestRate, highlight: true },
                      { label: 'Tenure', value: f.tenure, highlight: false },
                      { label: 'Min Amount', value: f.minAmount, highlight: false },
                      { label: 'Max Amount', value: f.maxAmount, highlight: false },
                    ].map(item => (
                      <div
                        key={item.label}
                        style={{
                          background: 'rgba(255, 255, 255, 0.55)',
                          border: '1px solid rgba(255, 255, 255, 0.65)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.65rem',
                        }}
                      >
                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: item.highlight ? '#166534' : '#0f172a', fontWeight: 800, marginTop: '0.1rem' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      background: 'rgba(254, 243, 199, 0.85)',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.7rem',
                      marginBottom: '1.1rem',
                    }}
                  >
                    <p style={{ color: '#78350f', fontSize: '0.76rem', fontStyle: 'italic', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                      You may be eligible. Final eligibility and approval are determined by the bank.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/financial-support/detail?id=${f.id}`}
                  className="farmer-apply-btn"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    boxShadow: '0 3px 12px rgba(22, 101, 52, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  View Details &amp; Apply →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

