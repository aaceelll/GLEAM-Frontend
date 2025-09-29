import { GleamLogo } from "@/components/gleam-logo"
import { StaffRegistrationForm } from "@/components/forms/staff-registration-form"

export default function StaffRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 flex flex-col">
      {/* Header konsisten */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <StaffRegistrationForm />
        </div>
      </main>
    </div>
  )
}
