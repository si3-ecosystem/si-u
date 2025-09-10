"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import QuestionForm from "@/components/organisms/sessions/QuestionForm"
import MultiQuestionManager from "@/components/organisms/sessions/MultiQuestionsManager"
import QuizCompletion from "@/components/organisms/sessions/QuizCompletion"

interface QuizQuestionsSectionProps {
  sessionTitle: string
  sessionDate: string
  onAddQuestion: () => void
  onSaveDraft: () => void
  onContinue: () => void
}

export default function QuizQuestionsSection({
  sessionTitle,
  sessionDate,
  onAddQuestion,
  onSaveDraft,
  onContinue,
}: QuizQuestionsSectionProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [showMultiQuestionManager, setShowMultiQuestionManager] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const handleAddFirstQuestion = () => {
    setShowQuestionForm(true)
    onAddQuestion()
  }

  const handleSaveQuestion = () => {
    setShowQuestionForm(false)
    setShowMultiQuestionManager(true)
  }

  const handleAddAnotherQuestion = () => {
    // Handle adding another question (could reset form or add to list)
    console.log("[v0] Adding another question")
  }

  const handleFinishQuiz = () => {
    setShowMultiQuestionManager(false)
    setShowCompletion(true)
  }

  const handleGoLive = () => {
    setShowCompletion(false)
    onContinue()
  }

  if (showCompletion) {
    return <QuizCompletion onGoLive={handleGoLive} />
  }

  if (showMultiQuestionManager) {
    return (
      <div className="space-y-6">
        <MultiQuestionManager onSaveDraft={onSaveDraft} onFinish={handleFinishQuiz} />
      </div>
    )
  }

  if (showQuestionForm) {
    return (
      <div className="space-y-6">
        {/* Session Info */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">{sessionTitle}</h2>
          <p className="text-sm text-gray-500">{sessionDate}</p>
        </div>

        {/* Question Form */}
        <QuestionForm onSave={handleSaveQuestion} onSaveDraft={onSaveDraft} onAddQuestion={handleAddAnotherQuestion} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{sessionTitle}</h2>
        <p className="text-sm text-gray-500">{sessionDate}</p>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-600 text-base">No questions added yet</p>
        <Button onClick={handleAddFirstQuestion} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
          Add First Question
        </Button>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onSaveDraft} className="px-6 py-2 bg-transparent">
          Save into Draft
        </Button>
        <Button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
          Continue
        </Button>
      </div>
    </div>
  )
}
