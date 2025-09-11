"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Edit, Award } from "lucide-react"
import CreateSessionModal from "@/components/organisms/siher-live/create-session"
import { Card, CardContent } from "@/components/ui/card"
import NFTGatedLiveJoin from "@/components/organisms/sessions/NFTGatedLiveJoin";

export default function LiveStreamingDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            {/* Test NFT-gated Livestream */}
            {process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Test NFT-Gated Livestream</h2>
                                <p className="text-sm text-gray-600">Only wallets with a valid Unlock key can join.</p>
                            </div>
                        </div>
                        <NFTGatedLiveJoin lockAddress={process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS as string} />
                    </CardContent>
                </Card>
            )}
            {/* Header Section with Gradient */}
            <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 p-8 text-white overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-3">GO LIVE</h1>
                    <p className="text-purple-100 max-w-2xl">
                        The Go Live page allows Si Her Guides to manage their live sessions events, from scheduling to attendance
                        tracking and Proof of Attendance NFTs.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
            </div>

            {/* Live Sessions Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Live Sessions</h2>
                        <p className="text-gray-600">Manage your live sessions and attendance</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <Calendar className="w-4 h-4" />
                            Schedule Session
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => setIsModalOpen(true)}>
                            <span className="text-lg">+</span>
                            Create New Session
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6">
                    <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                        Live
                    </Button>
                    <Button variant="ghost" className="text-gray-600 px-6">
                        Drafts
                        <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">
                            3
                        </Badge>
                    </Button>
                    <Button variant="ghost" className="text-gray-600 px-6">
                        Scheduled
                    </Button>
                    <Button variant="ghost" className="text-gray-600 px-6">
                        Ended
                    </Button>
                </div>

                {/* Session Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Session Card */}
                    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src="/sessions/img.png" alt="Profile" />
                                <AvatarFallback>MG</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="destructive" className="bg-red-500 text-white text-xs px-2 py-1">
                                        Live
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>30 attendees</span>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Mastering DAO Governance</h3>
                                <p className="text-sm text-gray-600 mb-4">April 25, 2025 | 2:00 PM</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit Session
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
                                        <Award className="w-3 h-3 mr-1" />
                                        Proof of Attendance
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Second Session Card */}
                    <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src="/sessions/img.png" alt="Profile" />
                                <AvatarFallback>MG</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="destructive" className="bg-red-500 text-white text-xs px-2 py-1">
                                        Live
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>45 attendees</span>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Mastering DAO Governance</h3>
                                <p className="text-sm text-gray-600 mb-4">April 25, 2025 | 2:00 PM</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit Session
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
                                        <Award className="w-3 h-3 mr-1" />
                                        Proof of Attendance
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <CreateSessionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    )
}
