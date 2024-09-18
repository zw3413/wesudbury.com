import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current) {
        const windowHeight = window.innerHeight;
        modalRef.current.style.maxHeight = `${windowHeight - 40}px`; // 20px padding top and bottom
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-5">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-lg overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        <div className="sticky top-0 bg-white p-4 border-b">
          <button onClick={onClose} className="float-right text-xl">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;