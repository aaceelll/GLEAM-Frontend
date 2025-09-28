import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, MessageSquare, BarChart3, Plus } from "lucide-react"

export default function NakesDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Tenaga Kesehatan</h1>
        <p className="text-muted-foreground">Kelola pemeriksaan kesehatan dan konsultasi pasien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemeriksaan Hari Ini</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 dari kemarin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pertanyaan Private</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Menunggu jawaban</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Cek Kesehatan</CardTitle>
            <CardDescription>Tambah hasil pemeriksaan kesehatan pasien</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pemeriksaan Baru
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Terbaru</CardTitle>
            <CardDescription>Pertanyaan private dari pasien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Pasien A</p>
                <p className="text-sm text-muted-foreground">Bagaimana cara mengontrol gula darah?</p>
                <p className="text-xs text-muted-foreground mt-1">2 jam lalu</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Pasien B</p>
                <p className="text-sm text-muted-foreground">Apakah obat ini aman untuk ibu hamil?</p>
                <p className="text-xs text-muted-foreground mt-1">4 jam lalu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
