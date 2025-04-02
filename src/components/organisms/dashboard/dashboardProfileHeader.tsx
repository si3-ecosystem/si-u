"use client"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
    username: string
    subtext?: string
    avatarUrl: string
    onShare?: () => void
    onEdit?: () => void
}

export function DashboardProfileHeader({ username, subtext, avatarUrl, onShare, onEdit }: ProfileHeaderProps) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-purple-100 p-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-purple-500">
                        <Image
                            src={avatarUrl || "/placeholder.svg"}
                            alt={username}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                        <span className="text-xs">✏️</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">{username}</h2>
                    {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
                </div>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="rounded-full bg-white" onClick={onShare}>
                    Share Profile
                </Button>
                <Button className="rounded-full bg-black text-white hover:bg-gray-800" onClick={onEdit}>
                    Edit Profile
                </Button>
            </div>
        </div>
    )
}

