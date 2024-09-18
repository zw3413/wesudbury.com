'use client';

import { useState } from 'react';
import { FaShare } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Assume you have a Modal component
import Image from 'next/image';

export default function ShareButton() {
  const cardOptions = [
    { id: 'ride-details-card-mini', label: 'Mini' },
    { id: 'ride-details-card-standard', label: 'Standard' },
    { id: 'ride-details-card-large', label: 'Large' },


  ];

  const [isShared, setIsShared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('ride-details-card-standard');
  const [previewImage, setPreviewImage] = useState('');

  const generatePreview = async (cardId: string) => {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    try {
      const canvas = await html2canvas(cardElement);
      const imageDataUrl = canvas.toDataURL('image/png');
      setPreviewImage(imageDataUrl);
    } catch (err) {
      console.error('Error generating preview:', err);
    }
  };

  const handleCardSelect = async (cardId: string) => {
    setSelectedCardId(cardId);
    await generatePreview(cardId);
    setIsModalOpen(true);
  };

  const captureAndShare = async () => {
    if (!selectedCardId) {
      console.error('No card selected');
      return;
    }

    try {
      const imageBlob = await fetch(previewImage).then(res => res.blob());
      const filesArray = [
        new File([imageBlob], 'ride_details.png', { type: 'image/png' })
      ];

      if (navigator.share && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } else {
        // Fallback for browsers that don't support sharing files
        const imageUrl = URL.createObjectURL(imageBlob);
        window.open(imageUrl, '_blank');
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error('Error capturing or sharing:', err);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => {setIsModalOpen(true);  generatePreview(selectedCardId);}}
        className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(54,89,108)] hover:bg-[rgb(44,79,98)] text-white rounded-lg font-semibold transition duration-300"
      >
        <FaShare className="mr-2" />
        {isShared ? 'Shared!' : 'Share'}
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Select a card to share</h2>
        <div className=" mb-4 flex justify-around">
          {cardOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleCardSelect(option.id)}
              className={` p-2 border rounded-3xl ${selectedCardId === option.id ? 'border-blue-500' : 'border-gray-300'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {previewImage && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <Image src={previewImage} alt="Preview" width={500} height={300} className="max-w-full h-auto" />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={captureAndShare}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!selectedCardId}
          >
            Share
          </button>
        </div>
      </Modal>
    </div>
  );
}