"use client"

import { Button } from "@/components/ui/button"

interface QuizCompletionProps {
  onGoLive: () => void
}

export default function QuizCompletion({ onGoLive }: QuizCompletionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
      {/* Success Icon */}
      <div className="mb-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-purple-600"
        >
          {/* Decorative badge shape */}
          <path
            d="M40 8L45.5 15.5L54.5 12L58 21L67.5 20L68.5 29.5L77 32L75 41.5L80 48L72 54.5L75 63L66.5 67L68.5 76L59 77L54.5 84L45.5 80L40 87L34.5 80L25.5 84L21 77L11.5 76L13.5 67L5 63L8 54.5L0 48L5 41.5L3 32L11.5 29.5L12.5 20L22 21L25.5 12L34.5 15.5L40 8Z"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Checkmark */}
          <path
            d="M28 40L36 48L52 32"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Success Message */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Quiz Setup Completed</h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm">
          Your quiz has been saved and is ready for attendees after the session.
        </p>
      </div>

      {/* Go Live Button */}
      <Button
        onClick={onGoLive}
        className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 text-base font-medium rounded-lg"
      >
        Go Live
      </Button>
    </div>
  )
}
