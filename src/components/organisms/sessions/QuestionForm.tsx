"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuestionFormProps {
  onSave?: () => void
  onSaveDraft?: () => void
  onAddQuestion?: () => void
}

export default function QuestionForm({ onSave, onSaveDraft, onAddQuestion }: QuestionFormProps) {
  const [questionType, setQuestionType] = useState("Multiple Choice (single correct answer)")
  const [question, setQuestion] = useState("")
  const [answers, setAnswers] = useState(["", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState(2) // Answer 3 is selected by default as shown in screenshot

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  return (
    <div className="space-y-6">
      {/* Question Type */}
      <div className="space-y-2">
        <Label htmlFor="question-type" className="text-sm font-medium text-gray-900">
          Question Type
        </Label>
        <Select value={questionType} onValueChange={setQuestionType}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Multiple Choice (single correct answer)">
              Multiple Choice (single correct answer)
            </SelectItem>
            <SelectItem value="Multiple Choice (multiple correct answers)">
              Multiple Choice (multiple correct answers)
            </SelectItem>
            <SelectItem value="True/False">True/False</SelectItem>
            <SelectItem value="Short Answer">Short Answer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question Input */}
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm font-medium text-gray-900">
          Question 1
        </Label>
        <Input
          id="question"
          placeholder="Write the question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-900">Answer Options</Label>
        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCorrectAnswer(index)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  correctAnswer === index ? "border-purple-600 bg-purple-600" : "border-gray-300 bg-white"
                }`}
              >
                {correctAnswer === index && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
              <Input
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add Question Button */}
      <Button onClick={onAddQuestion} className="bg-purple-600 hover:bg-purple-700 text-white">
        Add Question
      </Button>

      {/* Bottom Actions */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onSaveDraft} className="text-gray-700 border-gray-300 bg-transparent">
          Save into Draft
        </Button>
        <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700 text-white">
          Save & Continue
        </Button>
      </div>
    </div>
  )
}
