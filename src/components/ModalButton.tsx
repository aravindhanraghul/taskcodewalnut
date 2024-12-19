import React from 'react';

interface ModalButtonProps {
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  isDisabled?: boolean;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ label, onClick, color = 'primary', icon, isDisabled = false }) => {
  const buttonClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`p-2 rounded-lg ${buttonClasses[color]} flex items-center gap-2 transition-colors disabled:opacity-50`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
