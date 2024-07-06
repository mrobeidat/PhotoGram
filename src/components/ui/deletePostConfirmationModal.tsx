import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Cancel";
import { Button } from "./button";

interface DeletePostConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DeletePostConfirmationModal: React.FC<DeletePostConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  containerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleBodyClass = (action: "add" | "remove") => {
      document.body.classList[action]("overflow-hidden", "touch-action-none");
      if (containerRef.current) {
        containerRef.current.classList[action]("overflow-hidden");
      }
    };

    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowModal(true), 10);
      handleBodyClass("add");
    } else {
      setShowModal(false);
      setTimeout(() => {
        setMounted(false);
        handleBodyClass("remove");
      }, 300);
    }

    return () => handleBodyClass("remove");
  }, [isOpen, containerRef]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 !z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`bg-black/30 max-w-92 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl w-full max-w-md mx-4 sm:mx-6 transition-transform duration-300 transform ${
          showModal ? "scale-100" : "scale-95"
        }`}
        tabIndex={1}
        onKeyDown={handleEscapePress}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div onClick={onClose} className="float-right cursor-pointer">
            <CloseIcon />
          </div>
          <h3 className="body-bold md:h3-bold mb-8">Delete Post</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-2">
              <Button onClick={onClose} className="bg-white/20 rounded-full">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-red rounded-full cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    containerRef.current || document.body
  );
};

export default DeletePostConfirmationModal;
