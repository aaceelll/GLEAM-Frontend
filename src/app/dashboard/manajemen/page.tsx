import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, MapPin, Users, TrendingUp } from "lucide-react"

export default function ManajemenDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Manajemen</h1>
        <p className="text-muted-foreground">Kelola dan pantau data kesehatan secara keseluruhan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cek Kesehatan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lokasi Aktif</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+3 lokasi baru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Risiko</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">-2% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Keseluruhan</CardTitle>
            <CardDescription>Ringkasan data kesehatan masyarakat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Diabetes Melitus</span>
                <span className="text-sm font-medium">342 kasus</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hipertensi</span>
                <span className="text-sm font-medium">567 kasus</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Obesitas</span>
                <span className="text-sm font-medium">234 kasus</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi Persebaran</CardTitle>
            <CardDescription>Distribusi kasus berdasarkan wilayah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jakarta Pusat</span>
                <span className="text-sm font-medium">156 kasus</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jakarta Selatan</span>
                <span className="text-sm font-medium">234 kasus</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jakarta Timur</span>
                <span className="text-sm font-medium">189 kasus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
