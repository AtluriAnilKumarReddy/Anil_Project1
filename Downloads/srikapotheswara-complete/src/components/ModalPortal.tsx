import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ModalPortalProps {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
}

export default function ModalPortal({ children, onClose, open }: ModalPortalProps) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      {/* Scrollable content area */}
      <div
        className="fixed inset-0 overflow-y-auto"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="flex items-start justify-center min-h-full py-6 px-4">
          <div onClick={(e) => e.stopPropagation()} className="relative my-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
