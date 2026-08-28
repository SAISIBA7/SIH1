'use client';

import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { FormInput, LoadingButton, AuthAlert } from './FormControls';
import { smartCropAuth } from '@/lib/smartcrop-auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setError('Please enter your registered email address or mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await smartCropAuth.forgotPassword(identifier);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIdentifier('');
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/70 p-6 text-left space-y-4 animate-in zoom-in-95 duration-200 ring-1 ring-white/60"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/70 rounded-lg transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-500">
              Recover access to your Smart Crop account
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="py-3 space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-700 font-medium px-2">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered <strong>email address</strong> or <strong>10-digit mobile number</strong>. We will send you verification instructions to reset your password.
            </p>

            <AuthAlert type="error" message={error} onClose={() => setError(null)} />

            <FormInput
              label="Email or Mobile Number"
              required
              placeholder="e.g. farmer@smartcrop.in or 9876543210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoFocus
            />

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Sending..."
                className="w-auto px-5 py-2.5"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </LoadingButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
