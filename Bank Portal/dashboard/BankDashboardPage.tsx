'use client';
import React from 'react';
import Link from 'next/link';
import { Card, BANK_PAGE_CONTAINER_STYLE } from '../ui/BankComponents';
import { mockBanks, mockFacilities } from '../facilities/data';

const BANK = mockBanks[0];
const counts = {
  total: mockFacilities.filter(f => f.bankId === BANK.id).length,
  published: mockFacilities.filter(f => f.bankId === BANK.id && f.status === 'Published').length,
  draft: mockFacilities.filter(f => f.bankId === BANK.id && f.status === 'Draft').length,
  underReview: mockFacilities.filter(f => f.bankId === BANK.id && f.status === 'Under Review').length,
};

export default function BankDashboardPage() {
  return (
    <div style={BANK_PAGE_CONTAINER_STYLE}>
      <style>{`
        .bank-stat-card {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        }
        .bank-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px -3px rgba(22, 163, 74, 0.12) !important;
        }
        .quick-action-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(22, 163, 74, 0.16) !important;
        }
        .recent-facility-row {
          transition: background 0.15s ease;
          border-radius: 8px;
          padding: 0.85rem 0.75rem !important;
        }
        .recent-facility-row:hover {
          background: #f8fafd;
        }
      `}</style>

      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(220, 252, 231, 0.95)',
            border: '1px solid rgba(74, 222, 128, 0.5)',
            color: '#166534',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(22,163,74,0.2)',
          }}>
            <span>🏦</span>
            <span>BANK PARTNER PORTAL</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0 0.3rem', letterSpacing: '-0.02em' }}>
            Bank Dashboard
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
            Welcome back, <strong>{BANK.name}</strong>
          </p>
        </div>

        {/* Bank Status Card */}
        <Card style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 6px 18px rgba(22,163,74,0.25)' }}>
                🏦
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: 800 }}>{BANK.name}</h2>
                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                  {BANK.type} · {BANK.state}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.45rem 1.1rem', borderRadius: '24px', boxShadow: '0 2px 6px rgba(16,185,129,0.1)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span style={{ color: '#065f46', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.02em' }}>✓ VERIFIED BANK</span>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Total Facilities', value: counts.total, color: '#166534', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '#bbf7d0' },
            { label: 'Published', value: counts.published, color: '#166534', bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '#a7f3d0' },
            { label: 'Draft', value: counts.draft, color: '#92400e', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '#fde68a' },
            { label: 'Under Review', value: counts.underReview, color: '#6b21a8', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '#e9d5ff' },
          ].map(s => (
            <div
              key={s.label}
              className="bank-stat-card"
              style={{
                background: s.bg,
                borderRadius: '14px',
                padding: '1.5rem 1.25rem',
                textAlign: 'center',
                border: `1px solid ${s.border}`,
                boxShadow: '0 4px 14px rgba(30,64,120,0.05)',
              }}
            >
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.5rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <h3 style={{ color: '#166534', fontWeight: 800, margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Actions
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { href: '/bank-portal/facilities/add', label: '+ Add Facility', icon: '📋', primary: true },
              { href: '/bank-portal/facilities/manage', label: 'Manage Facilities', icon: '⚙️', primary: false },
              { href: '/bank-portal/register', label: 'Edit Bank Profile', icon: '🏦', primary: false },
              { href: '/financial-support/list', label: 'Preview Farmer View', icon: '👁️', primary: false },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="quick-action-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  backgroundColor: a.primary ? undefined : 'rgba(255, 255, 255, 0.9)',
                  background: a.primary ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : undefined,
                  color: a.primary ? '#ffffff' : '#166534',
                  border: a.primary ? 'none' : '1.5px solid #bbf7d0',
                  boxShadow: a.primary
                    ? '0 4px 16px rgba(22,163,74,0.25)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{a.icon}</span>
                <span style={{ color: a.primary ? '#ffffff' : '#166534' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Facilities */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📄</span>
            <h3 style={{ color: '#1e4078', fontWeight: 800, margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent Facilities
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {mockFacilities.filter(f => f.bankId === BANK.id).map(f => (
              <div
                key={f.id}
                className="recent-facility-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #edf2f7',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>{f.facilityName}</div>
                  <div style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '0.15rem' }}>
                    {f.facilityType} · {f.interestRate} · Updated {f.lastUpdated}
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.3rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    background: f.status === 'Published' ? '#dcfce7' : f.status === 'Draft' ? '#fef3c7' : '#f5f3ff',
                    color: f.status === 'Published' ? '#166534' : f.status === 'Draft' ? '#b45309' : '#7c3aed',
                    border: `1px solid ${f.status === 'Published' ? '#bbf7d0' : f.status === 'Draft' ? '#fde68a' : '#ddd6fe'}`,
                  }}
                >
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
