"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Import Leaflet secara dinamis
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapLoading /> }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface MapSelectorProps {
  kelurahan: string
  address: string
  onLocationSelect?: (lat: number, lng: number, address: string) => void
  onAddressChange?: (address: string) => void
}

const KELURAHAN_CENTERS = {
  Pedalangan: { lat: -7.0400, lng: 110.4100 },
  Padangsari: { lat: -7.0400, lng: 110.4310 },
  Default: { lat: -7.0400, lng: 110.4200 },
} as const

function MapLoading() {
  return (
    <div className="h-[450px] bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-200">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-emerald-700 font-medium">Memuat peta...</p>
      </div>
    </div>
  )
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const { useMapEvents } = require("react-leaflet")
  
  const map = useMapEvents({
    click: (e: any) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  
  return null
}

// ✅ CUSTOM MARKER ICON - Pakai DivIcon
function CustomMarker({ position }: { position: [number, number] }) {
  const [L, setL] = useState<any>(null)
  const [customIcon, setCustomIcon] = useState<any>(null)

  useEffect(() => {
    // Load Leaflet di client-side
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      
      // ✅ Buat Custom Icon dengan DivIcon
      const icon = leaflet.default.divIcon({
        html: `
          <div style="position: relative; width: 40px; height: 40px;">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="#10b981" 
              stroke="#ffffff" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="#ffffff"/>
            </svg>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })
      
      setCustomIcon(icon)
    })
  }, [])

  if (!L || !customIcon) return null

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div className="text-center p-1">
          <p className="font-semibold text-emerald-700">Lokasi Anda</p>
          <p className="text-xs text-gray-600">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export function MapSelector({ kelurahan, address, onLocationSelect, onAddressChange }: MapSelectorProps) {
  const [mounted, setMounted] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geoJsonData, setGeoJsonData] = useState<any>(null)
  const [loadingGeo, setLoadingGeo] = useState(false)
  
  const mapInitialized = useRef(false)

  useEffect(() => {
    if (!mapInitialized.current) {
      setMounted(true)
      mapInitialized.current = true
    }
  }, [])

  // ✅ Load GeoJSON saat kelurahan dipilih
  useEffect(() => {
    if (kelurahan && mounted) {
      setLoadingGeo(true)
      
      // Langsung pakai banyumanik.geojson untuk semua kelurahan
      fetch('/data/banyumanik.geojson')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('✅ GeoJSON loaded successfully for', kelurahan)
          setGeoJsonData(data)
        })
        .catch(err => {
          console.error('❌ Failed to load GeoJSON:', err.message)
          setGeoJsonData(null) // Tetap tampilkan peta tanpa boundary
        })
        .finally(() => {
          setLoadingGeo(false)
        })
    }
  }, [kelurahan, mounted])

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setIsGeocoding(true)
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const fetchedAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      
      if (onLocationSelect) {
        onLocationSelect(lat, lng, fetchedAddress)
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      if (onLocationSelect) {
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }
    } finally {
      setIsGeocoding(false)
    }
  }

  if (!mounted) {
    return <MapLoading />
  }

  const center = kelurahan && kelurahan in KELURAHAN_CENTERS
    ? KELURAHAN_CENTERS[kelurahan as keyof typeof KELURAHAN_CENTERS]
    : KELURAHAN_CENTERS.Default

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-lg relative">
        {loadingGeo && (
          <div className="absolute inset-0 bg-emerald-50/80 z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        )}
        
        <MapContainer
          key={kelurahan || 'default'} 
          center={[center.lat, center.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "450px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render GeoJSON */}
          {geoJsonData && (
            <GeoJSON
              key={kelurahan}
              data={geoJsonData}
              style={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.25,
                weight: 4,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}

          {/* ✅ CUSTOM MARKER dengan Icon Lokasi */}
          {markerPosition && <CustomMarker position={markerPosition} />}

          <MapClickHandler onLocationSelect={handleMapClick} />
        </MapContainer>
      </div>

      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
        <p className="text-sm text-emerald-800 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Tips:</strong> Klik pada peta untuk menandai lokasi rumah Anda. 
            Area berwarna hijau menunjukkan batas kelurahan <strong>{kelurahan || "yang dipilih"}</strong>.
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-emerald-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Alamat Lengkap
        </Label>
        <Input
          value={address}
          onChange={(e) => onAddressChange?.(e.target.value)}
          placeholder="Contoh: Jl. Kenanga Barat No. 5 RT 02 RW 03, Kel. Pedalangan"
          className="h-12 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
          disabled={isGeocoding}
        />
        {isGeocoding && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Mengambil alamat dari koordinat...
          </p>
        )}
        <p className="text-xs text-gray-500">
          Alamat akan terisi otomatis saat Anda klik peta, atau Anda bisa ketik manual.
        </p>
      </div>

      {markerPosition && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900 mb-1">Lokasi Terpilih:</p>
              <p className="text-xs text-emerald-800">
                <strong>Koordinat:</strong> {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}