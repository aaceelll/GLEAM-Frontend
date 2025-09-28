import { GleamLogo } from "@/components/gleam-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <GleamLogo size="md" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Platform Monitoring Kesehatan
            <span className="text-primary"> Diabetes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            GLEAM menyediakan solusi terintegrasi untuk monitoring glukosa, pembelajaran, edukasi, dan pemantauan
            kesehatan diabetes melitus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/register/user">Daftar Sebagai Pasien</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register/staff">Daftar Sebagai Staff/Petugas</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded-full"></div>
              </div>
              <CardTitle className="text-lg">Monitoring Glukosa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Pantau kadar glukosa darah secara real-time dengan teknologi terdepan</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </div>
              <CardTitle className="text-lg">Edukasi Diabetes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Akses materi pembelajaran dan edukasi tentang pengelolaan diabetes</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <CardTitle className="text-lg">Forum Komunitas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Bergabung dengan komunitas untuk berbagi pengalaman dan dukungan</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-amber-500 rounded-full"></div>
              </div>
              <CardTitle className="text-lg">Laporan Kesehatan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Dapatkan laporan kesehatan komprehensif dan rekomendasi medis</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Sudah memiliki akun?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="ghost">
              <Link href="/login/user">Masuk Sebagai Pasien</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/login/staff">Masuk Sebagai Staff/Petugas</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
