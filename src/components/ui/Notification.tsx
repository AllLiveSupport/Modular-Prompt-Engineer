import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 text-green-400 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 text-red-400 bg-red-500/10';
      case 'info':
      default:
        return 'border-primary-500/50 text-primary-400 bg-primary-500/10';
    }
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] min-w-[300px] glass-morphism px-6 py-4 rounded-2xl border-l-4 shadow-2xl animate-in slide-in-from-right-8 fade-in duration-300 ${getStyles()}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-sm">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-800/50 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 transition-all duration-300" style={{ width: '100%' }} />
    </div>
  );
};

export default Notification;