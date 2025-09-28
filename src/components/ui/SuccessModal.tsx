"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  /** Opsional: ganti tulisan tombol utama */
  primaryText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message = "Registrasi berhasil! Silakan login.",
  primaryText = "OK",
}) => {
  // Tutup dengan ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-live="polite"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pemberitahuan berhasil"
        className="relative w-full max-w-md origin-center rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="p-6 text-center animate-in fade-in zoom-in duration-200">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Berhasil!</h3>
          <p className="mb-6 text-gray-600">{message}</p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
};
