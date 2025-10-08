"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Star, Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";

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
  { value: '1', label: 'STS' },
  { value: '2', label: 'TS' },
  { value: '3', label: 'N' },
  { value: '4', label: 'S' },
  { value: '5', label: 'SS' },
];

export default function UlasanWebsitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestion, setSuggestion] = useState('');
  const [progress, setProgress] = useState(0);

  // Load existing review
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
      alert("✅ Berhasil! Ulasan Anda telah tersimpan. Terima kasih atas feedback-nya! 🎉");
      router.push('/dashboard/user');
    } catch (error: any) {
      alert("❌ Gagal menyimpan: " + (error.response?.data?.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto lg:ml-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black-800">Ulasan Website</h1>
              <p className="text-gray-600 mt-0.5">Bantu kami meningkatkan pengalaman Anda. Setiap masukan sangat berarti untuk pengembangan platform ini.</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Progress Pengisian</p>
                    <p className="text-xs text-gray-400">{Object.keys(answers).length} dari {questions.length} pertanyaan</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {progress}%
                  </span>
                </div>
              </div>
              
              <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Questions */}
          <div className="space-y-5">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              
              return (
                <Card 
                  key={question.id}
                  className={`border-2 transition-all duration-300 hover:shadow-xl ${
                    isAnswered 
                      ? 'border-emerald-200 bg-emerald-50/30' 
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="space-y-5">
                      {/* Question Header */}
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          isAnswered 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isAnswered ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <Label className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                            {question.text}
                          </Label>
                        </div>
                      </div>

                      {/* Radio Options - Simple & Hover Effect */}
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
                        className="flex justify-center gap-2 mt-4"
                      >
                        {options.map((option) => {
                          const isSelected = answers[question.id] === option.value;
                          
                          return (
                            <div key={option.value} className="relative group">
                              <RadioGroupItem
                                value={option.value}
                                id={`${question.id}-${option.value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`${question.id}-${option.value}`}
                                className={`
                                  flex items-center justify-center w-16 h-16 rounded-xl border-2 
                                  cursor-pointer font-bold text-lg transition-all duration-200
                                  ${isSelected
                                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-110'
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md hover:-translate-y-1'
                                  }
                                `}
                              >
                                {option.label}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2">
                        <span>STS: Sangat Tidak Setuju</span>
                        <span>•</span>
                        <span>TS: Tidak Setuju</span>
                        <span>•</span>
                        <span>N: Netral</span>
                        <span>•</span>
                        <span>S: Setuju</span>
                        <span>•</span>
                        <span>SS: Sangat Setuju</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Suggestion Box */}
          <Card className="border-2 border-teal-200 shadow-xl bg-gradient-to-br from-white to-teal-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">Kotak Saran & Masukan</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Bagikan pendapat Anda untuk perbaikan lebih lanjut</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Tuliskan saran, kritik, atau pengalaman Anda menggunakan website ini..."
                className="min-h-[180px] border-2 border-teal-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 bg-white rounded-xl text-base resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">Opsional - Tapi kami sangat menghargai masukan Anda</p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={loading || !allAnswered}
              className={`group relative px-10 py-7 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
                allAnswered
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-emerald-500/50 hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {allAnswered && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              
              <span className="relative flex items-center gap-3 text-white">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Kirim Ulasan
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </div>

          {!allAnswered && (
            <p className="text-center text-sm text-amber-600 font-medium">
              Mohon jawab semua pertanyaan sebelum mengirim ulasan
            </p>
          )}
        </form>
      </div>
    </div>
  );
}