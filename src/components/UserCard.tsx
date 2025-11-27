'use client';

import Image from 'next/image';
import { UserStatus } from '@/lib/types';

interface UserCardProps {
  userStatus: UserStatus;
  showCity: boolean;
  isCurrentUser: boolean;
  onMessageEdit?: () => void;
}

export default function UserCard({ userStatus, showCity, isCurrentUser, onMessageEdit }: UserCardProps) {
  const { user, location, message } = userStatus;

  const locationDisplay = location
    ? showCity
      ? location.city
      : location.country
    : 'No cargo la ubicaion...';

  return (
    <div className="bg-white/70 backdrop-blur rounded-3xl shadow-lg p-6 flex flex-col items-center relative">
      {/* Message bubble */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm px-4 py-2 rounded-full shadow-md max-w-[200px] truncate">
        {message?.text || '...'}
      </div>

      {/* Profile photo */}
      <div className="relative mt-4 mb-4">
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-pink-200 to-purple-200">
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
              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-purple-500">${user.name.charAt(0)}</div>`;
            }}
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
      
      {/* Location */}
      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
        <span>📍</span>
        <span>{locationDisplay}</span>
      </div>

      {/* Edit message button for current user */}
      {isCurrentUser && onMessageEdit && (
        <button
          onClick={onMessageEdit}
          className="mt-4 text-sm text-purple-500 hover:text-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Editar Mensaje</span>
        </button>
      )}
    </div>
  );
}

