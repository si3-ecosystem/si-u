"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Calendar, Clock, Globe, Award, Info } from "lucide-react"

interface CreateSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateSessionModal({ open, onOpenChange }: CreateSessionModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sessionType: "Web3 Education",
    date: "March, 4th, 2025",
    startTime: "10:40 am",
    endTime: "11:40 am",
    duration: "60 mins",
    timezone: "(GMT+01:00) Central European Standard Time",
    accessType: "Public",
    maxParticipants: "100",
    proofOfAttendance: true,
    claimMethod: "Auto-mint",
    nftTitle: "",
    claimOpens: "",
    claimCloses: "",
    attendanceRequirement: "30 mins",
  })

  const steps = [
    { number: 1, title: "Session Info", active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: "Access Setup", active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: "POAP Setup", active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: "Review", active: currentStep === 4, completed: false },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    onOpenChange(false)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed
                  ? "bg-purple-600 text-white"
                  : step.active
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span className={`text-xs mt-1 ${step.active ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-px mx-4 ${step.completed ? "bg-purple-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderSessionInfo = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Session Title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-900">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Session description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">Session Type</Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value) => setFormData({ ...formData, sessionType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web3 Education">Web3 Education</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">Date</Label>
            <div className="relative mt-1">
              <Input value={formData.date} readOnly className="pr-10" />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">Start Time</Label>
            <div className="relative mt-1">
              <Input value={`${formData.startTime} / ${formData.endTime}`} readOnly className="pr-10" />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">Duration</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 mins">30 mins</SelectItem>
                <SelectItem value="60 mins">60 mins</SelectItem>
                <SelectItem value="90 mins">90 mins</SelectItem>
                <SelectItem value="120 mins">120 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900">Time Zone</Label>
          <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="(GMT+01:00) Central European Standard Time">
                (GMT+01:00) Central European Standard Time
              </SelectItem>
              <SelectItem value="(GMT+00:00) Greenwich Mean Time">(GMT+00:00) Greenwich Mean Time</SelectItem>
              <SelectItem value="(GMT-05:00) Eastern Standard Time">(GMT-05:00) Eastern Standard Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderAccessSetup = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">Access Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {["Public", "Token-Gated", "Private"].map((type) => (
              <Button
                key={type}
                variant={formData.accessType === type ? "default" : "outline"}
                className={`${
                  formData.accessType === type
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setFormData({ ...formData, accessType: type })}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Max Participant</Label>
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">(Optional)</span>
          </div>
          <Input
            placeholder="Set max capacity..."
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )

  const renderPOAPSetup = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-900">Enable Proof of Attendance</span>
          </div>
          <Switch
            checked={formData.proofOfAttendance}
            onCheckedChange={(checked) => setFormData({ ...formData, proofOfAttendance: checked })}
          />
        </div>

        <p className="text-sm text-gray-600 -mt-2">
          Automatically reward attendees with a collectible badge for joining this session.
        </p>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Claim Method</Label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Select
            value={formData.claimMethod}
            onValueChange={(value) => setFormData({ ...formData, claimMethod: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Auto-mint">Auto-mint</SelectItem>
              <SelectItem value="Manual-claim">Manual-claim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900">NFT Title</Label>
          <Input
            placeholder="POAP Title (default to Session Title)"
            value={formData.nftTitle}
            onChange={(e) => setFormData({ ...formData, nftTitle: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-900">Claim Opens</Label>
            <Input
              placeholder="dd/mm/yyyy"
              value={formData.claimOpens}
              onChange={(e) => setFormData({ ...formData, claimOpens: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-900">Claim Closes</Label>
            <Input
              placeholder="dd/mm/yyyy"
              value={formData.claimCloses}
              onChange={(e) => setFormData({ ...formData, claimCloses: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className="text-sm font-medium text-gray-900">Attendance Requirement</Label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Select
            value={formData.attendanceRequirement}
            onValueChange={(value) => setFormData({ ...formData, attendanceRequirement: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 mins">15 mins</SelectItem>
              <SelectItem value="30 mins">30 mins</SelectItem>
              <SelectItem value="45 mins">45 mins</SelectItem>
              <SelectItem value="60 mins">60 mins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderReview = () => (
    <div className="px-6 pb-6">
      <div className="space-y-6">
        {/* Session Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Session Info</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">Mastering DAO Governance</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">August 15, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">10am to 11am</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">(GMT+01:00) Central European Standard Time</span>
            </div>
          </div>
        </div>

        {/* Access Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Access</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-900">Public</span>
            </div>
            <div className="text-sm text-gray-600">Max Participants: 100</div>
          </div>
        </div>

        {/* Proof of Attendance Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Proof of Attendance</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-900">Enabled</span>
            </div>
            <div className="text-sm text-gray-600">Claim Method: Auto-Mint</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderSessionInfo()
      case 2:
        return renderAccessSetup()
      case 3:
        return renderPOAPSetup()
      case 4:
        return renderReview()
      default:
        return renderSessionInfo()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with DialogTitle */}
        <div className="flex items-center justify-between p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New Session</DialogTitle>
          {/* <Button variant="ghost" size="sm" onClick={handleClose} className="p-1">
            <X className="w-5 h-5" />
          </Button> */}
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {renderCurrentStep()}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-2 border-t">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
            Back
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              Save Draft
            </Button>
            <Button
              onClick={currentStep === 4 ? handleClose : handleNext}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentStep === 4 ? "Go Live" : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}