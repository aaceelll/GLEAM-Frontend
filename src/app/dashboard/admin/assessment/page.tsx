"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { Plus, FolderOpen, Pencil, Trash2, Search, ListChecks, CheckCircle2, AlertCircle, Info, X} from "lucide-react";

type BankSoal = {
  id: string;
  nama: string;
  totalSoal: number;
  updatedAt?: string;
  isShown?: boolean;
};
type Soal = {
  id: string;
  teks: string;
  tipe?: "pilihan_ganda" | "true_false" | "screening";
  opsi?: { no: number; teks: string; skor?: number }[];
};
type Msg = { type: "success" | "error"; text: string } | null;

const API_PATHS = {
  bankList: "/admin/bank-soal",
  soalList: (bankId: string) => `/admin/bank-soal/${bankId}/soal`,
  soalCreate: (bankId: string) => `/admin/bank-soal/${bankId}/soal`,
  soalDelete: (id: string | number) => `/admin/soal/${id}`,
};

const hoverCard =
  "group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-white " +
  "transition-all duration-500 hover:border-emerald-400 " +
  "hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1";

function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Hapus",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-gray-100 shadow-2xl">
        <div className="px-5 py-4 border-b-2 border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">{description}</div>
        <div className="px-5 py-4 flex items-center justify-end gap-3 border-t-2 border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold transition-all">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-rose-700 hover:shadow-lg transition-all">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function GreenModalFrame({
  titleIcon,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-xl",
}: {
  titleIcon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl ${maxWidth} w-full shadow-2xl overflow-hidden`}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {titleIcon}
              {title}
            </h2>
            {subtitle ? <p className="text-emerald-100 text-sm mt-1">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const [msg, setMsg] = useState<Msg>(null);
  const [banks, setBanks] = useState<BankSoal[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankQuery, setBankQuery] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [soal, setSoal] = useState<Soal[]>([]);
  const [soalLoading, setSoalLoading] = useState(false);
  const [soalQuery, setSoalQuery] = useState("");
  const orderRef = useRef<string[]>([]);
  const [openAddBank, setOpenAddBank] = useState(false);
  const [addBankName, setAddBankName] = useState("");
  const [openRename, setOpenRename] = useState<{ id: string; nama: string } | null>(null);
  const [confirmDeleteBank, setConfirmDeleteBank] = useState<{ id: string; nama: string } | null>( null);
  const [openAddSoal, setOpenAddSoal] = useState(false);
  const [confirmDeleteSoal, setConfirmDeleteSoal] = useState<string | null>(null);
  const [qText, setQText] = useState("");
  const [isScreening, setIsScreening] = useState(false);
  const [options, setOptions] = useState<{ label: string; skor: string }[]>([
    { label: "", skor: "" },
    { label: "", skor: "" },
  ]);

  const filteredBanks = useMemo(() => {
    const q = bankQuery.toLowerCase();
    return !q ? banks : banks.filter((b) => b.nama.toLowerCase().includes(q));
  }, [banks, bankQuery]);

  const filteredSoal = useMemo(() => {
    const q = soalQuery.toLowerCase();
    return !q
      ? soal
      : soal.filter(
          (s) =>
            s.teks?.toLowerCase().includes(q) ||
            s.opsi?.some((o) => o.teks.toLowerCase().includes(q))
        );
  }, [soal, soalQuery]);

  function showMsg(next: Msg) {
    setMsg(next);
    if (next) setTimeout(() => setMsg(null), 2500);
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

  const sortByOrderRef = useCallback((list: BankSoal[]) => {
    if (orderRef.current.length === 0) return list;
    const order = orderRef.current;
    const idxOf = (id: string) => {
      const i = order.indexOf(id);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    const sorted = [...list].sort((a, b) => idxOf(a.id) - idxOf(b.id));
    orderRef.current = [
      ...order.filter((id) => sorted.some((x) => x.id === id)),
      ...sorted.map((x) => x.id).filter((id) => !order.includes(id)),
    ];
    return sorted;
  }, []);

  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const res = await api.get(API_PATHS.bankList);
      const list = (res.data?.data ?? res.data ?? []) as any[];
      const mapped: BankSoal[] = list.map((it: any) => {
        const total = it.totalSoal ?? it.total_soal ?? 0;
        return {
          id: String(it.id),
          nama: it.nama,
          totalSoal: total,
          updatedAt: it.updatedAt ?? it.updated_at ?? undefined,
          isShown: total > 0,
        };
      });

      let next = mapped;
      if (orderRef.current.length === 0 && banks.length === 0) {
        orderRef.current = mapped.map((m) => m.id);
      } else {
        next = sortByOrderRef(mapped);
      }

      setBanks(next);
      if (!selectedBankId && next.length) setSelectedBankId(next[0].id);
    } catch {
      showMsg({ type: "error", text: "Gagal memuat bank soal." });
      setBanks([]);
    } finally {
      setBanksLoading(false);
    }
  }, [banks.length, selectedBankId, sortByOrderRef]);

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
        opsi:
          (it.opsi ?? it.options ?? it.pilihan ?? [])?.map((o: any, idx: number) => ({
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

  async function doDeleteBank() {
    if (!confirmDeleteBank) return;
    const { id } = confirmDeleteBank;
    try {
      await api.delete(`${API_PATHS.bankList}/${id}`);
      orderRef.current = orderRef.current.filter((x) => x !== id);
      showMsg({ type: "success", text: "Bank soal dihapus!" });
      if (selectedBankId === id) setSelectedBankId(null);
      await fetchBanks();
      await fetchSoal(null);
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menghapus bank soal.") });
    } finally {
      setConfirmDeleteBank(null);
    }
  }
/* ------------------------ CRUD: Soal ------------------------ */
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
        showMsg({
          type: "error",
          text: "Semua opsi & skor harus diisi untuk soal pilihan ganda.",
        });
        return;
      }
    }
    const opsi = isScreening
      ? []
      : options.map((o, i) => ({
          no: i + 1,
          teks: o.label.trim(),
          skor: Number(o.skor || 0),
        }));

    const payload = {
      teks: qText.trim(),
      tipe: isScreening ? "screening" : "pilihan_ganda",
      bobot: 1,
      opsi,
      kunci: null,
    };

    try {
      await api.post(API_PATHS.soalCreate(selectedBankId), payload);
      showMsg({ type: "success", text: "Soal berhasil ditambahkan!" });
      setOpenAddSoal(false);
      resetSoalForm();
      await fetchSoal(selectedBankId);
      await fetchBanks(); 
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menambahkan soal.") });
    }
  }

  async function doDeleteSoal(id: string) {
    if (!selectedBankId) return;
    try {
      await api.delete(API_PATHS.soalDelete(id));
      showMsg({ type: "success", text: "Soal berhasil dihapus!" });
      await fetchSoal(selectedBankId);
      await fetchBanks(); 
    } catch (err) {
      showMsg({ type: "error", text: parseErrText(err, "Gagal menghapus soal.") });
    } finally {
      setConfirmDeleteSoal(null);
    }
  }
/* ------------------------ UI ------------------------ */
  return (
    <div className="min-h-screen bg-white px-6 md:px-10 py-9">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative isolate shrink-0">
              <span
                aria-hidden
                className="absolute -inset-1.5 sm:-inset-2 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-teal-500/25 blur-lg -z-10"/>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

             {/* Judul + subjudul */}
            <div>
              <h1 className="text-[22px] leading-[1.15] sm:text-3xl md:text-4xl font-bold text-gray-800">
                Assessment Manager<br className="hidden sm:block" />
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-0.5">
                Kelola bank soal & kuisioner skoring di satu halaman
              </p>
            </div>
          </div>
        </div>

          <button
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold"
            onClick={() => setOpenAddBank(true)}>
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Tambah Bank Soal
          </button>
        

        {/* Flash message */}
        {msg && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg border-2 ${
              msg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-semibold">{msg.text}</span>
          </div>
        )}

        {/* ----------------------- BANK SOAL ----------------------- */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Bank Soal
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">Kumpulan kategori/kelompok soal</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{banks.length} Bank</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={bankQuery}
                onChange={(e) => setBankQuery(e.target.value)}
                placeholder="Cari bank soal..."
                className="w-full pl-9 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"/>
            </div>
          </div>

          <div className="px-4 pb-6">
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
                <p className="text-sm text-gray-500">Klik tombol di atas untuk membuat bank soal</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBanks.map((bank) => {
                  const active = selectedBankId === bank.id;
                  return (
                    <div
                      key={bank.id}
                      className={`${hoverCard} ${
                        active
                          ? "border-emerald-500 ring-1 ring-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
                          : ""
                      }`}
                      onClick={() => setSelectedBankId(bank.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {/* sweep overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 transition-opacity duration-500 ${
                          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                      <div className="relative p-5">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          {/* kiri: icon + judul */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-xl grid place-items-center shadow ${
                                active
                                  ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                                  : "bg-emerald-50"
                              }`}
                            >
                              <FolderOpen
                                className={`h-6 w-6 ${
                                  active ? "text-white" : "text-emerald-600"
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">
                                {bank.nama}
                              </h3>
                              <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                                <span>{bank.totalSoal} soal</span>
                                {bank.totalSoal > 0 ? (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                      ✓ Ditampilkan ke user
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                      Belum ada soal
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* kanan: action area */}
                          <div className="flex items-center gap-2 z-10 pointer-events-auto"
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setOpenRename({ id: bank.id, nama: bank.nama })}
                              className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors shadow-sm"
                              title="Ubah Nama"
                              aria-label="Ubah Nama">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteBank({ id: bank.id, nama: bank.nama })}
                              className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                              title="Hapus"
                              aria-label="Hapus">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ----------------------- DAFTAR SOAL ----------------------- */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
                  Daftar Soal
                </h2>
                <p className="text-sm text-gray-600 mt-1 ml-4">
                  {selectedBankId
                    ? banks.find((b) => b.id === selectedBankId)?.nama
                    : "Pilih salah satu bank soal"}
                </p>
              </div>
              <button
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 px-4 py-2.5 shadow-md hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedBankId}
                onClick={() => setOpenAddSoal(true)}
              >
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
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 mt-4 font-medium">Memuat daftar soal...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {soal.length > 0 && (
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={soalQuery}
                      onChange={(e) => setSoalQuery(e.target.value)}
                      placeholder="Cari di daftar soal..."
                      className="w-full pl-9 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                )}
                {filteredSoal.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                      <Info className="h-10 w-10 text-gray-400" />
                    </div>

                    <p className="text-gray-700 font-bold text-lg">Belum Ada Soal</p>
                    <p className="text-sm text-gray-500">
                      {soal.length === 0
                        ? 'Klik tombol "Tambah Soal" untuk membuat pertanyaan pertama'
                        : 'Tidak ditemukan hasil pencarian'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSoal.map((q, idx) => (
                      <div
                        key={q.id}
                        className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 sm:p-5 hover:border-emerald-300 hover:shadow-lg transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-4">
                          <div className="flex items-start gap-3 w-full">
                            <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold grid place-items-center shadow-inner">
                              {idx + 1}
                            </span>

                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-gray-900 leading-snug break-words">
                                  {q.teks}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                                    q.tipe === "screening"
                                      ? "bg-violet-50 text-violet-700 border-violet-200"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {q.tipe === "screening" ? "Screening" : "Pilihan ganda"}
                                </span>
                              </div>
                              {/* opsi sebagai chips */}
                              {q.opsi && q.opsi.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 w-full">
                                  {q.opsi.map((opt) => (
                                    <div
                                      key={opt.no}
                                      className="flex items-start gap-2 px-3 py-2 rounded-xl w-full border bg-gray-50 border-gray-200"
                                    >
                                      <span className="w-5 h-5 flex-shrink-0 rounded-md bg-gray-200 text-gray-700 text-[10px] font-bold grid place-items-center">
                                        {opt.no}
                                      </span>
                                      <span className="text-sm text-gray-700 flex-1 break-words [word-break:break-word]">
                                        {opt.teks}
                                      </span>
                                      {opt.skor !== undefined && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold whitespace-nowrap flex-shrink-0">
                                          Skor {opt.skor}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Aksi (hapus) */}
                          <button
                            className="self-end sm:self-start p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-all hover:scale-110 shadow-sm flex-shrink-0"
                            onClick={() => setConfirmDeleteSoal(q.id)}
                            title="Hapus Soal"
                            aria-label="Hapus Soal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
          </div>
          )}
        </div>
      </section>
    </div>

      {/* Tambah Bank Soal */}
      {openAddBank && (
        <GreenModalFrame
          titleIcon={<Plus className="h-6 w-6" />}
          title="Tambah Bank Soal"
          subtitle="Buat bank soal baru untuk assessment"
          onClose={() => setOpenAddBank(false)}>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Nama Bank Soal <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                value={addBankName}
                onChange={(e) => setAddBankName(e.target.value)}
                placeholder="Contoh: Pre-Test Diabetes Melitus"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleCreateBank()}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOpenAddBank(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105">
                Batal
              </button>
              <button
                onClick={handleCreateBank}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
                Simpan
              </button>
            </div>
          </div>
        </GreenModalFrame>
      )}

      {/* Rename Bank Soal */}
      {openRename && (
        <GreenModalFrame
          titleIcon={<Pencil className="h-6 w-6" />}
          title="Ubah Nama Bank Soal"
          subtitle="Perbarui nama agar lebih jelas"
          onClose={() => setOpenRename(null)}>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Nama Bank Soal <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                value={openRename.nama}
                onChange={(e) => setOpenRename({ ...openRename, nama: e.target.value })}
                placeholder="Contoh: Pre-Test Diabetes Melitus"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleRenameBank()}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOpenRename(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105">
                Batal
              </button>
              <button
                onClick={handleRenameBank}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
                Simpan
              </button>
            </div>
          </div>
        </GreenModalFrame>
      )}

      {/* Konfirmasi Hapus Bank */}
      <ConfirmModal
        open={!!confirmDeleteBank}
        title="Hapus Bank Soal?"
        description={
          <>
            Apakah Anda yakin ingin menghapus{" "}
            <span className="font-semibold">{confirmDeleteBank?.nama}</span> beserta seluruh
            soalnya? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmText="Hapus"
        onConfirm={doDeleteBank}
        onClose={() => setConfirmDeleteBank(null)}
      />

      {/* Tambah Soal */}
      {openAddSoal && (
        <GreenModalFrame
          titleIcon={<Plus className="h-6 w-6" />}
          title="Tambah Soal Baru"
          subtitle="Lengkapi formulir di bawah"
          onClose={() => setOpenAddSoal(false)}
          maxWidth="max-w-3xl">
          <form
            onSubmit={handleCreateSoal}
            className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="space-y-2">
              <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                Pertanyaan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Tulis pertanyaan di sini..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
              />
            </div>

            {!isScreening && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                    Opsi Jawaban <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Tambah Opsi
                  </button>
                </div>
                <div className="space-y-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => setOpt(i, { label: e.target.value })}
                          placeholder={`Teks opsi ${i + 1}`}
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          value={opt.skor}
                          onChange={(e) => setOpt(i, { skor: e.target.value })}
                          placeholder="Skor"
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                          required
                        />
                      </div>
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(i)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title={options.length <= 2 ? "Minimal 2 opsi" : "Hapus opsi"}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => setOpenAddSoal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-all hover:scale-105">
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-3 font-semibold transition-all hover:scale-105 shadow-lg">
                Simpan Soal
              </button>
            </div>
          </form>
        </GreenModalFrame>
      )}

      {/* Konfirmasi Hapus Soal */}
      <ConfirmModal
        open={!!confirmDeleteSoal}
        title="Hapus Soal?"
        description="Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => confirmDeleteSoal && doDeleteSoal(confirmDeleteSoal)}
        onClose={() => setConfirmDeleteSoal(null)}
      />
    </div>
  );
}