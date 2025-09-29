"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // ✅ ← ini yang sebelumnya hilang
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsPopupProps {
  open: boolean;
  onAccept: () => void;
}

export function TermsPopup({ open, onAccept }: TermsPopupProps) {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700">
            Syarat dan Persetujuan
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 pt-4 leading-relaxed">
            Dengan ini saya menyatakan bahwa saya setuju untuk ikut
            berpartisipasi dalam penelitian berbasis website ini{" "}
            <span className="font-semibold text-emerald-700">"GLEAM"</span>{" "}
            dengan penuh kesadaran dan tanpa ada paksaan dari siapapun dengan
            kondisi:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-4 text-sm text-gray-700 bg-emerald-50 p-4 rounded-lg">
            <div className="flex gap-3">
              <span className="font-bold text-emerald-700 flex-shrink-0">
                1.
              </span>
              <p className="leading-relaxed">
                Data yang didapatkan dari penelitian ini akan dijaga
                kerahasiaannya dan hanya digunakan untuk kepentingan ilmiah.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-emerald-700 flex-shrink-0">
                2.
              </span>
              <p className="leading-relaxed">
                Saya berhak untuk mengundurkan diri dari penelitian ini kapan
                saja tanpa perlu memberikan alasan apa pun.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2 border-t border-emerald-100">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)} // ✅ pakai !! untuk pastikan boolean
              className="border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-relaxed cursor-pointer text-gray-700"
            >
              Saya menyetujui persyaratan di atas dan bersedia berpartisipasi
              dalam penelitian ini
            </Label>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onAccept}
            disabled={!agreed}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Daftar Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
