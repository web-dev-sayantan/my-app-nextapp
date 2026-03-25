"use client";

import { FiDownload } from "react-icons/fi";

export default function PrintReceiptButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-green-900 font-bold py-2 rounded-lg hover:bg-gray-100 transition"
    >
      <FiDownload /> Download Receipt
    </button>
  );
}
