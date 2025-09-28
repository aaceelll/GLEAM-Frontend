import { GleamLogo } from "@/components/gleam-logo";
import { StaffLoginForm } from "@/components/forms/staff-login-form";

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 flex flex-col">
      {/* Header konsisten */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Main: center */}
      <main className="flex flex-1 items-center justify-center px-4">
        {/* Samakan lebar dengan register: max-w-xl */}
        <div className="w-full max-w-xl">
          <StaffLoginForm />
        </div>
      </main>
    </div>
  );
}
