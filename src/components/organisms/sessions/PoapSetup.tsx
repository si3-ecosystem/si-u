"use client"

import { Switch } from "@/components/ui/switch"
import { Fingerprint } from 'lucide-react';

interface POAPSetupStepProps {
  enablePOAP: boolean
  setEnablePOAP: (enabled: boolean) => void
  attendanceRequirement: string
  setAttendanceRequirement: (requirement: string) => void
  claimMethod: string
  setClaimMethod: (method: string) => void
}

export default function POAPSetupStep({
  enablePOAP,
  setEnablePOAP,
  attendanceRequirement,
  setAttendanceRequirement,
  claimMethod,
  setClaimMethod,
}: POAPSetupStepProps) {
  return (
    <div className="space-y-6">
      {/* Issue Proof of Attendance Card */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-gray-600">
              <Fingerprint size={28} />
            </div>
            <h3 className="font-medium text-gray-900">Issue Proof of Attendance</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Enable POAP</span>
            <Switch checked={enablePOAP} onCheckedChange={setEnablePOAP} />
          </div>
        </div>
        <p className="text-sm text-gray-600 ml-9">
          Automatically reward attendees with a collectible badge for joining this session.
        </p>
      </div>

      {/* Attendance Requirement */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900">Attendance Requirement</label>
          <div className="w-4 h-4 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9,9h6v6H9V9z" />
            </svg>
          </div>
        </div>
        <div className="relative">
          <select
            value={attendanceRequirement}
            onChange={(e) => setAttendanceRequirement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="30 mins">30 mins</option>
            <option value="15 mins">15 mins</option>
            <option value="45 mins">45 mins</option>
            <option value="60 mins">60 mins</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Claim Method */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900">Claim Method</label>
          <div className="w-4 h-4 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9,9h6v6H9V9z" />
            </svg>
          </div>
        </div>
        <div className="relative">
          <select
            value={claimMethod}
            onChange={(e) => setClaimMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="Auto-mint">Auto-mint</option>
            <option value="Manual claim">Manual claim</option>
            <option value="QR Code">QR Code</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
