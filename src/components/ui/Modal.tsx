import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Cancel';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.focus();
    }
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-black/50 max-w-92 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl w-full max-w-md mx-4 sm:mx-6"
        tabIndex={-1}
        onKeyDown={handleEscapePress}
      >
        <div className="p-4">
          <div onClick={onClose} className="float-right cursor-pointer">
            <CloseIcon />
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
