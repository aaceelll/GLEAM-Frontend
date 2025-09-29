'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Tes = { id:string; nama:string; tipe:'pre'|'post'; status:'draft'|'publish' };

type Props = {
  bankId: string | null;
  tests: Tes[];
  loading: boolean;
  onChanged: () => void;
  API_PATHS: { materiDM: string };
};

export default function TestBuilder({ bankId, tests, loading, onChanged }: Props) {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState<'pre'|'post'>('pre');
  const disabled = !bankId;

  const simpan = async () => {
    if (!bankId || !nama.trim()) return;
    await api.post('/admin/tes', { nama, tipe, bankId, materi: 'diabetes-melitus' });
    setNama('');
    setTipe('pre');
    onChanged();
  };

  const hapus = async (id:string) => {
    if (!confirm('Hapus tes ini?')) return;
    await api.delete(`/admin/tes/${id}`);
    onChanged();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Buat / Kelola Tes</h2>
      <p className="text-xs text-muted-foreground">
        Materi & Bank otomatis <strong>Diabetes Melitus</strong> (pilih bank dulu).
      </p>

      <div className="space-y-3">
        <input
          disabled={disabled}
          value={nama}
          onChange={e => setNama(e.target.value)}
          placeholder="Nama tes (mis. Pre Test DM Batch 1)"
          className="w-full border rounded-md px-3 py-2"
        />

        <select
          disabled={disabled}
          value={tipe}
          onChange={e => setTipe(e.target.value as 'pre'|'post')}
          className="border rounded-md px-3 py-2"
        >
          <option value="pre">Pre Test</option>
          <option value="post">Post Test</option>
        </select>

        <button
          disabled={disabled}
          onClick={simpan}
          className="w-full btn bg-emerald-600 text-white rounded-md px-4 py-2"
        >
          Simpan Tes
        </button>
      </div>

      <ul className="divide-y rounded-lg border overflow-hidden">
        {tests.map(t => (
          <li key={t.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{t.nama}</p>
              <p className="text-xs text-muted-foreground">{t.tipe}</p>
            </div>
            <button
              className="text-sm text-rose-600"
              onClick={() => hapus(t.id)}
            >
              Hapus
            </button>
          </li>
        ))}
        {!tests.length && !loading && (
          <li className="p-3 text-sm text-muted-foreground">Belum ada tes.</li>
        )}
      </ul>
    </div>
  );
}
