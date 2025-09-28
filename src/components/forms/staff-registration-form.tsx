"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

export function StaffRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    username: "",
    nomorTelepon: "",
    role: "",
    password: "",
    konfirmasiPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Staff registration data:", formData)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-sm font-medium">
              Nama
            </Label>
            <Input
              id="nama"
              type="text"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-2">
            <Label htmlFor="nomorTelepon" className="text-sm font-medium">
              Nomor Telepon
            </Label>
            <Input
              id="nomorTelepon"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={formData.nomorTelepon}
              onChange={(e) => handleInputChange("nomorTelepon", e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Pilih jenis role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manajemen">Manajemen</SelectItem>
                <SelectItem value="nakes">Tenaga Kesehatan (Nakes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-12 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="konfirmasiPassword" className="text-sm font-medium">
              Konfirmasi Password
            </Label>
            <div className="relative">
              <Input
                id="konfirmasiPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan konfirmasi password"
                value={formData.konfirmasiPassword}
                onChange={(e) => handleInputChange("konfirmasiPassword", e.target.value)}
                className="h-12 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Daftar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
