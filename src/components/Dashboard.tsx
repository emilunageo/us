'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useStatus } from '@/hooks/useStatus';
import Countdown from './Countdown';
import UserCard from './UserCard';
import DistanceDisplay from './DistanceDisplay';
import MessageModal from './MessageModal';

export default function Dashboard() {
  const { token, logout } = useAuth();
  useGeolocation(token); // Initialize geolocation tracking
  const { status, loading: statusLoading, updateMessage } = useStatus(token);
  const [showMessageModal, setShowMessageModal] = useState(false);

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#808000] border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#808000]">

        </h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          Salir
        </button>
      </div>

      {/* Countdown */}
      <Countdown />

      {/* Distance Display */}
      <DistanceDisplay distance={status?.distance ?? null} />

      {/* User profiles */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
          <UserCard
            userStatus={status.currentUser}
            showCity={status.showCity}
            isCurrentUser={true}
            onMessageEdit={() => setShowMessageModal(true)}
          />
          <UserCard
            userStatus={status.otherUser}
            showCity={status.showCity}
            isCurrentUser={false}
          />
        </div>
      )}

      {/* Message modal */}
      {showMessageModal && status && (
        <MessageModal
          currentMessage={status.currentUser.message?.text || ''}
          onSave={updateMessage}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}

