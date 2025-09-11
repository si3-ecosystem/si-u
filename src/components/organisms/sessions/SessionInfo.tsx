"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AccessSetupStep from "@/components/organisms/sessions/AccessSetup"
import POAPSetupStep from "@/components/organisms/sessions/PoapSetup"
import QuizSetupStep from "@/components/organisms/sessions/QuizSetupStep"
import { X, Calendar, Clock } from "lucide-react"

interface CreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateSessionModal({ isOpen, onClose }: CreateSessionModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [enablePOAP, setEnablePOAP] = useState(true)
  const [attendanceRequirement, setAttendanceRequirement] = useState("30 mins")
  const [claimMethod, setClaimMethod] = useState("Auto-mint")

  const [enableQuiz, setEnableQuiz] = useState(true)
  const [passPercentage, setPassPercentage] = useState("70%")

  if (!isOpen) return null

  const steps = [
    { number: 1, title: "Session Info", completed: currentStep > 1, active: currentStep === 1 },
    { number: 2, title: "Access Setup", completed: currentStep > 2, active: currentStep === 2 },
    { number: 3, title: "POAP Setup", completed: currentStep > 3, active: currentStep === 3 },
    { number: 4, title: "Quiz Setup", completed: false, active: currentStep === 4 },
  ]

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("Saving session as draft...")
    onClose()
  }

  const handleContinueQuizSetup = () => {
    console.log("Continuing to quiz setup...")
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
              <Input placeholder="Session Title..." className="w-full" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <Textarea placeholder="Session description..." className="w-full min-h-[100px] resize-none" />
            </div>

            {/* Duration and Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Duration</label>
                <Select defaultValue="60">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">60 mins</SelectItem>
                    <SelectItem value="90">90 mins</SelectItem>
                    <SelectItem value="120">120 mins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Date</label>
                <div className="relative">
                  <Input defaultValue="March, 4th, 2025" className="w-full pr-10" />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Start Time and End Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Start Time</label>
                <div className="relative">
                  <Input defaultValue="10:40 am" className="w-full pr-10" />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">End Time</label>
                <div className="relative">
                  <Input defaultValue="11:40 am" className="w-full pr-10" />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Time Zone</label>
              <Select defaultValue="cet">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cet">(GMT+01:00) Central European Standard Time</SelectItem>
                  <SelectItem value="utc">(GMT+00:00) Coordinated Universal Time</SelectItem>
                  <SelectItem value="est">(GMT-05:00) Eastern Standard Time</SelectItem>
                  <SelectItem value="pst">(GMT-08:00) Pacific Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return <AccessSetupStep />

      case 3:
        return (
          <POAPSetupStep
            enablePOAP={enablePOAP}
            setEnablePOAP={setEnablePOAP}
            attendanceRequirement={attendanceRequirement}
            setAttendanceRequirement={setAttendanceRequirement}
            claimMethod={claimMethod}
            setClaimMethod={setClaimMethod}
          />
        )

      case 4:
        return (
          <QuizSetupStep
            enableQuiz={enableQuiz}
            setEnableQuiz={setEnableQuiz}
            passPercentage={passPercentage}
            setPassPercentage={setPassPercentage}
            onSaveDraft={handleSaveDraft}
            onContinue={handleContinueQuizSetup}
          />
        )

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Step {currentStep} content coming soon...</p>
            </div>
          </div>
        )
    }
  }

  const renderFooter = () => {
    if (currentStep === 4) {
      return null // Quiz setup has its own buttons
    }

    return (
      <div className="p-6 border-t">
        <Button onClick={handleContinue} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active
                      ? "bg-purple-600 text-white"
                      : step.completed
                        ? "bg-gray-400 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step.active ? "text-purple-600" : step.completed ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Footer */}
        {renderFooter()}
      </div>
    </div>
  )
}
