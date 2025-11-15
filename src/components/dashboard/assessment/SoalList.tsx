'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Soal = { id:string; teks:string; tipe:'pilihan_ganda'|'true_false'; bobot:number; opsi?:string[]; kunci?:string; };

type Props = {
  bankId: string | null;
  soal: Soal[];
  loading: boolean;
  onChanged: () => void;
  API_PATHS: { soalList: (bankId: string) => string; };
};

export default function SoalList({ bankId, soal, loading, onChanged }: Props) {
  const [form, setForm] = useState<Partial<Soal>>({ teks:'', tipe:'true_false', bobot:1, kunci:'true' });
  const disabled = !bankId;

  const tambah = async () => {
    if (!bankId || !form.teks) return;
    await api.post(`/admin/bank-soal/${bankId}/soal`, { ...form, bankId });
    setForm({ teks:'', tipe:'true_false', bobot:1, kunci:'true' });
    onChanged();
  };

  const hapus = async (id: string) => {
    if (!confirm('Hapus soal ini?')) return;
    await api.delete(`/admin/soal/${id}`);
    onChanged();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Daftar Soal {bankId ? '' : '(pilih bank dulu)'}</h2>
        <span className="text-xs text-muted-foreground">{loading ? 'Memuat…' : `${soal.length} soal`}</span>
      </div>

      <div className="space-y-3 border rounded-2xl p-4 bg-muted/20">
        <textarea
          disabled={disabled}
          value={form.teks || ''}
          onChange={e=>setForm(f=>({...f, teks:e.target.value}))}
          placeholder="Tulis pertanyaan…"
          className="w-full border rounded-md px-3 py-2 min-h-[88px] bg-white"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            disabled={disabled}
            value={form.tipe}
            onChange={e=>setForm(f=>({...f, tipe:e.target.value as any}))}
            className="border rounded-md px-3 py-2"
          >
            <option value="true_false">Benar/Salah</option>
            <option value="pilihan_ganda">Pilihan Ganda</option>
          </select>

          <input
            disabled={disabled}
            type="number"
            min={1}
            value={form.bobot || 1}
            onChange={e=>setForm(f=>({...f, bobot:Number(e.target.value)}))}
            className="w-28 border rounded-md px-3 py-2"
            placeholder="Bobot"
          />

          {form.tipe === 'true_false' && (
            <select
              disabled={disabled}
              value={form.kunci as string}
              onChange={e=>setForm(f=>({...f, kunci:e.target.value}))}
              className="border rounded-md px-3 py-2"
            >
              <option value="true">Benar</option>
              <option value="false">Salah</option>
            </select>
          )}

          <button
            disabled={disabled}
            onClick={tambah}
            className="ml-auto btn bg-emerald-600 text-white rounded-md px-4 py-2"
          >
            Tambah Soal
          </button>
        </div>
      </div>

      <ol className="space-y-3 max-h-[56vh] overflow-auto pr-1">
        {soal.map((s, i) => (
          <li key={s.id} className="p-4 rounded-2xl border">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm leading-relaxed">
                <span className="font-semibold">{i+1}.</span> {s.teks}
                <div className="text-xs text-muted-foreground mt-1">
                  tipe: {s.tipe} • bobot: {s.bobot}{s.tipe==='true_false' ? ` • kunci: ${s.kunci}` : ''}
                </div>
              </div>
              <button className="text-rose-600 text-sm" onClick={()=>hapus(s.id)}>Hapus</button>
            </div>
          </li>
        ))}
        {!soal.length && !loading && (
          <li className="p-4 text-sm text-muted-foreground border rounded-2xl">Belum ada soal.</li>
        )}
      </ol>
    </div>
  );
}
