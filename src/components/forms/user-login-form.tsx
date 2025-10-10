"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface LoginData {
  login: string;
  password: string;
}

export const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState<LoginData>({ login: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.login.trim()) {
      newErrors.login = "Email atau Username wajib diisi";
    }
    
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    }
    
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      router.replace("/dashboard/user");
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        "Login gagal";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 md:p-7 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Masuk</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Selamat datang kembali! Silahkan masuk ke akun anda.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email atau Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="login"
          value={formData.login}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.login
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-green-500 focus:border-green-500"
          }`}
          placeholder="Masukkan email atau username"
        />
        {errors.login && <p className="mt-1 text-sm text-red-600">{errors.login}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.password
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            }`}
            placeholder="Masukkan password anda"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
            Lupa password?
          </Link>
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register/user" className="font-medium text-primary hover:underline">
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
};