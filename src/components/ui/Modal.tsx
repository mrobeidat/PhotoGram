import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Cancel';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, containerRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => {
        setShowModal(true);
      }, 10);
      document.body.classList.add('overflow-hidden', 'touch-action-none');
      if (containerRef.current) {
        containerRef.current.classList.add('overflow-hidden');
      }
    } else {
      setShowModal(false);
      setTimeout(() => {
        setMounted(false);
        document.body.classList.remove('overflow-hidden', 'touch-action-none');
        if (containerRef.current) {
          containerRef.current.classList.remove('overflow-hidden');
        }
      }, 300);
    }

    return () => {
      document.body.classList.remove('overflow-hidden', 'touch-action-none');
      if (containerRef.current) {
        containerRef.current.classList.remove('overflow-hidden');
      }
    };
  }, [isOpen, containerRef]);

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

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`bg-black/30 max-w-92 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl w-full max-w-md mx-4 sm:mx-6 transition-transform duration-300 transform ${showModal ? 'scale-100' : 'scale-95'}`}
        tabIndex={1}
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
    containerRef.current || document.body
  );
};

export default Modal;
