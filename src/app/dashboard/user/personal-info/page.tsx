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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-10 border border-gray-100">
          <div className="mb-8">
            <div className="inline-block mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Lengkapi Informasi Pribadi
            </h1>
            <p className="text-gray-500 text-lg">
              Mohon lengkapi informasi berikut untuk melanjutkan
            </p>
          </div>
          <PersonalInfoForm onComplete={handleComplete} />
        </div>
      </div>
    </div>
  )
}