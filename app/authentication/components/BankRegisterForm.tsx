'use client';

import React, { useState } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { FormInput, PasswordInput, SelectInput, LoadingButton, AuthAlert } from './FormControls';
import { smartCropAuth, isValidIndianPhone, isValidEmail, UserSession, BankRegistrationData } from '@/lib/smartcrop-auth';

interface BankRegisterFormProps {
  onSuccess: (session: UserSession) => void;
  onBackToRoles: () => void;
  onBackToLogin: () => void;
}

const INDIAN_STATES = [
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Assam', label: 'Assam' },
];

export default function BankRegisterForm({
  onSuccess,
  onBackToRoles,
  onBackToLogin,
}: BankRegisterFormProps) {
  const [formData, setFormData] = useState<BankRegistrationData>({
    fullName: '',
    mobileNumber: '',
    officialEmail: '',
    password: '',
    organizationName: '',
    organizationType: 'Bank',
    employeeId: '',
    branch: '',
    state: 'Odisha',
    district: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number required.';
    } else if (!isValidIndianPhone(formData.mobileNumber)) {
      errs.mobileNumber = 'Valid 10-digit number required.';
    }

    if (!formData.officialEmail.trim()) {
      errs.officialEmail = 'Official email required.';
    } else if (!isValidEmail(formData.officialEmail)) {
      errs.officialEmail = 'Valid email required.';
    }

    if (!formData.password) {
      errs.password = 'Password required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Min 8 chars.';
    }

    if (formData.password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.organizationName.trim()) {
      errs.organizationName = 'Organization required.';
    }

    if (!formData.employeeId.trim()) {
      errs.employeeId = 'Officer ID required.';
    }

    if (!formData.branch.trim()) {
      errs.branch = 'Branch required.';
    }

    if (!formData.district.trim()) {
      errs.district = 'District required.';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'Please agree to Terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const session = await smartCropAuth.registerBank(formData);
      onSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Failed to register bank account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1">
        <button
          type="button"
          onClick={onBackToRoles}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Change Role</span>
        </button>

        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900">
          🏦 Bank / Insurance
        </span>
      </div>

      <div className="text-left">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
          Create Bank & Insurance Account
        </h2>
        <p className="text-[11px] text-slate-500 leading-tight">
          For agriculture credit underwriters, claim evaluators, and bankers
        </p>
      </div>

      <AuthAlert type="error" message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Full Name"
            required
            placeholder="Meera Patnaik"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <FormInput
            label="Mobile Number"
            type="tel"
            required
            placeholder="98765 43210"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            error={errors.mobileNumber}
            prefixElement={
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1 py-0.5 rounded">
                +91
              </span>
            }
          />
        </div>

        <FormInput
          label="Official Work Email"
          type="email"
          required
          placeholder="meera@sbi.co.in"
          value={formData.officialEmail}
          onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
          error={errors.officialEmail}
        />

        <div className="grid grid-cols-2 gap-2">
          <PasswordInput
            label="Password"
            required
            placeholder="Min 8 chars"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            required
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Organization"
            required
            placeholder="State Bank of India"
            value={formData.organizationName}
            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
            error={errors.organizationName}
          />

          <SelectInput
            label="Type"
            required
            value={formData.organizationType}
            onChange={(e) =>
              setFormData({ ...formData, organizationType: e.target.value as 'Bank' | 'Insurance' })
            }
            options={[
              { value: 'Bank', label: 'Commercial / Rural Bank' },
              { value: 'Insurance', label: 'Crop Insurance Company' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormInput
            label="Employee ID"
            required
            placeholder="EMP-9182"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            error={errors.employeeId}
          />

          <FormInput
            label="Branch"
            required
            placeholder="Main Branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            error={errors.branch}
          />

          <SelectInput
            label="State"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            options={INDIAN_STATES}
          />
        </div>

        <div className="pt-0.5">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3 w-3"
            />
            <span>I agree to the Financial Partner Terms & Privacy Policy</span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[10px] font-medium text-rose-600 mt-0.5">{errors.agreeTerms}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Creating account..."
          className="mt-1"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>CREATE BANK ACCOUNT</span>
        </LoadingButton>
      </form>

      <div className="text-center pt-1 border-t border-slate-200/60 text-[11px] text-slate-600">
        <span>Already registered? </span>
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Login here
        </button>
      </div>
    </div>
  );
}
