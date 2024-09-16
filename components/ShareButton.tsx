'use client';

import { useState } from 'react';
import { FaShare } from 'react-icons/fa';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isShared, setIsShared] = useState(false);

  const shareRide = async () => {
    const shareData = { title, text, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying the URL to clipboard
      navigator.clipboard.writeText(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div  className="w-full">
        <button
          onClick={shareRide}
          className="w-full flex items-center justify-center px-4 py-2 bg-[rgb(54,89,108)] hover:bg-[rgb(44,79,98)] text-white rounded-lg font-semibold transition duration-300"
        >
          <FaShare className="mr-2" />
          {isShared ? 'Shared!' : 'Share'}
        </button>
    </div>
  );
}