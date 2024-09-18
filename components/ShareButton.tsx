'use client';

import { useState } from 'react';
import { FaShare } from 'react-icons/fa';
import html2canvas from 'html2canvas';



export default function ShareButton() {
  const largetCardId = 'ride-details-card-large'
  const standardCardId = 'ride-details-card-standard'
  const miniCardId = 'ride-details-card-mini'
  
  const [isShared, setIsShared] = useState(false);
  const [cardId, setCardId] = useState('ride-details-card');

  const captureAndShare = async () => {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    try {
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
  };

  return (
    <div className="w-full">
      <button
        onClick={captureAndShare}
        className="w-full flex items-center justify-center px-4 py-3 bg-[rgb(54,89,108)] hover:bg-[rgb(44,79,98)] text-white rounded-lg font-semibold transition duration-300"
      >
        <FaShare className="mr-2" />
        {isShared ? 'Shared!' : 'Share'}
      </button>
    </div>
  );
}