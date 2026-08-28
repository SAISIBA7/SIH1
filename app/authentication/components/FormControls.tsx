'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 FORM INPUT                                 */
/* -------------------------------------------------------------------------- */
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  helperText,
  prefixElement,
  suffixElement,
  className = '',
  id,
  required,
  ...props
}: FormInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full space-y-1 text-left">
      <label htmlFor={inputId} className="block text-[11px] font-bold text-slate-800 leading-tight drop-shadow-2xs">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>

      <div className="relative flex items-center">
        {prefixElement && (
          <div className="absolute left-2 flex items-center pointer-events-none text-slate-600 z-10">
            {prefixElement}
          </div>
        )}

        <input
          id={inputId}
          required={required}
          className={`w-full rounded-xl border bg-white/65 hover:bg-white/80 focus:bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs ${
            prefixElement ? 'pl-13' : 'pl-3'
          } ${suffixElement ? 'pr-9' : 'pr-3'} ${
            error
              ? 'border-rose-400/90 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/50'
              : 'border-white/70 hover:border-emerald-300/80'
          } ${className}`}
          {...props}
        />

        {suffixElement && (
          <div className="absolute right-2.5 flex items-center text-slate-400">
            {suffixElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[10px] font-medium text-rose-600 flex items-center gap-1 mt-0.5 leading-none">
          <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{helperText}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PASSWORD INPUT                               */
/* -------------------------------------------------------------------------- */
export interface PasswordInputProps extends Omit<FormInputProps, 'type' | 'suffixElement'> {
  showStrength?: boolean;
}

export function PasswordInput({
  label,
  value,
  showStrength = false,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const pwdStr = typeof value === 'string' ? value : '';
  const hasLength = pwdStr.length >= 8;
  const hasUpper = /[A-Z]/.test(pwdStr);
  const hasLower = /[a-z]/.test(pwdStr);
  const hasNum = /\d/.test(pwdStr);

  return (
    <div className="w-full space-y-1 text-left">
      <FormInput
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        error={error}
        suffixElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-0.5 hover:text-slate-700 text-slate-400 transition-colors focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            )}
          </button>
        }
        {...props}
      />

      {showStrength && pwdStr.length > 0 && (
        <div className="pt-0.5 space-y-0.5">
          <div className="grid grid-cols-4 gap-1 h-0.5">
            <div
              className={`rounded-full h-0.5 transition-all ${
                hasLength ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full h-0.5 transition-all ${
                hasUpper ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full h-0.5 transition-all ${
                hasLower ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full h-0.5 transition-all ${
                hasNum ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                SELECT INPUT                                */
/* -------------------------------------------------------------------------- */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function SelectInput({
  label,
  options,
  error,
  placeholder = 'Select an option',
  className = '',
  id,
  required,
  ...props
}: SelectInputProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full space-y-1 text-left">
      <label htmlFor={selectId} className="block text-[11px] font-bold text-slate-800 leading-tight drop-shadow-2xs">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>

      <select
        id={selectId}
        required={required}
        className={`w-full rounded-xl border bg-white/65 hover:bg-white/80 focus:bg-white/95 backdrop-blur-md px-2.5 py-1.5 text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs cursor-pointer ${
          error
            ? 'border-rose-400/90 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/50'
            : 'border-white/70 hover:border-emerald-300/80'
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[10px] font-medium text-rose-600 flex items-center gap-1 mt-0.5 leading-none">
          <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               LOADING BUTTON                               */
/* -------------------------------------------------------------------------- */
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const baseClasses =
    'relative w-full py-2.5 px-3.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-600/95 via-emerald-600 to-teal-700/95 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg shadow-emerald-900/30 border border-emerald-400/30 focus:ring-emerald-600 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none',
    secondary:
      'bg-white/70 hover:bg-white/90 backdrop-blur-md text-emerald-900 border border-white/80 shadow-2xs focus:ring-emerald-400 disabled:opacity-60',
    outline:
      'bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/70 text-slate-700 focus:ring-slate-400 disabled:opacity-50',
    ghost:
      'bg-transparent hover:bg-white/50 backdrop-blur-xs text-emerald-700 focus:ring-emerald-300 disabled:opacity-50',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
          <span>{loadingText || 'Processing...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 AUTH ALERT                                 */
/* -------------------------------------------------------------------------- */
export interface AuthAlertProps {
  type?: 'error' | 'success' | 'info';
  message: string | null;
  onClose?: () => void;
}

export function AuthAlert({ type = 'error', message, onClose }: AuthAlertProps) {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-50/85 backdrop-blur-md border-rose-200/90 text-rose-900',
    success: 'bg-emerald-50/85 backdrop-blur-md border-emerald-200/90 text-emerald-900',
    info: 'bg-teal-50/85 backdrop-blur-md border-teal-200/90 text-teal-900',
  };

  const icons = {
    error: <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />,
    info: <AlertCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs font-medium shadow-xs backdrop-blur-md transition-all ${styles[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 leading-snug">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 font-bold ml-1 cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                AUTH DIVIDER                                */
/* -------------------------------------------------------------------------- */
export function AuthDivider({ text = 'or' }: { text?: string }) {
  return (
    <div className="relative my-2 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/60" />
      </div>
      <div className="relative bg-white/70 px-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider backdrop-blur-md rounded-full border border-white/60">
        {text}
      </div>
    </div>
  );
}

