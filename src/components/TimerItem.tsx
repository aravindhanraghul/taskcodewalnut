import React, { useEffect, useRef, useState } from 'react';
import { Trash2, RotateCcw, Pencil } from 'lucide-react';
import { Timer } from '../types/timer';
import { formatTime } from '../utils/time';
import { useTimerStore } from '../store/useTimerStore';
import { toast } from 'sonner'; // Assuming you're using sonner for snack bars
import { EditTimerModal } from './EditTimerModal';
import { TimerAudio } from '../utils/audio';
import { TimerControls } from './TimerControls';
import { TimerProgress } from './TimerProgress';

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { toggleTimer, deleteTimer, updateTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const intervalRef = useRef<number | null>(null); // Holds interval for each timer instance
  const timerAudio = TimerAudio.getInstance(); // Singleton for audio control
  const hasEndedRef = useRef(false);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        updateTimer(timer.id);

        if (timer.remainingTime <= 1 && !hasEndedRef.current) {
          hasEndedRef.current = true;

          // Play the notification sound and ensure it keeps playing
          timerAudio.play().catch(console.error);

          // Display the snack bar notification
          toast.success(`Timer "${timer.title}" has ended!`, {
            duration: Infinity, // Set to keep the snack bar open indefinitely
            action: {
              label: 'Dismiss',
              onClick: () => {
                timerAudio.stop(); // Stop the sound when snack bar is dismissed
              },
            },
          });
        }
      }, 1000);
    }

    // Cleanup: clear interval when the timer stops or component unmounts
    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [timer.isRunning, timer.id, timer.remainingTime, timer.title, timerAudio, updateTimer]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    timerAudio.stop();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    if (timer.remainingTime <= 0) {
      hasEndedRef.current = false;
    }
    toggleTimer(timer.id);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-102 overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-10 opacity-5">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
            <path
              d="M50 20V50L70 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{timer.title}</h3>
              <p className="text-gray-600 mt-1">{timer.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
                title="Edit Timer"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
                title="Restart Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Delete Timer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(timer.remainingTime)} {/* Display the remaining time */}
            </div>

            <TimerProgress progress={(timer.remainingTime / timer.duration) * 100} />

            <TimerControls
              isRunning={timer.isRunning}
              remainingTime={timer.remainingTime}
              duration={timer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <EditTimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};