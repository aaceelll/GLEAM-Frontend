'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import BankSoalList from '@/components/dashboard/assessment/BankSoalList';
import SoalList from '@/components/dashboard/assessment/SoalList';
import TestBuilder from '@/components/dashboard/assessment/TestBuilder';

type BankSoal = { id: string; nama: string; totalSoal: number; status: 'draft'|'publish'; updatedAt?: string; };
type Soal = { id: string; teks: string; tipe: 'pilihan_ganda'|'true_false'; bobot: number; };
type Tes = { id: string; nama: string; tipe: 'pre'|'post'; status: 'draft'|'publish'; };

// === SESUAIKAN DENGAN ROUTE LARAVEL-MU ===
const API_PATHS = {
  bankList : '/admin/bank-soal',
  soalList : (bankId: string) => `/admin/bank-soal/${bankId}/soal`,
  tesList  : (bankId?: string) => bankId ? `/admin/tes?bankId=${bankId}` : '/admin/tes',
  materiDM : '/admin/materi?slug=diabetes-melitus',
};

export default function AssessmentPage() {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const [banks, setBanks] = useState<BankSoal[]>([]);
  const [banksLoading, setBanksLoading] = useState<boolean>(true);

  const [soal, setSoal] = useState<Soal[]>([]);
  const [soalLoading, setSoalLoading] = useState<boolean>(false);

  const [tests, setTests] = useState<Tes[]>([]);
  const [tesLoading, setTesLoading] = useState<boolean>(false);

  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const res = await api.get(API_PATHS.bankList);
      setBanks(res.data || []);
    } finally {
      setBanksLoading(false);
    }
  }, []);

  const fetchSoal = useCallback(async (bankId: string | null) => {
    if (!bankId) { setSoal([]); return; }
    setSoalLoading(true);
    try {
      const res = await api.get(API_PATHS.soalList(bankId));
      setSoal(res.data || []);
    } finally {
      setSoalLoading(false);
    }
  }, []);

  const fetchTes = useCallback(async (bankId: string | null) => {
    setTesLoading(true);
    try {
      const res = await api.get(API_PATHS.tesList(bankId || undefined));
      setTests(res.data || []);
    } finally {
      setTesLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanks(); }, [fetchBanks]);
  useEffect(() => { fetchSoal(selectedBankId); fetchTes(selectedBankId); }, [selectedBankId, fetchSoal, fetchTes]);

  const onBanksChanged = () => { fetchBanks().then(() => { if (selectedBankId) fetchSoal(selectedBankId); }); };
  const onSoalChanged  = () => { if (selectedBankId) fetchSoal(selectedBankId); fetchBanks(); };
  const onTestsChanged = () => { fetchTes(selectedBankId); };

  return (
    <div className="px-6 md:px-10 py-6">
      {/* bikin container lebih lebar biar lega */}
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent">
          Assesment Manager
      </h1>
      <p className="text-gray-600 mt-0.5">Kelola Assessment Diabetes Melitus</p>
    </header>


        {/* ROW ATAS: 2 kolom besar */}
        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-6 bg-white rounded-2xl shadow-sm border p-6">
            <BankSoalList
              banks={banks}
              loading={banksLoading}
              selectedId={selectedBankId}
              onSelect={(id) => setSelectedBankId(id)}
              onChanged={onBanksChanged}
              API_PATHS={{ bankList: API_PATHS.bankList }}
            />
          </section>

          <section className="col-span-12 lg:col-span-6 bg-white rounded-2xl shadow-sm border p-6">
            <SoalList
              bankId={selectedBankId}
              soal={soal}
              loading={soalLoading}
              onChanged={onSoalChanged}
              API_PATHS={{ soalList: API_PATHS.soalList }}
            />
          </section>
        </div>

        {/* ROW BAWAH: 1 kartu full width (builder tes) */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <TestBuilder
            bankId={selectedBankId}
            tests={tests}
            loading={tesLoading}
            onChanged={onTestsChanged}
            API_PATHS={{ materiDM: API_PATHS.materiDM }}
          />
        </section>
      </div>
    </div>
  );
}
