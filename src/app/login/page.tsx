import { UserLoginForm } from "@/components/forms/user-login-form";

export default function UserLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Soft blobs (sangat halus, tidak membentuk blok hijau) */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-teal-200/25 blur-3xl" />
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.05)_100%)]" />

      {/* Main only (tanpa header). Logo di atas card */}
      <main className="relative z-0 flex min-h-screen items-center justify-center px-4 py-14">
        <div className="w-full max-w-md">
          <UserLoginForm />
        </div>
      </main>
    </div>
  );
}
