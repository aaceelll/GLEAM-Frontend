"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function StaffLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setError(null);
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({ email: form.email, password: form.password });

      // Auto route by role
      const role = user.role as string;
      if (role === "super_admin" || role === "admin") router.replace("/dashboard/admin");
      else if (role === "manajemen") router.replace("/dashboard/manajemen");
      else if (role === "nakes") router.replace("/dashboard/nakes");
      else router.replace("/dashboard/user");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Login gagal. Periksa email/password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <h1 className="text-2xl font-bold">Masuk Staff/Petugas</h1>
        <p className="text-muted-foreground text-sm">
          Masuk sebagai admin, manajemen, atau tenaga kesehatan.
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username (pakai email untuk auth) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Username atau Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Masukkan username/email"
              value={form.email}
              onChange={handleChange("email")}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange("password")}
                className="h-12 pr-12 rounded-xl"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </Button>

          {/* Register link dihapus kalau memang staff tidak daftar sendiri */}
          <p className="text-center text-sm text-muted-foreground">
            Lupa password?{" "}
            <Link href="/forgot-password" className="text-primary hover:text-primary/80 font-medium">
              Reset di sini
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
