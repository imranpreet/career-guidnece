import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
};

const ToastContext = createContext<{
  push: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-lg text-sm max-w-xs break-words ${
              t.type === 'success' ? 'bg-green-100 text-green-800' : t.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
