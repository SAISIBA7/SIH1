'use client';

import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { FormInput, PasswordInput, SelectInput, LoadingButton, AuthAlert } from './FormControls';
import { smartCropAuth, isValidIndianPhone, isValidEmail, UserSession, FarmerRegistrationData } from '@/lib/smartcrop-auth';

interface FarmerRegisterFormProps {
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

const CROPS = [
  { value: 'Rice / Paddy', label: '🌾 Rice / Paddy' },
  { value: 'Wheat', label: '🌾 Wheat' },
  { value: 'Cotton', label: '🌱 Cotton' },
  { value: 'Sugarcane', label: '🎋 Sugarcane' },
  { value: 'Maize / Corn', label: '🌽 Maize' },
  { value: 'Soybean', label: '🌿 Soybean' },
  { value: 'Mustard', label: '🌼 Mustard' },
  { value: 'Groundnut', label: '🥜 Groundnut' },
  { value: 'Tomato', label: '🍅 Tomato' },
  { value: 'Potato', label: '🥔 Potato' },
  { value: 'Pulses / Dal', label: '🍲 Pulses' },
];

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी (Hindi)' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ (Odia)' },
  { value: 'Bengali', label: 'বাংলা (Bengali)' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
  { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
];

export default function FarmerRegisterForm({
  onSuccess,
  onBackToRoles,
  onBackToLogin,
}: FarmerRegisterFormProps) {
  const [formData, setFormData] = useState<FarmerRegistrationData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'Male',
    state: 'Odisha',
    district: '',
    village: '',
    landArea: '',
    currentCrop: 'Rice / Paddy',
    sowingDate: new Date().toISOString().split('T')[0],
    preferredLanguage: 'English',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name is required.';
    }

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number required.';
    } else if (!isValidIndianPhone(formData.mobileNumber)) {
      errs.mobileNumber = 'Valid 10-digit number required.';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      errs.email = 'Valid email required.';
    }

    if (!formData.password) {
      errs.password = 'Password required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Min 8 characters.';
    }

    if (formData.password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.district.trim()) {
      errs.district = 'District required.';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'Please accept Terms & Privacy Policy.';
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
      const session = await smartCropAuth.registerFarmer(formData);
      onSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Failed to create farmer account.');
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

        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
          👨‍🌾 Farmer
        </span>
      </div>

      <div className="text-left">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
          Create Farmer Account
        </h2>
        <p className="text-[11px] text-slate-500 leading-tight">
          Join Smart Crop to monitor your farm and prevent crop distress
        </p>
      </div>

      <AuthAlert type="error" message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        {/* Row 1: Name & Mobile */}
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="Full Name"
            required
            placeholder="Ramesh Kumar"
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

        {/* Row 2: Passwords */}
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

        {/* Row 3: Demographics & Location */}
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
            placeholder="Mayurbhanj"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            error={errors.district}
          />

          <FormInput
            label="Village"
            placeholder="Baripada"
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
          />
        </div>

        {/* Row 4: Farm & Crop Info */}
        <div className="grid grid-cols-3 gap-2">
          <FormInput
            label="Land (Acres)"
            placeholder="3.5"
            value={formData.landArea}
            onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
          />

          <SelectInput
            label="Current Crop"
            value={formData.currentCrop}
            onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
            options={CROPS}
          />

          <SelectInput
            label="Language"
            value={formData.preferredLanguage}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            options={LANGUAGES}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3 w-3"
            />
            <span>I agree to the Terms of Service & Privacy Policy</span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[10px] font-medium text-rose-600 mt-0.5">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Creating account..."
          className="mt-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>CREATE FARMER ACCOUNT</span>
        </LoadingButton>
      </form>

      {/* Back to Login */}
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
