'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Toggle, Toast, BANK_PAGE_CONTAINER_STYLE, BANK_PRIMARY_BTN_STYLE } from '../ui/BankComponents';
import { mockFacilities } from './data';

export default function ManageFacilitiesPage() {
  const [facilities, setFacilities] = useState(mockFacilities.filter(f => f.bankId === 'b1'));
  const [toast, setToast] = useState('');

  const togglePublish = (id: string) => {
    setFacilities(prev => prev.map(f => {
      if (f.id !== id) return f;
      const next: import('./data').FacilityStatus = f.status === 'Published' ? 'Draft' : 'Published';
      setToast(next === 'Published' ? 'Facility published successfully!' : 'Facility unpublished and saved as draft.');
      setTimeout(() => setToast(''), 3000);
      return { ...f, status: next };
    }));
  };

  return (
    <div style={BANK_PAGE_CONTAINER_STYLE}>
      <style>{`
        .facility-action-link {
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .facility-action-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .add-facility-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35) !important;
        }
      `}</style>

      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220, 252, 231, 0.95)', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#166534', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', boxShadow: '0 2px 8px rgba(22,163,74,0.2)' }}>
              <span>🏦</span>
              <span>BANK PARTNER PORTAL</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0 0.3rem', letterSpacing: '-0.02em' }}>
              Manage Facilities
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
              ABC Rural Bank · <strong>{facilities.length}</strong> listed facilities
            </p>
          </div>
          <Link
            href="/bank-portal/facilities/add"
            className="add-facility-btn"
            style={BANK_PRIMARY_BTN_STYLE}
          >
            <span>+</span> Add New Facility
          </Link>
        </div>

        {/* Facility Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {facilities.map(f => (
            <Card key={f.id} hoverEffect={true}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>{f.facilityName}</span>
                    <span
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        background: f.status === 'Published' ? '#dcfce7' : f.status === 'Draft' ? '#fef3c7' : '#f5f3ff',
                        color: f.status === 'Published' ? '#166534' : f.status === 'Draft' ? '#b45309' : '#7c3aed',
                        border: `1px solid ${f.status === 'Published' ? '#bbf7d0' : f.status === 'Draft' ? '#fde68a' : '#ddd6fe'}`,
                      }}
                    >
                      {f.status}
                    </span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 500 }}>
                    {f.facilityType} · <strong style={{ color: '#166534' }}>{f.interestRate}</strong> · Updated {f.lastUpdated}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                    Amount: <strong style={{ color: '#0f172a' }}>{f.minAmount} – {f.maxAmount}</strong> · Tenure: {f.tenure}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#f8fafd', padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <Toggle
                      checked={f.status === 'Published'}
                      onChange={() => togglePublish(f.id)}
                      label={f.status === 'Published' ? 'Published' : 'Draft'}
                    />
                  </div>
                  <Link
                    href={`/bank-portal/facilities/add?id=${f.id}`}
                    className="facility-action-link"
                    style={{
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      padding: '0.55rem 1rem',
                      border: '1.5px solid #bbf7d0',
                      borderRadius: '8px',
                      background: '#ffffff',
                    }}
                  >
                    ✏️ Edit
                  </Link>
                  <Link
                    href={`/financial-support/detail?id=${f.id}`}
                    className="facility-action-link"
                    style={{
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      padding: '0.55rem 1rem',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                    }}
                  >
                    👁️ View
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}


