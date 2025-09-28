import { GleamLogo } from "@/components/gleam-logo"
import { StaffRegistrationForm } from "@/components/forms/staff-registration-form"
import Link from "next/link"

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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Daftar Staff/Petugas</h1>
            <p className="text-muted-foreground">Selamat datang! Silahkan daftar sebagai admin, manajemen, atau tenaga kesehatan.</p>
          </div>

          {/* Card lebih lebar */}
          <div className="rounded-3xl bg-card shadow-xl ring-1 ring-black/5">
            <div className="p-6 md:p-8">
              <StaffRegistrationForm />
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login/staff" className="text-primary hover:text-primary/80 font-medium">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}