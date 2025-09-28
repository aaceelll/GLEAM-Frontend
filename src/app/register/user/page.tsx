import { GleamLogo } from "@/components/gleam-logo"
import { UserRegistrationForm } from "@/components/forms/user-registration-form"
import Link from "next/link"

export default function UserRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 flex flex-col">
      {/* Header konsisten */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <UserRegistrationForm />

          {/* Link ke login
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login/user" className="text-primary hover:underline font-medium">
                Masuk Sekarang
              </Link>
            </p> */}
          {/* </div> */}
        </div>
      </main>
    </div>
  )
}
