'use client';

import { useState } from 'react';
import { FaShare } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import Modal from './Modal';
import Image from 'next/image';

export default function ShareButton({  }: { rideId: string, lang: string }) {
  const [isShared, setIsShared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('ride-details-card-standard');
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cardOptions = [
    { id: 'ride-details-card-mini', label: 'Mini' },
    { id: 'ride-details-card-standard', label: 'Standard' },
    { id: 'ride-details-card-large', label: 'Large' }
  ];

  const generatePreview = async (cardId: string) => {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
      console.error('Card element not found');
      setError('Card element not found');
      return;
    }
    try {
      const canvas = await html2canvas(cardElement, {
        logging: true, // Enable logging for debugging
        useCORS: true, // Try to load images from other domains
        allowTaint: true, // Allow loading of tainted images
      });
      const imageBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );
      const imageUrl = URL.createObjectURL(imageBlob);
      setPreviewImage(imageUrl);
      setError(null);
    } catch (err) {
      alert('error');
      console.error('Error generating preview:', err);
      setError('Failed to generate preview. Please try another option.');
    }
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    generatePreview(cardId);
  };

  const captureAndShare = async () => {
    if (!selectedCardId) {
      console.error('No card selected');
      return;
    }

    try {
      const cardElement = document.getElementById(selectedCardId);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const canvas = await html2canvas(cardElement);
      const imageBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      const filesArray = [
        new File([imageBlob], 'ride_details.png', { type: 'image/png' })
      ];

      if (navigator.share && navigator.canShare({ files: filesArray })) {
        await navigator.share({
           files: filesArray,
          // title: 'Ride Details',
          // text: `Check out this ride from ${rideDetails.from_city} to ${rideDetails.to_city}`,
          // url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/rideshare/ride/${rideId}`,
        });
      } else {
        // Fallback for browsers that don't support sharing files
        const imageUrl = URL.createObjectURL(imageBlob);
        window.open(imageUrl, '_blank');
      }
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error('Error capturing or sharing:', err);
      setError('Failed to share. Please try again.');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => { setIsModalOpen(true); generatePreview(selectedCardId); }}
        className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(40,76,96)] hover:bg-[rgb(44,79,98)] text-white rounded-lg font-semibold transition duration-300"
      >
        <FaShare className="mr-2" />
        {isShared ? 'Shared!' : 'Share'}
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
 
        <div className="mb-8 flex justify-around">
          {cardOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleCardSelect(option.id)}
              className={`p-2 border rounded-3xl ${selectedCardId === option.id ? 'border-blue-500' : 'border-gray-300'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        {previewImage && (
          <div className="mb-4">
            {/* <h3 className="text-lg font-semibold mb-2">Preview</h3> */}
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