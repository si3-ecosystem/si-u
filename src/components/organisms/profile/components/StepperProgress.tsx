"use client";

import React from "react";

type Step = "email" | "verify" | "profile";

interface StepperProgressProps {
  currentStep: Step;
}

interface StepConfig {
  id: Step;
  label: string;
  number: number;
}

const steps: StepConfig[] = [
  { id: "email", label: "Email", number: 1 },
  { id: "verify", label: "Verify", number: 2 },
  { id: "profile", label: "Profile", number: 3 },
];

export function StepperProgress({ currentStep }: StepperProgressProps) {
  const getStepStatus = (stepId: Step) => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "upcoming";
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return {
          container: "text-green-600",
          circle: "bg-green-600 text-white",
        };
      case "current":
        return {
          container: "text-brand font-medium",
          circle: "bg-brand text-white",
        };
      default:
        return {
          container: "text-gray-400",
          circle: "bg-gray-200",
        };
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const classes = getStepClasses(status);
          
          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 ${classes.container}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${classes.circle}`}>
                  {status === "completed" ? "✓" : step.number}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className={`h-0.5 ${status === "completed" ? "bg-green-600" : "bg-gray-200"}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile step labels */}
      <div className="sm:hidden text-center">
        <span className="text-sm text-gray-600">
          Step {steps.find(step => step.id === currentStep)?.number} of {steps.length}: {" "}
          <span className="font-medium">
            {steps.find(step => step.id === currentStep)?.label}
          </span>
        </span>
      </div>
    </div>
  );
}
