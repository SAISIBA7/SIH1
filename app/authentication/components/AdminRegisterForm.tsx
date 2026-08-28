'use client';

import React, { useState } from 'react';
import { ArrowLeft, UserPlus, ShieldAlert } from 'lucide-react';
import { FormInput, PasswordInput, SelectInput, LoadingButton, AuthAlert } from './FormControls';
import { smartCropAuth, isValidIndianPhone, isValidEmail, UserSession, AdminRegistrationData } from '@/lib/smartcrop-auth';

interface AdminRegisterFormProps {
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

export default function AdminRegisterForm({
  onSuccess,
  onBackToRoles,
  onBackToLogin,
}: AdminRegisterFormProps) {
  const [formData, setFormData] = useState<AdminRegistrationData>({
    fullName: '',
    mobileNumber: '',
    officialEmail: '',
    password: '',
    organization: 'Department of Agriculture',
    designation: 'Agriculture Officer',
    state: 'Odisha',
    district: '',
    administratorId: '',
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
      errs.mobileNumber = 'Mobile number is required.';
    } else if (!isValidIndianPhone(formData.mobileNumber)) {
      errs.mobileNumber = 'Valid 10-digit mobile number required.';
    }

    if (!formData.officialEmail.trim()) {
      errs.officialEmail = 'Official email is required.';
    } else if (!isValidEmail(formData.officialEmail)) {
      errs.officialEmail = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Min 8 chars required.';
    }

    if (formData.password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.organization.trim()) {
      errs.organization = 'Organization is required.';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation is required.';
    }

    if (!formData.district.trim()) {
      errs.district = 'District is required.';
    }

    if (!formData.administratorId.trim()) {
      errs.administratorId = 'Admin ID is required.';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'Please agree to the Terms.';
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
      const session = await smartCropAuth.registerAdmin(formData);
      onSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Failed to register administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Role Switch Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1">
        <button
          type="button"
          onClick={onBackToRoles}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Change Role</span>
        </button>

        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-900">
          🧑‍💼 Administrator
        </span>
      </div>

      <div className="text-left">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
          Create Administrator Account
        </h2>
        <p className="text-[11px] text-slate-500 leading-tight">
          For agriculture officers, block coordinators, and state supervisors
        </p>
      </div>

      {/* Verification notice banner */}
      <div className="p-2 bg-amber-50/80 backdrop-blur-md border border-amber-200/80 rounded-xl text-left flex items-center gap-2 shadow-2xs">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <p className="text-[10px] text-amber-950 leading-tight">
          <strong>Official Notice:</strong> Administrator accounts require verification before access is granted.
        </p>
      </div>

      <AuthAlert type="error" message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Full Name"
            required
            placeholder="Dr. Anil Verma"
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
          label="Official Email"
          type="email"
          required
          placeholder="anil.verma@agri.gov.in"
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
            placeholder="Dept of Agriculture"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            error={errors.organization}
          />

          <FormInput
            label="Designation"
            required
            placeholder="District Agri Officer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            error={errors.designation}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SelectInput
            label="State"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            options={INDIAN_STATES}
          />

          <FormInput
            label="District"
            required
            placeholder="Cuttack"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            error={errors.district}
          />

          <FormInput
            label="Admin ID"
            required
            placeholder="AGRI-8821"
            value={formData.administratorId}
            onChange={(e) => setFormData({ ...formData, administratorId: e.target.value })}
            error={errors.administratorId}
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
            <span>I agree to the Terms of Official Governance & Privacy Policy</span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[10px] font-medium text-rose-600 mt-0.5">{errors.agreeTerms}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Submitting..."
          className="mt-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>CREATE ADMIN ACCOUNT</span>
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
