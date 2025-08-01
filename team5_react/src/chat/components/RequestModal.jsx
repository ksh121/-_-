// src/components/RequestModal.jsx

import React, { useEffect, useState } from "react";

export default function RequestModal({ isOpen, onClose, onSubmit, defaultMessage, defaultPrice }) {
  const [message, setMessage] = useState(defaultMessage || "");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setMessage(defaultMessage || "");
    setPrice(defaultPrice != null ? String(defaultPrice) : "");
    console.log(" -> price 확인하기: ", defaultPrice )
  }, [defaultMessage, defaultPrice]);

  const handleSubmit = () => {
    if (!price) {
      alert("금액을 입력해주세요.");
      return;
    }
    onSubmit({ message, price: Number(price) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
        <h2 className="text-lg font-bold mb-4">📝 요청 정보 입력</h2>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">메시지</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">요청 금액 (₩)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            요청 보내기
          </button>
        </div>
      </div>
    </div>
  );
}