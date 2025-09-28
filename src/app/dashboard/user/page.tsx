// app/dashboard/user/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, Calendar, Heart } from "lucide-react"

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Pasien</h1>
        <p className="text-muted-foreground">
          Selamat datang di GLEAM - Monitor kesehatan diabetes Anda
        </p>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Glukosa Terakhir</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 mg/dL</div>
            <p className="text-xs text-green-600">Normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata 7 Hari</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">118 mg/dL</div>
            <p className="text-xs text-green-600">Terkendali</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cek Terakhir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 jam</div>
            <p className="text-xs text-muted-foreground">yang lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Monitoring Kesehatan
            </CardTitle>
            <CardDescription>
              Pantau kondisi diabetes Anda secara real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Input Glukosa Darah
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Catat Aktivitas Harian
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Lihat Grafik Kesehatan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edukasi & Komunitas</CardTitle>
            <CardDescription>
              Pelajari lebih lanjut tentang diabetes dan bergabung dengan komunitas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Materi Edukasi Diabetes
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Forum Komunitas
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              Tips & Artikel Kesehatan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Terbaru</CardTitle>
          <CardDescription>Aktivitas monitoring kesehatan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">Glukosa darah: 120 mg/dL</p>
              <p className="text-xs text-muted-foreground">Hari ini, 14:30</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">Membaca artikel: Tips Diet Diabetes</p>
              <p className="text-xs text-muted-foreground">Kemarin, 19:45</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">Bergabung di forum komunitas</p>
              <p className="text-xs text-muted-foreground">2 hari yang lalu</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
