// src/components/forms/user-registration-form.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import type { RegisterFormData } from "@/types";
import Link from "next/link";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export function UserRegistrationForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    username: undefined,
    phone: "",
    date_of_birth: "",
    gender: "" as any,
    address: "",
    password: "",
    password_confirmation: "",
  });

  const onChange = (k: keyof RegisterFormData, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = [
      "name","email","phone","date_of_birth","gender","address",
      "password","password_confirmation",
    ] as const;

    for (const k of required) {
      // @ts-ignore
      if (!form[k]) return alert("Semua field wajib diisi.");
    }
    if (form.password !== form.password_confirmation) {
      return alert("Password dan konfirmasi tidak sama.");
    }

    try {
      setLoading(true);
      await register(form);
      alert("Registrasi berhasil. Silakan login.");
      router.push("/login/user");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Registrasi gagal. Coba lagi ya.";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-sm font-medium">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <Card className="border-0 shadow-xl ring-1 ring-black/5 rounded-2xl">
      {/* Header rapat */}
      <CardHeader className="text-center pb-1">
        <CardTitle className="text-2xl">Daftar Akun</CardTitle>
        <CardDescription className="text-sm">
          Lengkapi data di bawah untuk membuat akun baru
        </CardDescription>
      </CardHeader>

      {/* Konten rapat + kontrol konsisten */}
      <CardContent className="px-7 pt-2 pb-3">
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <RequiredLabel>Nama</RequiredLabel>
            <Input className="h-11 rounded-xl" value={form.name}
              onChange={(e) => onChange("name", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Email</RequiredLabel>
            <Input type="email" className="h-11 rounded-xl" value={form.email}
              onChange={(e) => onChange("email", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Nomor Telepon</RequiredLabel>
            <Input className="h-11 rounded-xl" value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Tanggal Lahir</RequiredLabel>
            <Input type="date" className="h-11 rounded-xl" value={form.date_of_birth}
              onChange={(e) => onChange("date_of_birth", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Jenis Kelamin</RequiredLabel>
            <Select value={form.gender} onValueChange={(v) => onChange("gender", v)}>
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <RequiredLabel>Alamat</RequiredLabel>
            <Input className="h-11 rounded-xl" value={form.address}
              onChange={(e) => onChange("address", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Password</RequiredLabel>
            <Input type="password" className="h-11 rounded-xl" value={form.password}
              onChange={(e) => onChange("password", e.target.value)} required />
          </div>

          <div>
            <RequiredLabel>Konfirmasi Password</RequiredLabel>
            <Input type="password" className="h-11 rounded-xl" value={form.password_confirmation}
              onChange={(e) => onChange("password_confirmation", e.target.value)} required />
          </div>

          {/* Button */}
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>
      </CardContent>

      {/* Footer */}
      <CardFooter className="justify-center pt-0 pb-5">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login/user" className="font-medium text-primary hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
