import { GleamLogo } from "@/components/gleam-logo";
import { UserLoginForm } from "@/components/forms/user-login-form";

export default function UserLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <UserLoginForm />
        </div>
      </main>
    </div>
  );
}
