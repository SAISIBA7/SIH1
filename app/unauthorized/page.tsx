import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Smart Crop | Unauthorized Access",
  description: "Access Restricted by Role-Based Security Policies.",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F2F2EF] text-[#1A1A1A] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-[28px] border border-black/10 p-8 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Access Restricted</h1>
        <p className="text-xs text-neutral-600 leading-relaxed">
          You do not have the required role permissions (Farmer, Agriculture Officer, Government Administrator, or Bank Partner) to access this protected area.
        </p>
        <div className="pt-2">
          <Link
            href="/authentication"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#CFE362]" />
            Return to Authentication
          </Link>
        </div>
      </div>
    </div>
  );
}
