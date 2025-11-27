'use client';

import { useState, useEffect } from 'react';
import { TARGET_DATE } from '@/lib/config';
import { CountdownTime } from '@/lib/types';

function calculateTimeLeft(): CountdownTime {
  const now = new Date().getTime();
  const target = TARGET_DATE.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isComplete: false
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (timeLeft.isComplete) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl md:text-6xl font-bold text-pink-500 animate-pulse">
          🎉 The day is here! 🎉
        </div>
        <p className="text-xl text-gray-600 mt-4">Juntos</p>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Minutos' },
    { value: timeLeft.seconds, label: 'Segundos' }
  ];

  return (
    <div className="text-center py-6">
      <p className="text-sm text-gray-500 mb-4">Cada vez mas cerca...</p>
      <div className="flex justify-center gap-3 md:gap-6">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="bg-white/70 backdrop-blur rounded-2xl p-3 md:p-5 shadow-lg min-w-[70px] md:min-w-[90px]"
          >
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

