"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PersonalInfoForm } from "@/components/forms/personal-info-form"

export default function PersonalInfoPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/dashboard/user")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-emerald-700 mb-2">
              Lengkapi Informasi Pribadi
            </h1>
            <p className="text-gray-600">
              Mohon lengkapi informasi berikut untuk melanjutkan
            </p>
          </div>
          <PersonalInfoForm onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}