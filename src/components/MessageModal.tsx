'use client';

import { useState } from 'react';

interface MessageModalProps {
  currentMessage: string;
  onSave: (message: string) => Promise<void>;
  onClose: () => void;
}

export default function MessageModal({ currentMessage, onSave, onClose }: MessageModalProps) {
  const [message, setMessage] = useState(currentMessage);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(message);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cambiar mensaje</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
          className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:border-[#808000] focus:ring-2 focus:ring-[#808000]/20 transition-all outline-none resize-none"
          placeholder="¿Qué estás pensando?"
          autoFocus
        />

        <div className="text-right text-sm text-gray-400 mb-4">
          {message.length}/200
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2 px-4 bg-[#808000] text-white rounded-xl hover:bg-[#666600] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

