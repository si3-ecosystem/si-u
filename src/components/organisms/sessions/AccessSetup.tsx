"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Info } from "lucide-react"

export default function AccessSetupStep() {
  const [tokenGatingEnabled, setTokenGatingEnabled] = useState(true)

  return (
    <div className="space-y-6">
      {/* Huddle01 Link */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Huddle01 Link</label>
        <Input placeholder="Enter Your Huddle01 Link" className="w-full" />
      </div>

      {/* Max capacity */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-gray-900">Max capacity</label>
          <Info className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>
        <Input placeholder="Set max capacity..." className="w-full" />
      </div>

      {/* NFT Required */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">NFT Required</label>
        <Input placeholder="Enter NFT address" className="w-full" />
      </div>

      {/* Ownership Requirement */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Ownership Requirement</label>
        <Select defaultValue="1token">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1token">Must own at least 1 token</SelectItem>
            <SelectItem value="5tokens">Must own at least 5 tokens</SelectItem>
            <SelectItem value="10tokens">Must own at least 10 tokens</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enable Token Gating */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">Enable Token Gating</label>
        <Switch checked={tokenGatingEnabled} onCheckedChange={setTokenGatingEnabled} />
      </div>
    </div>
  )
}
