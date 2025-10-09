"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"

interface PersonalInfoFormProps {
  onComplete: () => void
  initialData?: any
  isEditMode?: boolean
}

export function PersonalInfoForm({ 
  onComplete, 
  initialData = null,
  isEditMode = false 
}: PersonalInfoFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    nama: initialData?.nama || "",
    tempat_lahir: initialData?.tempat_lahir || "",
    tanggal_lahir: initialData?.tanggal_lahir?.split('T')[0] || "",
    umur: initialData?.umur?.toString() || "",
    jenis_kelamin: initialData?.jenis_kelamin || "",
    pekerjaan: initialData?.pekerjaan || "",
    pendidikan_terakhir: initialData?.pendidikan_terakhir || "",
    riwayat_kesehatan: initialData?.riwayat_kesehatan || "",
    riwayat_pelayanan_kesehatan: initialData?.riwayat_pelayanan_kesehatan || "",
    riwayat_merokok: initialData?.riwayat_merokok || "",
    berat_badan: initialData?.berat_badan?.toString() || "",
    tinggi_badan: initialData?.tinggi_badan?.toString() || "",
    indeks_bmi: initialData?.indeks_bmi?.toString() || "",
    riwayat_penyakit_jantung: initialData?.riwayat_penyakit_jantung || "",
    durasi_diagnosis: initialData?.durasi_diagnosis || "",
    lama_terdiagnosis: initialData?.lama_terdiagnosis || "",
    berobat_ke_dokter: initialData?.berobat_ke_dokter || "",
    sudah_berobat: initialData?.sudah_berobat || "",
  })

  // Update form jika initialData berubah
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData?.nama || "",
        tempat_lahir: initialData?.tempat_lahir || "",
        tanggal_lahir: initialData?.tanggal_lahir?.split('T')[0] || "",
        umur: initialData?.umur?.toString() || "",
        jenis_kelamin: initialData?.jenis_kelamin || "",
        pekerjaan: initialData?.pekerjaan || "",
        pendidikan_terakhir: initialData?.pendidikan_terakhir || "",
        riwayat_kesehatan: initialData?.riwayat_kesehatan || "",
        riwayat_pelayanan_kesehatan: initialData?.riwayat_pelayanan_kesehatan || "",
        riwayat_merokok: initialData?.riwayat_merokok || "",
        berat_badan: initialData?.berat_badan?.toString() || "",
        tinggi_badan: initialData?.tinggi_badan?.toString() || "",
        indeks_bmi: initialData?.indeks_bmi?.toString() || "",
        riwayat_penyakit_jantung: initialData?.riwayat_penyakit_jantung || "",
        durasi_diagnosis: initialData?.durasi_diagnosis || "",
        lama_terdiagnosis: initialData?.lama_terdiagnosis || "",
        berobat_ke_dokter: initialData?.berobat_ke_dokter || "",
        sudah_berobat: initialData?.sudah_berobat || "",
      })
    }
  }, [initialData])

  // Auto-calculate age from birth date
  React.useEffect(() => {
    if (formData.tanggal_lahir) {
      const birthDate = new Date(formData.tanggal_lahir)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      setFormData((prev) => ({ ...prev, umur: age.toString() }))
    }
  }, [formData.tanggal_lahir])

  // Auto-calculate BMI
  React.useEffect(() => {
    const bb = parseFloat(formData.berat_badan)
    const tb = parseFloat(formData.tinggi_badan)

    if (bb > 0 && tb > 0) {
      const tinggiMeter = tb / 100
      const bmi = bb / (tinggiMeter * tinggiMeter)
      setFormData((prev) => ({
        ...prev,
        indeks_bmi: bmi.toFixed(2),
      }))
    } else {
      setFormData((prev) => ({ ...prev, indeks_bmi: "" }))
    }
  }, [formData.berat_badan, formData.tinggi_badan])

  const onChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // Format tanggal lahir ke format yyyy-MM-dd
      const tanggalLahir = formData.tanggal_lahir 
        ? formData.tanggal_lahir.split('T')[0]
        : null

      await api.put("/profile", {
        ...formData,
        tanggal_lahir: tanggalLahir,
        umur: formData.umur ? parseInt(formData.umur) : null,
        berat_badan: formData.berat_badan ? parseFloat(formData.berat_badan) : null,
        tinggi_badan: formData.tinggi_badan ? parseFloat(formData.tinggi_badan) : null,
        indeks_bmi: formData.indeks_bmi ? parseFloat(formData.indeks_bmi) : null,
      })

      setSuccess(true)
      
      if (isEditMode) {
        setTimeout(() => setSuccess(false), 3000)
      } else {
        onComplete()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
          Data berhasil disimpan!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 auto-rows-min">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label htmlFor="nama" className="text-emerald-700 font-semibold">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => onChange("nama", e.target.value)}
            placeholder="Nama Anda"
            className="w-full border-emerald-200 focus:border-emerald-500"
            required
          />
        </div>

        {/* Pekerjaan */}
        <div className="space-y-2">
          <Label htmlFor="pekerjaan" className="text-emerald-700 font-semibold">
            Pekerjaan
          </Label>
          <Input
            id="pekerjaan"
            value={formData.pekerjaan}
            onChange={(e) => onChange("pekerjaan", e.target.value)}
            placeholder="Pekerjaan Anda"
            className="w-full border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Tempat Lahir */}
        <div className="space-y-2">
          <Label htmlFor="tempat_lahir" className="text-emerald-700 font-semibold">
            Tempat Lahir
          </Label>
          <Input
            id="tempat_lahir"
            value={formData.tempat_lahir}
            onChange={(e) => onChange("tempat_lahir", e.target.value)}
            placeholder="semarang"
            className="w-full border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Tanggal Lahir */}
        <div className="space-y-2">
          <Label htmlFor="tanggal_lahir" className="text-emerald-700 font-semibold">
            Tanggal Lahir
          </Label>
          <Input
            id="tanggal_lahir"
            type="date"
            value={formData.tanggal_lahir}
            onChange={(e) => onChange("tanggal_lahir", e.target.value)}
            className="w-full border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Umur (Auto-calculated) */}
        <div className="space-y-2">
          <Label htmlFor="umur" className="text-emerald-700 font-semibold">
            Umur <span className="text-red-500">*</span>
          </Label>
          <Input
            id="umur"
            type="number"
            value={formData.umur}
            onChange={(e) => onChange("umur", e.target.value)}
            placeholder="Umur Anda"
            className="w-full border-emerald-200 focus:border-emerald-500"
            readOnly
          />
          <p className="text-xs text-gray-500">
            * Umur otomatis terisi ketika mengisi tanggal lahir
          </p>
        </div>

        {/* Jenis Kelamin */}
        <div className="space-y-2">
          <Label className="text-emerald-700 font-semibold">
            Jenis Kelamin
          </Label>
          <Select
            value={formData.jenis_kelamin}
            onValueChange={(value) => onChange("jenis_kelamin", value)}
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pendidikan Terakhir */}
        <div className="space-y-2">
          <Label className="text-emerald-700 font-semibold">
            Pendidikan Terakhir <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.pendidikan_terakhir}
            onValueChange={(value) => onChange("pendidikan_terakhir", value)}
            required
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih pendidikan terakhir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="SMP">SMP</SelectItem>
              <SelectItem value="SMA / SMK">SMA / SMK</SelectItem>
              <SelectItem value="D1">D1</SelectItem>
              <SelectItem value="D2">D2</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
              <SelectItem value="S3">S3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Riwayat Pelayanan Kesehatan */}
        <div className="space-y-2">
          <Label htmlFor="riwayat_kesehatan" className="text-emerald-700 font-semibold">
            Riwayat tempat pelayanan kesehatan sebelumnya
          </Label>
          <Input
            id="riwayat_kesehatan"
            value={formData.riwayat_kesehatan}
            onChange={(e) => onChange("riwayat_kesehatan", e.target.value)}
            placeholder="puskesmas"
            className="w-full border-emerald-200 focus:border-emerald-500"
          />
        </div>

        {/* Riwayat Merokok */}
        <div className="space-y-2">
          <Label className="text-emerald-700 font-semibold">
            Riwayat Merokok <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.riwayat_merokok}
            onValueChange={(value) => onChange("riwayat_merokok", value)}
            required
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih riwayat merokok" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tidak Pernah Merokok">Tidak Pernah Merokok</SelectItem>
              <SelectItem value="Mantan Perokok">Mantan Perokok</SelectItem>
              <SelectItem value="Perokok Aktif">Perokok Aktif</SelectItem>
              <SelectItem value="Tidak Ada Informasi">Tidak Ada Informasi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Berat Badan */}
        <div className="space-y-2">
          <Label htmlFor="berat_badan" className="text-emerald-700 font-semibold">
            Berat Badan (kg) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="berat_badan"
            type="number"
            step="0.01"
            value={formData.berat_badan}
            onChange={(e) => onChange("berat_badan", e.target.value)}
            placeholder="50"
            className="w-full border-emerald-200 focus:border-emerald-500"
            required
          />
        </div>

        {/* Tinggi Badan */}
        <div className="space-y-2">
          <Label htmlFor="tinggi_badan" className="text-emerald-700 font-semibold">
            Tinggi Badan (cm) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tinggi_badan"
            type="number"
            step="0.01"
            value={formData.tinggi_badan}
            onChange={(e) => onChange("tinggi_badan", e.target.value)}
            placeholder="155"
            className="w-full border-emerald-200 focus:border-emerald-500"
            required
          />
        </div>

        {/* Indeks BMI (Auto-calculated) */}
        <div className="space-y-2">
          <Label htmlFor="indeks_bmi" className="text-emerald-700 font-semibold">
            Indeks BMI <span className="text-red-500">*</span>
          </Label>
          <Input
            id="indeks_bmi"
            value={formData.indeks_bmi}
            readOnly
            className="w-full border-emerald-200 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500">
            * BMI dihitung otomatis berdasarkan berat & tinggi badan
          </p>
        </div>

        {/* Riwayat Penyakit Jantung */}
        <div className="space-y-2">
          <Label className="text-emerald-700 font-semibold">
            Riwayat Penyakit Jantung <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.riwayat_penyakit_jantung}
            onValueChange={(value) => onChange("riwayat_penyakit_jantung", value)}
            required
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih riwayat penyakit jantung" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tidak">Tidak</SelectItem>
              <SelectItem value="Ya">Ya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Durasi Diagnosis */}
        <div className="space-y-2">
          <Label className="text-emerald-700 font-semibold">
            Berapa lama anda telah terdiagnosis Diabetes Melitus atau Hipertensi?
          </Label>
          <Select
            value={formData.durasi_diagnosis}
            onValueChange={(value) => onChange("durasi_diagnosis", value)}
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih durasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="< 1 Tahun">&lt; 1 Tahun</SelectItem>
              <SelectItem value="1-2 Tahun">1-2 Tahun</SelectItem>
              <SelectItem value="2-5 Tahun">2-5 Tahun</SelectItem>
              <SelectItem value="> 5 Tahun">&gt; 5 Tahun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Berobat ke Dokter */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-emerald-700 font-semibold">
            Apakah anda sudah berobat ke dokter?
          </Label>
          <Select
            value={formData.berobat_ke_dokter}
            onValueChange={(value) => onChange("berobat_ke_dokter", value)}
          >
            <SelectTrigger className="w-full border-emerald-200 focus:border-emerald-500">
              <SelectValue placeholder="Pilih jawaban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sudah">Sudah</SelectItem>
              <SelectItem value="Belum">Belum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-emerald-100">
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  )
}