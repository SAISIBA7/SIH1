'use client';
import React, { useState } from 'react';
import { Card, Toast, BANK_INPUT_STYLE, BANK_LABEL_STYLE, BANK_PAGE_CONTAINER_STYLE, BANK_PRIMARY_BTN_STYLE } from '../ui/BankComponents';

const INSTITUTION_TYPES = [
  'Commercial Bank',
  'Regional Rural Bank',
  'Cooperative Bank',
  'Small Finance Bank',
  'Government Financial Institution',
  'Other approved financial institution',
];

export default function BankRegisterPage() {
  const [form, setForm] = useState({
    bankName: '',
    institutionType: '',
    website: '',
    email: '',
    phone: '',
    hq: '',
    state: '',
    district: '',
    country: 'India',
    description: '',
  });
  const [toast, setToast] = useState(false);
  const [done, setDone] = useState(false);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setToast(true);
    setTimeout(() => setToast(false), 4000);
  };

  return (
    <div style={BANK_PAGE_CONTAINER_STYLE}>
      <style>{`
        .bank-input:focus {
          border-color: #2563eb !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.2) !important;
          outline: none !important;
        }
        .bank-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35) !important;
        }
        .bank-submit-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header Badge & Title */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220, 252, 231, 0.95)', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#166534', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', boxShadow: '0 2px 8px rgba(22,163,74,0.2)' }}>
            <span>🏦</span>
            <span>BANK PARTNER PORTAL</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0 0.4rem', letterSpacing: '-0.02em' }}>
            Register as a Bank Partner
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
            Join Smart Crop to help farmers discover your agricultural financial facilities.
          </p>
        </div>

        {done ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem', boxShadow: '0 4px 14px rgba(37,99,235,0.15)' }}>
                🏦
              </div>
              <h2 style={{ color: '#1e4078', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Registration Submitted!</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Your bank registration has been submitted for Smart Crop administrator review. You will be contacted at your official email once verified.
              </p>
              <div style={{ background: '#f8fafd', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem', boxShadow: '0 2px 8px rgba(30,64,120,0.04)' }}>
                <p style={{ margin: 0, color: '#1e4078', fontSize: '0.95rem', fontWeight: 700 }}>
                  Verification Status: <span style={{ color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>Under Review</span>
                </p>
              </div>
              <button
                onClick={() => setDone(false)}
                className="bank-submit-btn"
                style={BANK_PRIMARY_BTN_STYLE}
              >
                Register Another Bank
              </button>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={sub}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid #eff6ff', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📋</span>
                <h2 style={{ color: '#1e4078', fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>Basic Information</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={BANK_LABEL_STYLE}>Bank / Institution Name *</label>
                  <input required className="bank-input" name="bankName" value={form.bankName} onChange={ch} placeholder="e.g. ABC Rural Bank" style={BANK_INPUT_STYLE} />
                </div>
                <div>
                  <label style={BANK_LABEL_STYLE}>Institution Type *</label>
                  <select required className="bank-input" name="institutionType" value={form.institutionType} onChange={ch} style={BANK_INPUT_STYLE}>
                    <option value="">Select type...</option>
                    {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={BANK_LABEL_STYLE}>Official Website *</label>
                  <input required type="url" className="bank-input" name="website" value={form.website} onChange={ch} placeholder="https://yourbank.com" style={BANK_INPUT_STYLE} />
                </div>
                <div>
                  <label style={BANK_LABEL_STYLE}>Official Email *</label>
                  <input required type="email" className="bank-input" name="email" value={form.email} onChange={ch} placeholder="contact@yourbank.com" style={BANK_INPUT_STYLE} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={BANK_LABEL_STYLE}>Official Phone *</label>
                  <input required className="bank-input" name="phone" value={form.phone} onChange={ch} placeholder="+91-98765-43210" style={BANK_INPUT_STYLE} />
                </div>
                <div>
                  <label style={BANK_LABEL_STYLE}>Country</label>
                  <input className="bank-input" name="country" value={form.country} onChange={ch} style={BANK_INPUT_STYLE} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={BANK_LABEL_STYLE}>Headquarters / Registered Office *</label>
                <input required className="bank-input" name="hq" value={form.hq} onChange={ch} placeholder="12, Agri Tower, Bhubaneswar" style={BANK_INPUT_STYLE} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={BANK_LABEL_STYLE}>State *</label>
                  <input required className="bank-input" name="state" value={form.state} onChange={ch} placeholder="e.g. Odisha" style={BANK_INPUT_STYLE} />
                </div>
                <div>
                  <label style={BANK_LABEL_STYLE}>District *</label>
                  <input required className="bank-input" name="district" value={form.district} onChange={ch} placeholder="e.g. Khordha" style={BANK_INPUT_STYLE} />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={BANK_LABEL_STYLE}>Short Description *</label>
                <textarea required className="bank-input" name="description" value={form.description} onChange={ch} rows={3} placeholder="Briefly describe your bank and its agricultural focus..." style={{ ...BANK_INPUT_STYLE, resize: 'vertical' }} />
              </div>

              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f7ff 100%)', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.75rem', fontSize: '0.88rem', color: '#1e4078', display: 'flex', gap: '0.65rem', alignItems: 'center', boxShadow: '0 2px 6px rgba(37,99,235,0.06)' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>ℹ️</span>
                <span>After submission, your bank profile is reviewed by Smart Crop administrators. You will be notified once verified.</span>
              </div>

              <button
                type="submit"
                className="bank-submit-btn"
                style={{
                  ...BANK_PRIMARY_BTN_STYLE,
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                }}
              >
                Submit Bank Registration
              </button>
            </form>
          </Card>
        )}
      </div>

      {toast && <Toast message="Registration submitted successfully! Under review." />}
    </div>
  );
}
