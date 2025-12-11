'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Props = {
  banks: { id:string; nama:string; totalSoal:number; status:'draft'|'publish'; updatedAt?:string }[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChanged: () => void;
  API_PATHS: { bankList: string; };
};

export default function BankSoalList({ banks, loading, selectedId, onSelect, onChanged }: Props) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<{id:string; nama:string} | null>(null);
  const [nama, setNama] = useState('');
  const [errorNama, setErrorNama] = useState("");

  const addBank = async () => {
    setErrorNama(""); // reset error dulu

    if (!nama.trim()) {
      setErrorNama("Nama bank soal wajib diisi.");
    return;
    }
    setAdding(true);
    try {
      await api.post('/admin/bank-soal', { nama, status: 'draft' });
      
      // sukses
      setNama('');
      onChanged();
      
    } catch (err: any) {
      const msg =
      err?.response?.data?.errors?.nama?.[0] ||
      err?.response?.data?.message ||
      "Gagal menambahkan bank soal.";

    setErrorNama(msg); // tampilkan error

    } finally {
      setAdding(false);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api.patch(`/admin/bank-soal/${editing.id}`, { nama: editing.nama });
    setEditing(null);
    onChanged();
  };

  const del = async (id: string) => {
    if (!confirm('Hapus bank soal ini?')) return;
    await api.delete(`/admin/bank-soal/${id}`);
    onChanged();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Bank Soal</h2>
        <span className="text-xs text-muted-foreground">{loading ? 'Memuat…' : `${banks.length} item`}</span>
      </div>

      <div className="flex gap-3">
        <input
          value={nama}
          onChange={e=>setNama(e.target.value)}
          placeholder="Nama bank (mis. Pre-Test DM)"
          className="input input-bordered w-full border rounded-md px-3 py-2"
        />
        <button onClick={addBank} disabled={adding} className="btn bg-emerald-600 text-white rounded-md px-4">
          Tambah
        </button>
      </div>

      {errorNama && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          ⚠️ {errorNama}
        </p>
      )}

      <ul className="divide-y rounded-xl border overflow-hidden max-h-[60vh] overflow-auto">
        {banks.map(b => (
          <li key={b.id}
              className={`p-4 cursor-pointer hover:bg-muted ${selectedId===b.id ? 'bg-muted' : ''}`}
              onClick={()=>onSelect(b.id)}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {editing?.id === b.id ? (
                  <input
                    autoFocus
                    value={editing.nama}
                    onChange={e=>setEditing({...editing, nama: e.target.value})}
                    className="w-full border rounded-md px-2 py-1"
                    onClick={(e)=>e.stopPropagation()}
                  />
                ) : (
                  <p className="font-medium truncate">{b.nama}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{b.totalSoal} soal • {b.status}</p>
              </div>
              <div className="shrink-0 flex gap-3">
                {editing?.id === b.id ? (
                  <button className="text-emerald-700 text-sm" onClick={(e)=>{e.stopPropagation(); saveEdit();}}>Simpan</button>
                ) : (
                  <button className="text-sm text-slate-600" onClick={(e)=>{e.stopPropagation(); setEditing({id:b.id, nama:b.nama});}}>Edit</button>
                )}
                <button className="text-sm text-rose-600" onClick={(e)=>{e.stopPropagation(); del(b.id);}}>Hapus</button>
              </div>
            </div>
          </li>
        ))}
        {!banks.length && !loading && (
          <li className="p-4 text-sm text-muted-foreground">Belum ada bank soal.</li>
        )}
      </ul>
    </div>
  );
}
