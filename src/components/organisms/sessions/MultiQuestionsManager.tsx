"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
  isCompleted: boolean
}

interface MultiQuestionManagerProps {
  onSaveDraft: () => void
  onFinish: () => void
}

export default function MultiQuestionManager({ onSaveDraft, onFinish }: MultiQuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is DAO Governance?",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      correctAnswer: 2,
      isCompleted: true,
    },
  ])

  const [currentQuestion, setCurrentQuestion] = useState("")
  const [answers, setAnswers] = useState(["", "", ""])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questionType, setQuestionType] = useState("Multiple Choice (single correct answer)")

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleAddQuestion = () => {
    if (currentQuestion && answers.some((a) => a.trim()) && selectedAnswer !== null) {
      const newQuestion: Question = {
        id: questions.length + 1,
        question: currentQuestion,
        answers: answers.filter((a) => a.trim()),
        correctAnswer: selectedAnswer,
        isCompleted: true,
      }
      setQuestions([...questions, newQuestion])

      // Reset form for next question
      setCurrentQuestion("")
      setAnswers(["", "", ""])
      setSelectedAnswer(null)
    }
  }

  const handleEditQuestion = (id: number) => {
    console.log("[v0] Editing question", id)
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Completed Questions */}
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <h3 className="text-base font-medium text-gray-900">Question {question.id}</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Correct Answer Selected</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditQuestion(question.id)}
                className="text-gray-600 border-gray-300 hover:bg-gray-100"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteQuestion(question.id)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Current Question Form */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900">Question {questions.length + 1}</h3>

        <Input
          placeholder="Write the question"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          className="w-full"
        />

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Answer Options</h4>
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setSelectedAnswer(index)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index ? "border-purple-600 bg-purple-600" : "border-gray-300 bg-white"
                }`}
              >
                {selectedAnswer === index && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleAddQuestion}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!currentQuestion || !answers.some((a) => a.trim()) || selectedAnswer === null}
        >
          Add Question
        </Button>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onSaveDraft} className="px-6 py-2 bg-transparent">
          Save into Draft
        </Button>
        <Button onClick={onFinish} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
          Finish
        </Button>
      </div>
    </div>
  )
}
