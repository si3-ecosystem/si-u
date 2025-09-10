"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import QuizQuestionsSection from "@/components/organisms/sessions/QuizQuestions"

interface QuizSetupStepProps {
  enableQuiz: boolean
  setEnableQuiz: (value: boolean) => void
  passPercentage: string
  setPassPercentage: (value: string) => void
  onSaveDraft: () => void
  onContinue: () => void
}

export default function QuizSetupStep({
  enableQuiz,
  setEnableQuiz,
  passPercentage,
  setPassPercentage,
  onSaveDraft,
  onContinue,
}: QuizSetupStepProps) {
  const [showQuestions, setShowQuestions] = useState(false)

  const handleContinueQuizSetup = () => {
    setShowQuestions(true)
  }

  const handleAddQuestion = () => {
    console.log("Adding new question...")
    // This would open a question creation modal/form
  }

  if (showQuestions) {
    return (
      <QuizQuestionsSection
        sessionTitle="Mastering DAO Governance"
        sessionDate="April 25, 2025 | 2:00 PM"
        onAddQuestion={handleAddQuestion}
        onSaveDraft={onSaveDraft}
        onContinue={onContinue}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Enable Quiz Section */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Enable Quiz</h3>
          <Switch checked={enableQuiz} onCheckedChange={setEnableQuiz} />
        </div>
        <p className="text-sm text-gray-500">Add a quiz users must complete after this session.</p>
      </div>

      {/* Pass Percentage */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">Pass Percentage</label>
        <Select value={passPercentage} onValueChange={setPassPercentage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select pass percentage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50%">50%</SelectItem>
            <SelectItem value="60%">60%</SelectItem>
            <SelectItem value="70%">70%</SelectItem>
            <SelectItem value="80%">80%</SelectItem>
            <SelectItem value="90%">90%</SelectItem>
            <SelectItem value="100%">100%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Set Quiz Questions Section */}
      <div className="text-center py-8 space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Set Quiz Questions After Saving</h3>
        <p className="text-sm text-gray-500">Once saved, return to create questions and answers.</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onSaveDraft} className="flex-1 bg-transparent">
          Save into Draft
        </Button>
        <Button onClick={handleContinueQuizSetup} className="flex-1 bg-purple-600 hover:bg-purple-700">
          Continue Quiz Setup
        </Button>
      </div>
    </div>
  )
}
