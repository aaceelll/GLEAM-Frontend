"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function SuccessDialog({ 
  isOpen, 
  onClose, 
  title = "Berhasil!", 
  message = "Ulasan Anda telah tersimpan. Terima kasih atas feedback-nya!" 
}: SuccessDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}