"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { MapSelector } from "./map-selector"

interface LocationSelectorProps {
  kelurahan: string
  rw: string
  latitude?: string
  longitude?: string
  address?: string
  onChange: (field: "kelurahan" | "rw" | "latitude" | "longitude" | "address", value: string) => void
  required?: boolean
  showHeader?: boolean
  showMap?: boolean
}

const RW_DATA = {
  Pedalangan: Array.from({ length: 11 }, (_, i) => `RW ${i + 1}`),
  Padangsari: Array.from({ length: 17 }, (_, i) => `RW ${i + 1}`),
}

export function LocationSelector({ 
  kelurahan, 
  rw, 
  onChange, 
  required = false,
  showHeader = true,
  showMap = true,
  latitude = "",
  longitude = "",
  address = ""
}: LocationSelectorProps) {
  const availableRW = kelurahan === "Pedalangan" || kelurahan === "Padangsari" 
    ? RW_DATA[kelurahan] 
    : []

  useEffect(() => {
    if (kelurahan && !availableRW.includes(rw)) {
      onChange("rw", "")
    }
  }, [kelurahan])

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    onChange("latitude", lat.toString())
    onChange("longitude", lng.toString())
    onChange("address", addr)
  }

  const handleAddressChange = (addr: string) => {
    onChange("address", addr)
  }

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-sm font-medium text-emerald-700">
      {children} {required && <span className="text-red-500">*</span>}
    </Label>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-2 pb-3 border-b-2 border-emerald-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pilih Lokasi Tempat Tinggal</h3>
            <p className="text-sm text-gray-600">Tentukan kelurahan, RW, dan tandai lokasi di peta</p>
          </div>
        </div>
      )}

      {/* Dropdown Kelurahan & RW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kelurahan */}
        <div className="space-y-2">
          <RequiredLabel>Kelurahan</RequiredLabel>
          <Select value={kelurahan} onValueChange={(val) => onChange("kelurahan", val)}>
            <SelectTrigger className="h-12 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
              <SelectValue placeholder="Pilih Kelurahan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pedalangan">Pedalangan</SelectItem>
              <SelectItem value="Padangsari">Padangsari</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* RW */}
        <div className="space-y-2">
          <RequiredLabel>Pilih RW</RequiredLabel>
          <Select 
            value={rw} 
            onValueChange={(val) => onChange("rw", val)}
            disabled={!kelurahan || availableRW.length === 0}
          >
            <SelectTrigger className="h-12 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder={kelurahan ? "Pilih RW" : "Pilih Kelurahan dulu"} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {availableRW.map((rwItem) => (
                <SelectItem key={rwItem} value={rwItem}>
                  {rwItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!kelurahan && (
            <p className="text-xs text-gray-500 mt-1">
              Pilih kelurahan terlebih dahulu
            </p>
          )}
        </div>
      </div>

      {/* Peta + Input Alamat */}
      {showMap && kelurahan && (
        <MapSelector
          kelurahan={kelurahan}
          address={address}
          onLocationSelect={handleLocationSelect}
          onAddressChange={handleAddressChange}
        />
      )}
    </div>
  )
}