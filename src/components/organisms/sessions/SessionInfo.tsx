"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { X } from "lucide-react"

interface Session {
  _id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  coverImage?: string;
  accessType: 'public' | 'nft' | 'token';
  nftContractAddress?: string;
  tokenAddress?: string;
  tokenAmount?: number;
  enablePOAP?: boolean;
  poapEventId?: string;
  enableQuiz?: boolean;
  quizPassPercentage?: number;
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: Session | null;
  onSave: (data: any) => Promise<{ success: boolean }>;
}

export default function CreateSessionModal({ isOpen, onClose, session, onSave }: CreateSessionModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Session, '_id'>>({
    title: '',
    description: '',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    status: 'draft',
    accessType: 'public',
    enablePOAP: false,
    enableQuiz: false,
  });

  // Initialize form with session data if in edit mode
  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        coverImage: session.coverImage || '',
        accessType: session.accessType || 'public',
        nftContractAddress: session.nftContractAddress || '',
        tokenAddress: session.tokenAddress || '',
        tokenAmount: session.tokenAmount || 0,
        enablePOAP: session.enablePOAP || false,
        poapEventId: session.poapEventId || '',
        enableQuiz: session.enableQuiz || false,
        quizPassPercentage: session.quizPassPercentage || 70,
        questions: session.questions || [],
      });
    } else {
      // Reset form for new session
      setFormData({
        title: '',
        description: '',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'draft',
        accessType: 'public',
        enablePOAP: false,
        enableQuiz: false,
      });
    }
  }, [session, isOpen]);

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: "Session Info", completed: currentStep > 1, active: currentStep === 1 },
    { number: 2, title: "Access Setup", completed: currentStep > 2, active: currentStep === 2 },
    { number: 3, title: "POAP Setup", completed: currentStep > 3, active: currentStep === 3 },
    { number: 4, title: "Quiz Setup", completed: false, active: currentStep === 4 },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined, field: 'startTime' | 'endTime') => {
    if (!date) return;
    
    // Preserve the time part when changing the date
    const currentDate = new Date(formData[field]);
    const newDate = new Date(date);
    newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
    
    setFormData(prev => ({
      ...prev,
      [field]: newDate.toISOString()
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startTime' | 'endTime') => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const date = new Date(formData[field]);
    date.setHours(hours, minutes);
    
    setFormData(prev => ({
      ...prev,
      [field]: date.toISOString()
    }));
  };

  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Session Info
        if (!formData.title.trim()) {
          toast({
            title: "Error",
            description: "Please enter a title for the session.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.description.trim()) {
          toast({
            title: "Error",
            description: "Please enter a description for the session.",
            variant: "destructive",
          });
          return false;
        }
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
          toast({
            title: "Error",
            description: "End time must be after start time.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      case 2: // Access Setup
        if (formData.accessType === 'nft' && !formData.nftContractAddress) {
          toast({
            title: "Error",
            description: "Please enter an NFT contract address.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.accessType === 'token' && (!formData.tokenAddress || !formData.tokenAmount)) {
          toast({
            title: "Error",
            description: "Please enter both token address and required amount.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      case 3: // POAP Setup
        if (formData.enablePOAP && !formData.poapEventId) {
          toast({
            title: "Error",
            description: "Please enter a POAP Event ID.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleContinue = async () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const result = await onSave({
        ...formData,
        status: 'draft'
      });
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await onSave({
        ...formData,
        status: 'scheduled'
      });
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter session title"
                value={formData.title}
                onChange={(e) => handleInputChange(e)}
                name="title"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Enter session description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange(e)}
                name="description"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startTime && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startTime ? format(new Date(formData.startTime), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(formData.startTime)}
                        onSelect={(date) => handleDateChange(date, 'startTime')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={formatTimeForInput(formData.startTime)}
                    onChange={(e) => handleTimeChange(e, 'startTime')}
                    className="w-32"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endTime && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endTime ? format(new Date(formData.endTime), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(formData.endTime)}
                        onSelect={(date) => handleDateChange(date, 'endTime')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={formatTimeForInput(formData.endTime)}
                    onChange={(e) => handleTimeChange(e, 'endTime')}
                    className="w-32"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL (optional)
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage || ''}
                onChange={(e) => handleInputChange(e)}
                name="coverImage"
                disabled={isSubmitting}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Type
              </label>
              <Select 
                value={formData.accessType}
                onValueChange={(value) => handleSelectChange('accessType', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select access type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Anyone can join)</SelectItem>
                  <SelectItem value="nft">NFT Gated</SelectItem>
                  <SelectItem value="token">Token Gated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.accessType === 'nft' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFT Contract Address <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="0x..."
                  value={formData.nftContractAddress || ''}
                  onChange={(e) => handleInputChange(e as any)}
                  name="nftContractAddress"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {formData.accessType === 'token' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="0x..."
                    value={formData.tokenAddress || ''}
                    onChange={(e) => handleInputChange(e as any)}
                    name="tokenAddress"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Token Amount <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formData.tokenAmount || ''}
                    onChange={(e) => handleInputChange(e as any)}
                    name="tokenAmount"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable POAP Distribution</h3>
                <p className="text-sm text-gray-500">Distribute POAPs to attendees after the session</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePOAP"
                  checked={formData.enablePOAP || false}
                  onChange={(e) => 
                    setFormData(prev => ({
                      ...prev,
                      enablePOAP: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="enablePOAP" className="ml-2 text-sm text-gray-700">
                  {formData.enablePOAP ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            </div>

            {formData.enablePOAP && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  POAP Event ID <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter POAP Event ID"
                  value={formData.poapEventId || ''}
                  onChange={(e) => handleInputChange(e as any)}
                  name="poapEventId"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Create a POAP event at{' '}
                  <a 
                    href="https://app.poap.xyz/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    POAP.xyz
                  </a>{' '}
                  and enter the event ID here.
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Quiz</h3>
                <p className="text-sm text-gray-500">Require attendees to pass a quiz to receive a certificate</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableQuiz"
                  checked={formData.enableQuiz || false}
                  onChange={(e) => 
                    setFormData(prev => ({
                      ...prev,
                      enableQuiz: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="enableQuiz" className="ml-2 text-sm text-gray-700">
                  {formData.enableQuiz ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            </div>

            {formData.enableQuiz && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Percentage <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.quizPassPercentage || 70}
                    onChange={(e) => 
                      setFormData(prev => ({
                        ...prev,
                        quizPassPercentage: parseInt(e.target.value) || 70
                      }))
                    }
                    className="w-24"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-gray-700">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum score required to pass the quiz and receive a certificate.
                </p>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Quiz Questions</h4>
                  <div className="space-y-4">
                    {(formData.questions || []).map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">Question {qIndex + 1}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedQuestions = [...(formData.questions || [])];
                              updatedQuestions.splice(qIndex, 1);
                              setFormData(prev => ({
                                ...prev,
                                questions: updatedQuestions
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                        <Input
                          placeholder="Enter question"
                          value={question.question}
                          onChange={(e) => {
                            const updatedQuestions = [...(formData.questions || [])];
                            updatedQuestions[qIndex].question = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              questions: updatedQuestions
                            }));
                          }}
                          className="mb-3"
                          disabled={isSubmitting}
                        />
                        <div className="space-y-2 ml-4">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`correctAnswer-${qIndex}`}
                                checked={question.correctAnswer === oIndex}
                                onChange={() => {
                                  const updatedQuestions = [...(formData.questions || [])];
                                  updatedQuestions[qIndex].correctAnswer = oIndex;
                                  setFormData(prev => ({
                                    ...prev,
                                    questions: updatedQuestions
                                  }));
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                disabled={isSubmitting}
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const updatedQuestions = [...(formData.questions || [])];
                                  updatedQuestions[qIndex].options[oIndex] = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    questions: updatedQuestions
                                  }));
                                }}
                                className="ml-2 flex-1"
                                placeholder={`Option ${oIndex + 1}`}
                                disabled={isSubmitting}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedQuestions = [...(formData.questions || [])];
                              updatedQuestions[qIndex].options.push('');
                              setFormData(prev => ({
                                ...prev,
                                questions: updatedQuestions
                              }));
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            disabled={isSubmitting}
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          questions: [
                            ...(prev.questions || []),
                            {
                              question: '',
                              options: ['', ''],
                              correctAnswer: 0
                            }
                          ]
                        }));
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {session ? 'Edit Session' : 'Create New Session'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed
                        ? 'bg-green-100 text-green-600'
                        : step.active
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {step.completed ? '✓' : step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs ${
                      step.active ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {currentStep < steps.length ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save as Draft'}
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleContinue}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : 'Next'}
                  </Button>
                </>
              ) : (
                <Button 
                  type="button"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {session ? 'Updating...' : 'Creating...'}
                    </>
                  ) : session ? 'Update Session' : 'Create Session'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
