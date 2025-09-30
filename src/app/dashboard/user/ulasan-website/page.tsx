"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const questions = [
  { id: 'q1', text: 'Saya ingin menggunakan website ini secara rutin.' },
  { id: 'q2', text: 'Website ini terasa tidak perlu rumit.' },
  { id: 'q3', text: 'Website ini mudah digunakan.' },
  { id: 'q4', text: 'Saya merasa membutuhkan bantuan teknis untuk bisa menggunakan website ini.' },
  { id: 'q5', text: 'Fitur-fitur pada website ini terintegrasi dengan baik.' },
  { id: 'q6', text: 'Website ini terasa tidak konsisten.' },
  { id: 'q7', text: 'Saya yakin orang lain dapat belajar menggunakan website ini dengan cepat.' },
  { id: 'q8', text: 'Website ini terasa membingungkan atau canggung.' },
  { id: 'q9', text: 'Saya percaya diri menggunakan website ini.' },
  { id: 'q10', text: 'Saya perlu mempelajari banyak hal sebelum dapat menggunakan website ini.' },
];

const options = [
  { value: '1', label: 'Sangat Tidak Setuju' },
  { value: '2', label: 'Tidak Setuju' },
  { value: '3', label: 'Netral' },
  { value: '4', label: 'Setuju' },
  { value: '5', label: 'Sangat Setuju' },
];

export default function UlasanWebsitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestion, setSuggestion] = useState('');
  const [progress, setProgress] = useState(0);

  // Load existing review jika ada
  useEffect(() => {
    const loadReview = async () => {
      try {
        const res = await api.get('/website-review');
        if (res.data.data) {
          const review = res.data.data;
          const loadedAnswers: Record<string, string> = {};
          questions.forEach(q => {
            if (review[q.id]) loadedAnswers[q.id] = String(review[q.id]);
          });
          setAnswers(loadedAnswers);
          setSuggestion(review.suggestion || '');
        }
      } catch (error) {
        console.error('Error loading review:', error);
      }
    };
    loadReview();
  }, []);

  // Update progress
  useEffect(() => {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    setProgress(Math.round((answered / total) * 100));
  }, [answers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { suggestion };
      questions.forEach(q => {
        payload[q.id] = answers[q.id] ? parseInt(answers[q.id]) : null;
      });

      await api.post('/website-review', payload);
      
      // ✅ PAKAI ALERT
      alert("✅ Berhasil! Ulasan Anda telah tersimpan. Terima kasih atas feedback-nya! 🎉");
      
      router.push('/dashboard/user');
    } catch (error: any) {
      // ✅ PAKAI ALERT
      alert("❌ Gagal menyimpan: " + (error.response?.data?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">
            Ulasan Website
          </h1>
          <p className="text-lg text-gray-600">
            Silakan berikan ulasan Anda terhadap website ini. Jawaban Anda akan membantu kami untuk meningkatkan kualitas layanan.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 border-emerald-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-700">Progress</span>
              <span className="text-sm font-bold text-emerald-800">{progress}%</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-emerald-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle>Form Ulasan</CardTitle>
              <p className="text-emerald-50 text-sm mt-1">
                Isi semua pertanyaan berikut dan berikan saran Anda
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-4 pb-6 border-b border-emerald-100 last:border-0">
                  <Label className="text-base font-semibold text-gray-800 leading-relaxed">
                    {index + 1}. {question.text}
                  </Label>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3"
                  >
                    {options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.value}
                          id={`${question.id}-${option.value}`}
                          className="border-emerald-500 text-emerald-600"
                        />
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          className="text-sm cursor-pointer hover:text-emerald-600 transition-colors"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              {/* Kotak Saran */}
              <div className="space-y-3 pt-4">
                <Label className="text-base font-semibold text-gray-800">
                  Kotak Saran
                </Label>
                <Textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Berikan saran untuk website ini..."
                  className="min-h-[150px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Menyimpan..." : "Kirim Ulasan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}