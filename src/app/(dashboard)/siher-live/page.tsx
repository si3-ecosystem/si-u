"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Edit, Award, Loader2 } from "lucide-react"
import CreateSessionModal from "@/components/organisms/siher-live/create-session"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import NFTGatedLiveJoin from "@/components/organisms/sessions/NFTGatedLiveJoin"
import { useAppSelector } from '@/redux/store'
import { getSiherGoLiveSessions, deleteSiherGoLiveSession } from "@/lib/sanity/client"

interface Session {
    _id: string
    title: string
    description: string
    status: string
    date: string
    startTime: string
    endTime: string
    accessType: string
    // Add other session fields as needed
}

export default function LiveStreamingDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'live' | 'drafts'>('live')
    const [editingSession, setEditingSession] = useState<Session | null>(null)
    const user = useAppSelector((state) => state.authV2.user)
    // const isBetaTester = user?.email === 'shayanabbasi006@gmail.com'
    const isBetaTester = user?.email === 'kara@si3.space';

    // Fetch sessions when component mounts or activeTab changes
    useEffect(() => {
        const fetchSessions = async () => {
            setIsLoading(true)
            try {
                const accessType = activeTab === 'live' ? 'public' : 'draft'
                const sessionsByAccess = await getSiherGoLiveSessions(accessType) as Session[]
                console.log('sessionsByAccess',sessionsByAccess)
                setSessions(sessionsByAccess)
            } catch (error) {
                console.error('Error fetching sessions:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSessions()
    }, [activeTab])

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
                        <Button
                            className="gap-2 bg-purple-600 hover:bg-purple-700"
                            onClick={() => { setEditingSession(null); setIsModalOpen(true) }}
                            disabled={!isBetaTester}
                        >
                            <span className="text-lg">+</span>
                            Create New Session
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6">
                    <Button 
                        variant={activeTab === 'live' ? 'default' : 'ghost'} 
                        className={`${activeTab === 'live' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-gray-600'} px-6`}
                        onClick={() => setActiveTab('live')}
                    >
                        Live
                    </Button>
                    <Button 
                        variant={activeTab === 'drafts' ? 'default' : 'ghost'} 
                        className={`${activeTab === 'drafts' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-gray-600'} px-6`}
                        onClick={() => setActiveTab('drafts')}
                    >
                        Drafts
                        <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">
                            {sessions.filter(s => s.accessType === 'draft').length}
                        </Badge>
                    </Button>
                </div>

                {/* Session Cards */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : sessions.length > 0 ? (
                        sessions.map((session) => (
                            <SessionCard key={session._id} session={session} onEdit={() => { setEditingSession(session); setIsModalOpen(true) }} onDelete={async () => {
                                // Optimistic UI update
                                const prev = sessions
                                setSessions((s) => s.filter(x => x._id !== session._id))
                                try {
                                    await deleteSiherGoLiveSession(session._id)
                                } catch (e) {
                                    console.error('Failed to delete session', e)
                                    // revert on error
                                    setSessions(prev)
                                }
                            }} />
                        ))
                    ) : (
                        <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <div className="text-center py-8">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    No {activeTab === 'live' ? 'Live' : activeTab} Sessions
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {isBetaTester
                                        ? `You don't have any ${activeTab} sessions yet. Create one to get started!`
                                        : 'Only beta testers can create live sessions at this time.'}
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <CreateSessionModal 
              open={isModalOpen} 
              onOpenChange={(open) => {
                if (!open) setEditingSession(null)
                setIsModalOpen(open)
              }} 
              existingSession={editingSession as any}
              mode={editingSession ? 'edit' : 'create'}
              onSaved={() => {
                // refresh list after save
                (async () => {
                  setIsLoading(true)
                  try {
                    const accessType = activeTab === 'live' ? 'public' : 'draft'
                    const sessionsByAccess = await getSiherGoLiveSessions(accessType) as Session[]
                    setSessions(sessionsByAccess)
                  } catch (err) {
                    console.error(err)
                  } finally {
                    setIsLoading(false)
                  }
                })()
              }}
            />
        </div>
    )
}

// Session Card Component
function SessionCard({ session, onEdit, onDelete }: { session: Session, onEdit: () => void, onDelete: () => void }) {
    return (
        <Card className="overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {session.date} • {session.startTime} - {session.endTime}
                        </p>
                    </div>
                    <Badge
                        variant={session.accessType === 'public' ? 'destructive' : 'secondary'}
                        className="ml-2"
                    >
                        {session.accessType === 'public' ? 'live' : session.accessType}
                    </Badge>
                </div>
                <p className="mt-2 text-gray-600">{session.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>0 attendees</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <Award className="w-4 h-4 mr-1" />
                            <span>POAP Enabled</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}