"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Home, Calendar, Briefcase } from "lucide-react";

interface UserData {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  kelurahan: string;
  rw: string;
  alamat: string;
  address?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  pekerjaan?: string;
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Detail Pengguna
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <DetailItem 
            icon={<User className="h-5 w-5 text-white" />}
            label="Nama Lengkap"
            value={user.nama}
            bgColor="from-emerald-500 to-teal-600"
          />

          <DetailItem 
            icon={<Mail className="h-5 w-5 text-white" />}
            label="Email"
            value={user.email}
            bgColor="from-blue-500 to-cyan-600"
          />

          <DetailItem 
            icon={<Phone className="h-5 w-5 text-white" />}
            label="Nomor Telepon"
            value={user.nomor_telepon}
            bgColor="from-purple-500 to-pink-600"
          />

          <DetailItem 
            icon={<MapPin className="h-5 w-5 text-white" />}
            label="Wilayah"
            value={`${user.kelurahan} - ${user.rw}`}
            bgColor="from-orange-500 to-red-600"
          />

          <DetailItem 
            icon={<Home className="h-5 w-5 text-white" />}
            label="Alamat"
            value={user.address || user.alamat || '-'}
            bgColor="from-green-500 to-emerald-600"
          />

          {user.tanggal_lahir && (
            <DetailItem 
              icon={<Calendar className="h-5 w-5 text-white" />}
              label="Tanggal Lahir"
              value={formatDate(user.tanggal_lahir)}
              bgColor="from-indigo-500 to-purple-600"
            />
          )}

          {user.jenis_kelamin && (
            <DetailItem 
              icon={<User className="h-5 w-5 text-white" />}
              label="Jenis Kelamin"
              value={user.jenis_kelamin}
              bgColor="from-pink-500 to-rose-600"
            />
          )}

          {user.pekerjaan && (
            <DetailItem 
              icon={<Briefcase className="h-5 w-5 text-white" />}
              label="Pekerjaan"
              value={user.pekerjaan}
              bgColor="from-yellow-500 to-orange-600"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}

function DetailItem({ icon, label, value, bgColor }: DetailItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-bold text-gray-900 mt-1 break-words">{value}</p>
      </div>
    </div>
  );
}