'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, BANK_PAGE_CONTAINER_STYLE } from '../ui/BankComponents';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/language-context';

interface DashboardData {
  bank: {
    id: string;
    bankName: string;
    institutionType: string;
    verificationStatus: string;
    state: string | null;
    district: string | null;
  };
  counts: { total: number; published: number; draft: number; underReview: number };
  recentFacilities: Array<{
    id: string;
    facilityName: string;
    facilityType: string;
    status: string;
    interestRate: string | null;
    updatedAt: string;
  }>;
}

// Verification badge config per DB verification_status (banks.verification_status)
const VERIFICATION_BADGES: Record<string, { key: string; defaultLabel: string; bg: string; color: string; border: string; dot: string }> = {
  verified:     { key: 'verified_bank',      defaultLabel: '✓ VERIFIED BANK',       bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
  under_review: { key: 'under_review_badge', defaultLabel: '⏳ UNDER REVIEW',        bg: '#fffbeb', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
  submitted:    { key: 'submitted_badge',   defaultLabel: 'SUBMITTED FOR REVIEW',   bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' },
  draft:        { key: 'draft_badge',       defaultLabel: 'DRAFT PROFILE',          bg: '#f8fafc', color: '#475569', border: '#e2e8f0', dot: '#94a3b8' },
  rejected:     { key: 'rejected_badge',    defaultLabel: '✗ REJECTED',             bg: '#fef2f2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
  suspended:    { key: 'suspended_badge',   defaultLabel: 'SUSPENDED',              bg: '#fef2f2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
};

// DB status -> display label + badge colors (8 statuses in financial_facilities)
const STATUS_DISPLAY: Record<string, { key: string; defaultLabel: string; bg: string; color: string; border: string }> = {
  published:    { key: 'published',    defaultLabel: 'Published',    bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  draft:        { key: 'draft',        defaultLabel: 'Draft',        bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  submitted:    { key: 'submitted',    defaultLabel: 'Submitted',    bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  under_review: { key: 'under_review', defaultLabel: 'Under Review', bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  approved:     { key: 'approved',     defaultLabel: 'Approved',     bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  unpublished:  { key: 'unpublished',  defaultLabel: 'Unpublished',  bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  expired:      { key: 'expired',      defaultLabel: 'Expired',      bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  suspended:    { key: 'suspended',    defaultLabel: 'Suspended',    bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

const NEUTRAL_STATUS = { key: '', defaultLabel: '', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function BankDashboardPage() {
  const searchParams = useSearchParams();
  const bankId = searchParams?.get('bankId') || 'bank_test_facility_check';
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bankId) {
      setError('No bank selected. Open this page with your bank id, e.g. /bank-portal/dashboard?bankId=bank_xxx');
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/banks/${encodeURIComponent(bankId)}/dashboard`);
        const json = await res.json().catch(() => ({}) as { error?: string });
        if (cancelled) return;
        if (res.ok) {
          setData(json as DashboardData);
        } else {
          setError(json.error || `Failed to load dashboard (HTTP ${res.status}).`);
        }
      } catch {
        if (!cancelled) setError('Network error — could not reach the server.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [bankId]);

  // ---- Loading state ----
  if (loading) {
    return (
      <div style={BANK_PAGE_CONTAINER_STYLE}>
        <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏦</div>
          <p style={{ color: '#475569', fontWeight: 700 }}>{t('loading', 'Loading dashboard…')}</p>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (error || !data) {
    return (
      <div style={BANK_PAGE_CONTAINER_STYLE}>
        <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '3rem' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>⚠️</div>
              <h2 style={{ color: '#991b1b', margin: '0 0 0.5rem' }}>{t('could_not_load_dashboard', 'Could not load dashboard')}</h2>
              <p style={{ color: '#475569', margin: 0 }}>{error}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const vBadge = VERIFICATION_BADGES[data.bank.verificationStatus] ?? VERIFICATION_BADGES.draft;
  const counts = data.counts;

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
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 999, overflow: 'visible' }}>
          <div>
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
              <span>{t('bank_portal', 'BANK PARTNER PORTAL')}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0 0.3rem', letterSpacing: '-0.02em' }}>
              {t('bank_dashboard', 'Bank Dashboard')}
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
              {t('welcome', 'Welcome back')}, <strong>{data.bank.bankName}</strong>
            </p>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <LanguageSelector variant="light" />
          </div>
        </div>

        {/* Bank Status Card */}
        <Card style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 6px 18px rgba(22,163,74,0.25)' }}>
                🏦
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: 800 }}>{data.bank.bankName}</h2>
                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                  {data.bank.institutionType}{data.bank.state ? ` · ${data.bank.state}` : ''}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: vBadge.bg, border: `1px solid ${vBadge.border}`, padding: '0.45rem 1.1rem', borderRadius: '24px', boxShadow: '0 2px 6px rgba(16,185,129,0.1)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: vBadge.dot, display: 'inline-block' }}></span>
              <span style={{ color: vBadge.color, fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.02em' }}>
                {t(vBadge.key, vBadge.defaultLabel)}
              </span>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {[
            { key: 'total_facilities', label: 'Total Facilities', value: counts.total, color: '#166534', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '#bbf7d0' },
            { key: 'published', label: 'Published', value: counts.published, color: '#166534', bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '#a7f3d0' },
            { key: 'draft', label: 'Draft', value: counts.draft, color: '#92400e', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '#fde68a' },
            { key: 'under_review', label: 'Under Review', value: counts.underReview, color: '#6b21a8', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '#e9d5ff' },
          ].map(s => (
            <div
              key={s.key}
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
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.5rem' }}>
                {t(s.key, s.label)}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <h3 style={{ color: '#166534', fontWeight: 800, margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('quick_actions', 'Quick Actions')}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { href: `/bank-portal/facilities/add?bankId=${bankId}`, key: 'add_facility', label: '+ Add Facility', icon: '📋', primary: true },
              { href: '/bank-portal/facilities/manage', key: 'manage_facilities', label: 'Manage Facilities', icon: '⚙️', primary: false },
              { href: '/bank-portal/register', key: 'edit_bank_profile', label: 'Edit Bank Profile', icon: '🏦', primary: false },
              { href: '/financial-support/list', key: 'preview_farmer_view', label: 'Preview Farmer View', icon: '👁️', primary: false },
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
                <span style={{ color: a.primary ? '#ffffff' : '#166534' }}>{t(a.key, a.label)}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Facilities */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📄</span>
            <h3 style={{ color: '#1e40af', fontWeight: 800, margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('recent_facilities', 'Recent Facilities')}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {data.recentFacilities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.95rem' }}>
                {t('no_facilities_yet', 'No facilities yet — click "+ Add Facility" to create your first listing.')}
              </div>
            ) : (
              data.recentFacilities.map(f => {
                const sd = STATUS_DISPLAY[f.status] ?? { ...NEUTRAL_STATUS, defaultLabel: f.status };
                return (
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
                        {f.facilityType} · {f.interestRate || '—'} · Updated {fmtDate(f.updatedAt)}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '0.3rem 0.85rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        background: sd.bg,
                        color: sd.color,
                        border: `1px solid ${sd.border}`,
                      }}
                    >
                      {t(sd.key, sd.defaultLabel)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
