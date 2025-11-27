'use client';

interface DistanceDisplayProps {
  distance: number | null;
}

export default function DistanceDisplay({ distance }: DistanceDisplayProps) {
  if (distance === null) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Esperando datos de ubicacion...</p>
      </div>
    );
  }

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return 'Together! 💕';
    }
    if (km >= 1000) {
      return `${(km / 1000).toFixed(1)}k km`;
    }
    return `${km} km`;
  };

  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-6 py-3 shadow-lg">
        <span className="text-2xl">📍</span>
        <span className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {formatDistance(distance)}
        </span>
        <span className="text-2xl">❤️</span>
        <span className="text-2xl">📍</span>
      </div>
      <p className="text-gray-500 text-sm mt-2">between us right now</p>
    </div>
  );
}

