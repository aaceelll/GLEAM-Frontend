"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import {
  Plus,
  FolderPlus,
  FolderOpen,
  Pencil,
  Trash2,
  Search,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  X,
} from "lucide-react";

/** ====== Types ====== */
type BankSoal = { id: string; nama: string; totalSoal: number; status?: "draft" | "publish"; updatedAt?: string };
type Soal = { id: string; teks: string; tipe?: "pilihan_ganda" | "true_false" | "screening"; opsi?: { no: number; teks: string; skor?: number }[] };
type Msg = { type: "success" | "error"; text: string } | null;

/** ====== FIXED ENDPOINTS ====== */
const API_PATHS = {
  bankList   : "/admin/bank-soal",
  soalList   : (bankId: string) => `/admin/bank-soal/${bankId}/soal`,
  soalCreate : (bankId: string) => `/admin/bank-soal/${bankId}/soal`,
  soalDelete : (id: string | number) => `/admin/soal/${id}`,
  tesList    : (bankId?: string) => bankId ? `/admin/tes?bankId=${bankId}` : "/admin/tes",
};

export default function AssessmentPage() {
  const [msg, setMsg] = useState<Msg>(null);
  const [banks, setBanks] = useState<BankSoal[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankQuery, setBankQuery] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [soal, setSoal] = useState<Soal[]>([]);
  const [soalLoading, setSoalLoading] = useState(false);
  const [soalQuery, setSoalQuery] = useState("");
  const [openAddBank, setOpenAddBank] = useState(false);
  
  const [addBankName, setAddBankName] = useState("");
  const [openRename, setOpenRename] = useState<{ id: string; nama: string } | null>(null);
  const [openAddSoal, setOpenAddSoal] = useState(false);
  const [qText, setQText] = useState("");
  const [isScreening, setIsScreening] = useState(false);
  const [options, setOptions] = useState<{ label: string; skor: string }[]>([
    { label: "", skor: "" },
    { label: "", skor: "" },
  ]);
  const [openDetail, setOpenDetail] = useState<Soal | null>(null);

  const filteredBanks = useMemo(() => {
    const q = bankQuery.toLowerCase();
    return !q ? banks : banks.filter((b) => b.nama.toLowerCase().includes(q));
  }, [banks, bankQuery]);

  const filteredSoal = useMemo(() => {
    const q = soalQuery.toLowerCase();
    return !q ? soal : soal.filter((s) => s.teks?.toLowerCase().includes(q) || s.opsi?.some((o) => o.teks.toLowerCase().includes(q)));
  }, [soal, soalQuery]);

  function showMsg(next: Msg) {
    setMsg(next);
    if (next) setTimeout(() => setMsg(null), 3000);
  }

  function parseErrText(err: any, fallback: string) {
    const data = err?.response?.data;
    if (data?.message) return data.message as string;
    const errors = data?.errors as Record<string, string[] | string> | undefined;
    if (errors) {
      const first = Object.values(errors)[0];
      if (Array.isArray(first) && first.length) return first[0];
      if (typeof first === "string") return first;
    }
    return fallback;
  }

  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const res = await api.get(API_PATHS.bankList);
      const list = (res.data?.data ?? res.data ?? []) as any[];
      const mapped: BankSoal[] = list.map((it: any) => ({
        id: String(it.id),
        nama: it.nama,
        totalSoal: it.totalSoal ?? it.total_soal ?? 0,
        status: it.status ?? "draft",
        updatedAt: it.updatedAt ?? it.updated_at ?? undefined,
      }));
      setBanks(mapped);
      if (!selectedBankId && mapped.length) setSelectedBankId(mapped[0].id);
    } catch {
      showMsg({ type: "error", text: "Gagal memuat bank soal." });
      setBanks([]);
    } finally {
      setBanksLoading(false);
    }
  }, [selectedBankId]);

  const fetchSoal = useCallback(async (bankId: string | null) => {
    if (!bankId) {
      setSoal([]);
      return;
    }
    setSoalLoading(true);
    try {
      const res = await api.get(API_PATHS.soalList(bankId));
      const list = (res.data?.data ?? res.data ?? []) as any[];
      const mapped: Soal[] = list.map((it: any) => ({
        id: String(it.id),
        teks: it.teks ?? it.pertanyaan ?? "",
        tipe: it.tipe ?? (it.is_screening ? "screening" : "pilihan_ganda"),
        opsi: (it.opsi ?? it.options ?? it.pilihan ?? [])?.map((o: any, idx: number) => ({
          no: Number(o.no ?? o.order ?? idx + 1),
          teks: o.teks ?? o.label ?? "",
          skor: o.skor ?? o.score ?? undefined,
        })) ?? [],
      }));
      setSoal(mapped);
    } catch {
      showMsg({ type: "error", text: "Gagal memuat daftar soal." });
      setSoal([]);
    } finally {
      setSoalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  useEffect(() => {
    fetchSoal(selectedBankId);
  }, [selectedBankId, fetchSoal]);

  async function handleCreateBank() {
    if (!addBankName.trim()) return;
    try {
      await api.post(API_PATHS.bankList, { nama: addBankName.trim() });
      showMsg({ type: "success", text: "Bank soal berhasil ditambahkan!" });
      setAddBankName("");
      setOpenAddBank(false);
      await fetchBanks();
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menambah bank soal.") });
    }
  }

  async function handleRenameBank() {
    if (!openRename) return;
    const newName = openRename.nama.trim();
    if (!newName) return;
    try {
      await api.patch(`${API_PATHS.bankList}/${openRename.id}`, { nama: newName });
      showMsg({ type: "success", text: "Nama bank soal diperbarui!" });
      setOpenRename(null);
      await fetchBanks();
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal memperbarui nama bank.") });
    }
  }

  async function handleDeleteBank(id: string, nama: string) {
    const ok = confirm(`Hapus bank soal "${nama}" beserta seluruh soalnya?`);
    if (!ok) return;
    try {
      await api.delete(`${API_PATHS.bankList}/${id}`);
      showMsg({ type: "success", text: "Bank soal dihapus!" });
      if (selectedBankId === id) setSelectedBankId(null);
      await fetchBanks();
      await fetchSoal(null);
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menghapus bank soal.") });
    }
  }

  function setOpt(i: number, patch: Partial<{ label: string; skor: string }>) {
    setOptions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function addOption() {
    setOptions((prev) => [...prev, { label: "", skor: "" }]);
  }

  function removeOption(i: number) {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function resetSoalForm() {
    setQText("");
    setIsScreening(false);
    setOptions([
      { label: "", skor: "" },
      { label: "", skor: "" },
    ]);
  }

  async function handleCreateSoal(e: FormEvent) {
    e.preventDefault();
    
    if (!selectedBankId) {
      showMsg({ type: "error", text: "Pilih bank soal terlebih dahulu." });
      return;
    }
    
    if (!qText.trim()) {
      showMsg({ type: "error", text: "Pertanyaan wajib diisi." });
      return;
    }

    if (!isScreening) {
      const hasEmptyOption = options.some((o) => o.label.trim() === "");
      const hasEmptyScore = options.some((o) => o.skor.trim() === "");
      if (hasEmptyOption || hasEmptyScore) {
        showMsg({ type: "error", text: "Semua opsi & skor harus diisi untuk soal pilihan ganda." });
        return;
      }
    }

    const opsi = isScreening ? [] : options.map((o, i) => ({
      no: i + 1,
      teks: o.label.trim(),
      skor: Number(o.skor || 0),
    }));

    const payload = {
      teks: qText.trim(),
      tipe: isScreening ? "screening" : "pilihan_ganda",
      bobot: 1,
      opsi: opsi,
      kunci: null,
    };

    console.log("🔍 Endpoint:", API_PATHS.soalCreate(selectedBankId));
    console.log("🔍 Payload:", payload);

    try {
      const response = await api.post(API_PATHS.soalCreate(selectedBankId), payload);
      console.log("✅ Response:", response.data);
      
      showMsg({ type: "success", text: "Soal berhasil ditambahkan!" });
      setOpenAddSoal(false);
      resetSoalForm();
      await fetchSoal(selectedBankId);
      await fetchBanks();
    } catch (err) {
      console.error("❌ Error:", err);
      showMsg({ type: "error", text: parseErrText(err, "Gagal menambahkan soal.") });
    }
  }

  async function handleDeleteSoal(id: string) {
    if (!selectedBankId) return;
    const ok = confirm("Hapus soal ini?");
    if (!ok) return;
    try {
      await api.delete(API_PATHS.soalDelete(id));
      showMsg({ type: "success", text: "Soal berhasil dihapus!" });
      await fetchSoal(selectedBankId);
      await fetchBanks();
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menghapus soal.") });
    }
  }

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <ListChecks className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
                  Assessment Manager
                </h1>
                <p className="text-gray-600 mt-0.5">Kelola bank soal & kuisioner skoring di satu halaman</p>
              </div>
            </div>
          </div>
        </header>

        {msg && (
          <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg border-2 ${msg.type === "success" ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900" : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-900"}`}>
            {msg.type === "success" ? <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />}
            <span className="font-semibold">{msg.text}</span>
          </div>
        )}

        <section>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                    Bank Soal
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 ml-4">Contoh: Pre-Test Diabetes Melitus</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">{banks.length} Bank</span>
                  </div>
                  <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-4 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold" onClick={() => setOpenAddBank(true)}>
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    Tambah Bank Soal
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={bankQuery} onChange={(e) => setBankQuery(e.target.value)} placeholder="Cari bank soal..." className="w-full pl-9 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" />
              </div>
            </div>

            <div className="px-3 pb-4">
              {banksLoading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 mt-4 font-medium">Memuat bank soal...</p>
                </div>
              ) : filteredBanks.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                    <FolderOpen className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-bold text-lg">Belum Ada Bank Soal</p>
                  <p className="text-sm text-gray-500">Klik tombol di atas untuk membuat bank soal pertama</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBanks.map((bank, i) => (
                    <div key={bank.id} onClick={() => setSelectedBankId(bank.id)} className={`group relative overflow-hidden rounded-2xl p-5 border-2 cursor-pointer transition-all hover:shadow-xl ${selectedBankId === bank.id ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg scale-105" : "border-gray-200 bg-white hover:border-emerald-300"}`}>
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradients[i % gradients.length]}`}></div>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedBankId === bank.id ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gray-100 group-hover:bg-emerald-100"} transition-all`}>
                          <FolderOpen className={`h-5 w-5 ${selectedBankId === bank.id ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setOpenRename({ id: bank.id, nama: bank.nama }); }} className="p-2 rounded-lg hover:bg-white transition-colors" title="Ubah Nama">
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteBank(bank.id, bank.nama); }} className="p-2 rounded-lg hover:bg-white transition-colors" title="Hapus">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{bank.nama}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{bank.totalSoal} soal</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bank.status === "publish" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {bank.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                    Daftar Soal
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 ml-4">
                    {selectedBankId ? banks.find((b) => b.id === selectedBankId)?.nama : "Pilih salah satu bank soal"}
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 px-4 py-2.5 shadow-md hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedBankId} onClick={() => setOpenAddSoal(true)}>
                  <Plus className="h-4 w-4" />
                  Tambah Soal
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {!selectedBankId ? (
                <div className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                    <ListChecks className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-bold text-lg">Pilih Bank Soal</p>
                  <p className="text-sm text-gray-500">Pilih bank soal dahulu untuk melihat pertanyaan</p>
                </div>
              ) : soalLoading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 mt-4 font-medium">Memuat daftar soal...</p>
                </div>
              ) : filteredSoal.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                    <Info className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-bold text-lg">Belum Ada Soal</p>
                  <p className="text-sm text-gray-500">Klik tombol &quot;Tambah Soal&quot; untuk membuat pertanyaan pertama</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSoal.map((q, idx) => (
                    <div key={q.id} className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-5 hover:border-blue-300 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold flex items-center justify-center shadow-sm text-sm">
                              {idx + 1}
                            </span>
                            {q.tipe === "screening" && (
                              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                Screening
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900 mb-3 leading-relaxed">{q.teks}</p>
                          {q.opsi && q.opsi.length > 0 && (
                            <div className="space-y-2">
                              {q.opsi.map((opt) => (
                                <div key={opt.no} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                  <span className="flex-shrink-0 w-6 h-6 rounded bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center">
                                    {opt.no}
                                  </span>
                                  <span className="flex-1 text-sm text-gray-700">{opt.teks}</span>
                                  {opt.skor !== undefined && (
                                    <span className="flex-shrink-0 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                      Skor: {opt.skor}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <button className="p-2.5 rounded-xl text-blue-600 bg-blue-50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-500 hover:text-white transition-all hover:scale-110 shadow-sm" onClick={() => setOpenDetail(q)} title="Lihat Detail">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:text-white transition-all hover:scale-110 shadow-sm" onClick={() => handleDeleteSoal(q.id)} title="Hapus">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {openAddBank && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between rounded-t-3xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="h-6 w-6" />
            Tambah Bank Soal
          </h2>
          <p className="text-emerald-100 text-sm mt-1">Buat bank soal baru untuk assessment</p>
        </div>
        <button onClick={() => setOpenAddBank(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300">
          <X className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
            Nama Bank Soal <span className="text-red-500">*</span>
          </label>
          <input autoFocus value={addBankName} onChange={(e) => setAddBankName(e.target.value)} placeholder="Contoh: Pre-Test Diabetes Melitus" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all" onKeyDown={(e) => e.key === "Enter" && handleCreateBank()} />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button onClick={() => setOpenAddBank(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105">
            Batal
          </button>
          <button onClick={handleCreateBank} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
            💾 Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {openAddSoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 via-indigo-500 to-blue-500 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus className="h-6 w-6" />
                  Tambah Soal Baru
                </h2>
                <p className="text-blue-100 text-sm mt-1">Lengkapi formulir di bawah</p>
              </div>
              <button onClick={() => setOpenAddSoal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <form onSubmit={handleCreateSoal} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="space-y-2">
                <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  Pertanyaan <span className="text-red-500">*</span>
                </label>
                <textarea value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Tulis pertanyaan di sini..." rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none" />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <input type="checkbox" id="isScreening" checked={isScreening} onChange={(e) => setIsScreening(e.target.checked)} className="mt-1 w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                <div className="flex-1">
                  <label htmlFor="isScreening" className="font-semibold text-gray-900 cursor-pointer">
                    Soal Screening (Tanpa Opsi Jawaban)
                  </label>
                  <p className="text-xs text-gray-600 mt-1">Centang jika soal tidak memerlukan pilihan jawaban (hanya pertanyaan terbuka)</p>
                </div>
              </div>

              {!isScreening && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-gray-900 text-sm">Opsi Jawaban *</label>
                    <button type="button" onClick={addOption} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Tambah Opsi
                    </button>
                  </div>
                  <div className="space-y-3">
                    {options.map((opt, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <input type="text" value={opt.label} onChange={(e) => setOpt(i, { label: e.target.value })} placeholder={`Teks opsi ${i + 1}`} className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" required />
                        </div>
                        <div className="w-28">
                          <input type="number" value={opt.skor} onChange={(e) => setOpt(i, { skor: e.target.value })} placeholder="Skor" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all" required />
                        </div>
                        {options.length > 2 && (
                          <button type="button" onClick={() => removeOption(i)} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title={options.length <= 2 ? "Minimal 2 opsi" : "Hapus opsi"}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                <button type="button" onClick={() => setOpenAddSoal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-indigo-400 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
                  💾 Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 via-indigo-400 to-green-500 px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Detail Soal
                </h2>
                <p className="text-indigo-100 text-sm mt-1 capitalize">
                  Tipe: {openDetail.tipe === "screening" ? "Screening (tanpa skor)" : openDetail.tipe === "true_false" ? "True/False" : "Pilihan ganda"}
                </p>
              </div>
              <button onClick={() => setOpenDetail(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="text-sm font-semibold text-gray-600 mb-2">Pertanyaan:</div>
                <div className="font-bold text-gray-900 text-lg leading-relaxed">{openDetail.teks}</div>
              </div>

              {openDetail.tipe !== "screening" && openDetail.opsi?.length ? (
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                    Opsi Jawaban
                  </div>
                  <ul className="space-y-3">
                    {openDetail.opsi.map((o) => (
                      <li key={o.no} className="flex items-center gap-3 bg-white rounded-xl border-2 border-gray-100 p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center shadow-sm">
                          {o.no}
                        </div>
                        <div className="text-gray-800 flex-1 font-medium">{o.teks}</div>
                        <div className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-bold border-2 border-emerald-200">
                          Skor: {typeof o.skor === "number" ? o.skor : "-"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-6 text-center">
                  <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Soal screening tidak memiliki opsi jawaban</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                <button onClick={() => setOpenDetail(null)} className="flex-1 bg-gradient-to-r from-green-600 to-indigo-500 hover:from-indigo-700 hover:to-green-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}