'use client';

import Image from 'next/image';
import { UserStatus } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';

interface UserCardProps {
  userStatus: UserStatus;
  showCity: boolean;
  isCurrentUser: boolean;
  onMessageEdit?: () => void;
}

export default function UserCard({ userStatus, showCity, isCurrentUser, onMessageEdit }: UserCardProps) {
  const { token, logout } = useAuth();
  const { error: geoError, loading: geoLoading, refreshing, refreshLocation } = useGeolocation(token);
  const { user, location, message } = userStatus;

  const locationDisplay = location
    ? showCity
      ? location.city
      : location.country
    : 'Sin ubicación...';

  return (
    <div className="p-6 flex flex-col items-center relative">
      {/* Message bubble */}
      {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#808000] text-white text-sm px-4 py-2 rounded-full shadow-md max-w-[200px] truncate">
        {message?.text || '...'}
      </div> */}

      {/* Profile photo */}
      <div className="relative mt-4 mb-4">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={user.photo}
            alt={user.name}
            width={144}
            height={144}
            className="object-cover w-full h-full"
            onError={(e) => {
              // Fallback to initial if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-[#808000]">${user.name.charAt(0)}</div>`;
            }}
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>

      {/* Location */}
      <div className="flex flex-col items-center gap-1 text-gray-500 text-sm mt-1">
        <div>
          <span>📍</span>
          <span>{locationDisplay}</span>
        </div>
        <div>
          {/* Manual refresh button */}
          <button
            onClick={isCurrentUser ? refreshLocation : undefined}
            disabled={!isCurrentUser || refreshing || geoLoading}
            className="flex items-center gap-2 px-4 py-2 disabled:hidden cursor-pointer"
          >
            <span>{refreshing ? 'Actualizando...' : 'Actualizar mi ubicación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

