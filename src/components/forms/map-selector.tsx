"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  rw?: string
  latitude?: string
  longitude?: string
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
  useMapEvents({
    click: (e: any) => onLocationSelect?.(e.latlng.lat, e.latlng.lng),
  })
  return null
}

function ZoomToGeoJSON({ geoJsonData }: { geoJsonData: any }) {
  const [L, setL] = useState<any>(null)
  useEffect(() => { import("leaflet").then((leaflet) => setL(leaflet.default)) }, [])
  if (!L) return null
  return <ZoomToGeoJSONInner geoJsonData={geoJsonData} L={L} />
}

function ZoomToGeoJSONInner({ geoJsonData, L }: { geoJsonData: any; L: any }) {
  const { useMap } = require("react-leaflet")
  const map = useMap()
  useEffect(() => {
    if (!geoJsonData || !L || !map) return
    try {
      const geoLayer = L.geoJSON(geoJsonData)
      const bounds = geoLayer.getBounds()
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 17, duration: 0.6, easeLinearity: 0.2 })
      }
    } catch (e) {
      console.error("Error zooming to GeoJSON:", e)
    }
  }, [geoJsonData, L, map])
  return null
}

function CustomMarker({ position }: { position: [number, number] }) {
  const [L, setL] = useState<any>(null)
  const [customIcon, setCustomIcon] = useState<any>(null)
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      const icon = leaflet.default.divIcon({
        html: `
          <div style="position: relative; width: 40px; height: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                 fill="#10b981" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="filter: drop-shadow(0 4px 6px rgba(0,0,0,.3));">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="#ffffff"/>
            </svg>
          </div>
        `,
        className: "custom-marker",
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
          <p className="text-xs text-gray-600">{position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  )
}

function getGeoJsonPath(kelurahan: string, rw?: string): string {
  if (rw && kelurahan) {
    const rwNumber = rw.toLowerCase().replace("rw ", "rw-").replace(" ", "-")
    const kelurahanLower = kelurahan.toLowerCase()
    return `/data/${kelurahanLower}-${rwNumber}.geojson`
  }
  if (kelurahan) {
    const kelurahanLower = kelurahan.toLowerCase()
    return `/data/${kelurahanLower}.geojson`
  }
  return "/data/banyumanik.geojson"
}

export function MapSelector({
  kelurahan,
  rw,
  latitude,
  longitude,
  address,
  onLocationSelect,
  onAddressChange,
}: MapSelectorProps) {
  const [mounted, setMounted] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geoJsonData, setGeoJsonData] = useState<any>(null)
  const [loadingGeo, setLoadingGeo] = useState(false)

  const mapInitialized = useRef(false)
  const previousRW = useRef<string>("")

  // 🛡️ Anti-race: request ID + AbortController + cache
  const requestIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    if (!mapInitialized.current) {
      setMounted(true)
      mapInitialized.current = true
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Batalkan request lama (kalau masih berjalan)
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    requestIdRef.current += 1
    const currentId = requestIdRef.current
    const signal = abortRef.current.signal

    const targetPath = getGeoJsonPath(kelurahan, rw)
    const kelurahanPath = getGeoJsonPath(kelurahan)

    // ✅ Penting: kosongkan layer lama supaya tidak sempat tampil
    setGeoJsonData(null)
    setLoadingGeo(true)

    const useData = (data: any) => {
      if (currentId !== requestIdRef.current) return // sudah kadaluarsa
      setGeoJsonData(data)
      setLoadingGeo(false)
    }

    // Cache hit
    if (cacheRef.current.has(targetPath)) {
      useData(cacheRef.current.get(targetPath))
      return
    }

    // Fetch utama
    fetch(targetPath, { signal })
      .then(async (res) => {
        if (!res.ok) {
          // Fallback ke level Kelurahan jika RW tidak ditemukan
          if (rw && res.status === 404 && kelurahan) {
            if (cacheRef.current.has(kelurahanPath)) {
              useData(cacheRef.current.get(kelurahanPath))
              return
            }
            const resKel = await fetch(kelurahanPath, { signal })
            if (!resKel.ok) throw new Error("Kelurahan fallback not found")
            const dataKel = await resKel.json()
            cacheRef.current.set(kelurahanPath, dataKel)
            useData(dataKel)
            return
          }
          throw new Error(`Fetch failed: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        cacheRef.current.set(targetPath, data)
        useData(data)
      })
      .catch(async (err) => {
        if (err?.name === "AbortError") return
        if (currentId !== requestIdRef.current) return

        // Fallback terakhir: Banyumanik
        const fallback = "/data/banyumanik.geojson"
        try {
          if (cacheRef.current.has(fallback)) {
            useData(cacheRef.current.get(fallback))
            return
          }
          const res = await fetch(fallback, { signal })
          if (!res.ok) throw new Error("Fallback Banyumanik not found")
          const data = await res.json()
          cacheRef.current.set(fallback, data)
          useData(data)
        } catch {
          if (currentId === requestIdRef.current) setLoadingGeo(false)
        }
      })

    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [kelurahan, rw, mounted])

  // Clear marker ketika RW berubah
  useEffect(() => {
    if (previousRW.current && previousRW.current !== rw) {
      setMarkerPosition(null)
    }
    previousRW.current = rw || ""
  }, [rw])

  // Set marker jika ada koordinat
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition([lat, lng])
      }
    } else {
      setMarkerPosition(null)
    }
  }, [latitude, longitude])

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "id" } }
      )
      const data = await response.json()
      const fetchedAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      onLocationSelect?.(lat, lng, fetchedAddress)
    } catch {
      onLocationSelect?.(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setIsGeocoding(false)
    }
  }

  if (!mounted) return <MapLoading />

  const center = kelurahan && kelurahan in KELURAHAN_CENTERS
    ? KELURAHAN_CENTERS[kelurahan as keyof typeof KELURAHAN_CENTERS]
    : KELURAHAN_CENTERS.Default

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-lg relative">
        {loadingGeo && (
          <div className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          </div>
        )}

        <MapContainer
          // tetap: jangan tergantung RW agar tidak remount saat ganti RW
          key={`map-${kelurahan || "default"}`}
          center={[center.lat, center.lng]}
          zoom={13}
          scrollWheelZoom
          style={{ height: "450px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geoJsonData && (
            <>
              <GeoJSON
                // ✅ paksa remount layer tiap request agar layer lama tak tersisa
                key={`geojson-${kelurahan}-${rw || "no-rw"}-${requestIdRef.current}`}
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
              <ZoomToGeoJSON geoJsonData={geoJsonData} />
            </>
          )}

          {markerPosition && <CustomMarker position={markerPosition} />}
          <MapClickHandler onLocationSelect={handleMapClick} />
        </MapContainer>
      </div>

      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
        <p className="text-sm text-emerald-800 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Tips:</strong> Klik pada peta untuk menandai lokasi rumah Anda.
            {rw ? (
              <span className="block mt-1">
                Area dengan <strong className="text-emerald-700">garis hijau</strong> menunjukkan batas wilayah <strong>{rw}</strong> di kelurahan <strong>{kelurahan}</strong>.
              </span>
            ) : kelurahan ? (
              <span className="block mt-1">
                Area dengan <strong className="text-emerald-700">garis hijau</strong> menunjukkan batas kelurahan <strong>{kelurahan}</strong>.
              </span>
            ) : (
              <span className="block mt-1">
                Area dengan <strong className="text-emerald-700">garis hijau</strong> menunjukkan wilayah Banyumanik.
              </span>
            )}
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
    </div>
  )
}
