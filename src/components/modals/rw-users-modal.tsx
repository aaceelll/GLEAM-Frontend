"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users as UsersIcon, User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface RWUser {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  alamat: string;
  address?: string;
  kelurahan: string;
  rw: string;
}

interface RWUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  kelurahan: string;
  rw: string;
  onUserClick: (user: RWUser) => void;
}

export function RWUsersModal({ 
  isOpen, 
  onClose, 
  kelurahan, 
  rw,
  onUserClick 
}: RWUsersModalProps) {
  const [users, setUsers] = useState<RWUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && kelurahan && rw) {
      fetchUsers();
    }
  }, [isOpen, kelurahan, rw]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/locations/users-by-rw`, {
        params: { kelurahan, rw }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent
        className="w-[92vw] max-w-[600px] sm:max-w-2xl max-h-[80vh] sm:max-h-[85vh] overflow-hidden flex flex-col rounded-2xl"
      >
      <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {kelurahan} - {rw}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? "Memuat data..." : `Total ${users.length} pengguna terdaftar`}
            </p>
          </div>
        </div>
      </DialogHeader>

      {/* body scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500">Memuat data pengguna...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <UsersIcon className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Belum ada pengguna terdaftar</p>
            <p className="text-sm text-gray-400 mt-1">di wilayah {kelurahan} - {rw}</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onUserClick(user);
                onClose();
              }}
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                  {user.nama}
                </h3>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {user.address || user.alamat || "Alamat tidak tersedia"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </DialogContent>
  </Dialog>
  );
}