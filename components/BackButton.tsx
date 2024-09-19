'use client'

import { useRouter } from 'next/navigation'

type BackButtonProps = {
  url: string
}

export default function BackButton({ url }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(url)
  }

  return (
    <button 
      onClick={handleBack}
      className="absolute top-4 left-4 text-[rgb(40,76,96)] hover:text-[rgb(255,183,77)] transition-colors"
      aria-label="Back"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </button>
  )
}