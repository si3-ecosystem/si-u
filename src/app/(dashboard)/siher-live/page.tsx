// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Users, Edit, Award, Loader2 } from "lucide-react"
// import CreateSessionModal from "@/components/organisms/siher-live/create-session"

// import { Card, CardContent } from "@/components/ui/card"
// import NFTGatedLiveJoin from "@/components/organisms/sessions/NFTGatedLiveJoin"
// import { useAppSelector } from '@/redux/store'

// interface Session {
//     _id: string
//     title: string
//     description: string
//     status: string
//     date: string
//     startTime: string
//     endTime: string
//     accessType: string
//     _createdAt?: string
//     _updatedAt?: string
//     // Add other session fields as needed
// }

// export default function LiveStreamingDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [sessions, setSessions] = useState<Session[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [activeTab, setActiveTab] = useState<'live' | 'drafts'>('live')
//     const [editingSession, setEditingSession] = useState<Session | null>(null)
//     const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null)
//     const user = useAppSelector((state) => state.authV2.user)
//     const isBetaTester = user?.email === 'shayanabbasi006@gmail.com'
//     // const isBetaTester = user?.email === 'kara@si3.space';

//     // Function to refresh sessions using API
//     const refreshSessions = async (force = false) => {
//         if (force) setIsLoading(true);
//         try {
//             const accessType = activeTab === 'live' ? 'public' : 'draft';
//             const response = await fetch(`/api/siher-live?accessType=${accessType}&t=${Date.now()}`, {
//                 cache: 'no-store',
//                 headers: {
//                     'Cache-Control': 'no-cache, no-store, must-revalidate',
//                     'Pragma': 'no-cache',
//                     'Expires': '0'
//                 }
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 setSessions(result.data || []);
//             } else {
//                 console.error('Failed to fetch sessions:', response.statusText);
//                 setSessions([]);
//             }
//         } catch (error) {
//             console.error('Error refreshing sessions:', error);
//             setSessions([]);
//         } finally {
//             if (force) setIsLoading(false);
//         }
//     };


//     // Fetch sessions when component mounts or activeTab changes
//     useEffect(() => {
//         refreshSessions(true);
//     }, [activeTab]);

//     // Refresh data when user returns to the tab/window (keep this for better UX)
//     useEffect(() => {
//         const handleFocus = () => refreshSessions();
//         const handleVisibilityChange = () => {
//             if (!document.hidden) {
//                 refreshSessions();
//             }
//         };

//         window.addEventListener('focus', handleFocus);
//         document.addEventListener('visibilitychange', handleVisibilityChange);

//         return () => {
//             window.removeEventListener('focus', handleFocus);
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//         };
//     }, [activeTab]);

//     const handleSessionCreated = async (newSession: any) => {
//         // Optimistically update the sessions list
//         if (newSession) {
//             setSessions(prev => [newSession, ...prev]);
//         }
//         setIsModalOpen(false);
//         // Refresh in background to ensure consistency
//         refreshSessions();
//     };

//     const handleSessionUpdated = async (updatedSession: any) => {
//         // Optimistically update the sessions list
//         if (updatedSession) {
//             setSessions(prev => prev.map(session =>
//                 session._id === updatedSession._id ? updatedSession : session
//             ));
//         }
//         setEditingSession(null);
//         setIsModalOpen(false);
//         // Refresh in background to ensure consistency
//         refreshSessions();
//     };

//     const handleDeleteSession = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this session?')) return;

//         setDeletingSessionId(id);

//         try {
//             // Optimistically remove from UI
//             setSessions(prev => prev.filter(session => session._id !== id));

//             const response = await fetch(`/api/siher-live/${id}`, {
//                 method: 'DELETE',
//                 cache: 'no-store',
//             });

//             if (!response.ok) {
//                 // Revert optimistic update on error
//                 await refreshSessions(true);
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to delete session');
//             }
//         } catch (error) {
//             console.error('Error deleting session:', error);
//             alert('Failed to delete session. Please try again.');
//         } finally {
//             setDeletingSessionId(null);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-2">
//             {/* Test NFT-gated Livestream */}
//             {process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS && (
//                 <Card>
//                     <CardContent className="p-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">Test NFT-Gated Livestream</h2>
//                                 <p className="text-sm text-gray-600">Only wallets with a valid Unlock key can join.</p>
//                             </div>
//                         </div>
//                         <NFTGatedLiveJoin lockAddress={process.env.NEXT_PUBLIC_UNLOCK_LOCK_ADDRESS as string} />
//                     </CardContent>
//                 </Card>
//             )}
//             {/* Header Section with Gradient */}
//             {/* <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 p-8 text-white overflow-hidden"> */}
//             {/* <div className="relative z-10">
//                     <h1 className="text-4xl font-bold mb-3">GO LIVE</h1>
//                     <p className="text-purple-100 max-w-2xl">
//                         The Go Live page allows Si Her Guides to manage their live sessions events, from scheduling to attendance
//                         tracking and Proof of Attendance NFTs.
//                     </p>
//                 </div> */}
//             <img src="/fixx/SIHERGOLIVE.png" className="relative mb-8 rounded-2xl pt-2 text-white overflow-hidden" />
//             {/*                 
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
//                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
//             </div> */}

//             {/* Live Sessions Section */}
//             <div className="mb-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <div>
//                         <h2 className="text-2xl font-semibold text-gray-900 mb-1">Live Sessions</h2>
//                         <p className="text-gray-600">Manage your live sessions and attendance</p>
//                     </div>
//                     <div className="flex gap-3">
//                         {/* <Button
//                             variant="outline"
//                             onClick={() => refreshSessions(true)}
//                             disabled={isLoading}
//                             className="gap-2"
//                         >
//                             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "↻"}
//                             Refresh
//                         </Button> */}
//                         <Button
//                             className="gap-2 bg-purple-600 hover:bg-purple-700"
//                             onClick={() => { setEditingSession(null); setIsModalOpen(true) }}
//                             disabled={!isBetaTester}
//                         >
//                             <span className="text-lg">+</span>
//                             Create New Session
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Tabs */}
//                 <div className="flex gap-1 mb-6">
//                     <Button
//                         variant={activeTab === 'live' ? 'default' : 'ghost'}
//                         className={`${activeTab === 'live' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-gray-600'} px-6`}
//                         onClick={() => setActiveTab('live')}
//                     >
//                         Live
//                     </Button>
//                     <Button
//                         variant={activeTab === 'drafts' ? 'default' : 'ghost'}
//                         className={`${activeTab === 'drafts' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-gray-600'} px-6`}
//                         onClick={() => setActiveTab('drafts')}
//                     >
//                         Drafts
//                         <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">
//                             {sessions.filter(s => s.accessType === 'draft').length}
//                         </Badge>
//                     </Button>
//                 </div>

//                 {/* Session Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                     {isLoading ? (
//                         <div className="flex justify-center items-center py-12">
//                             <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
//                         </div>
//                     ) : sessions.length > 0 ? (
//                         sessions.map((session) => (
//                             <SessionCard
//                                 key={session._id}
//                                 session={session}
//                                 onEdit={() => {
//                                     setEditingSession(session);
//                                     setIsModalOpen(true);
//                                 }}
//                                 onDelete={() => handleDeleteSession(session._id)}
//                                 isDeleting={deletingSessionId === session._id}
//                             />
//                         ))
//                     ) : (
//                         <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
//                             <div className="text-center py-8">
//                                 <h3 className="font-semibold text-gray-900 mb-2">
//                                     No {activeTab === 'live' ? 'Live' : activeTab} Sessions
//                                 </h3>
//                                 <p className="text-gray-600 mb-4">
//                                     {isBetaTester
//                                         ? `You don't have any ${activeTab} sessions yet. Create one to get started!`
//                                         : 'Only beta testers can create live sessions at this time.'}
//                                 </p>
//                             </div>
//                         </Card>
//                     )}
//                 </div>
//             </div>

//             <CreateSessionModal
//                 open={isModalOpen}
//                 onOpenChange={(open) => {
//                     if (!open) setEditingSession(null);
//                     setIsModalOpen(open);
//                 }}
//                 existingSession={editingSession as any}
//                 mode={editingSession ? 'edit' : 'create'}
//                 onSaved={editingSession ? handleSessionUpdated : handleSessionCreated}
//             />
//         </div>
//     )
// }

// // Session Card Component
// function SessionCard({ session, onEdit, onDelete, isDeleting }: { session: Session, onEdit: () => void, onDelete: () => void, isDeleting?: boolean }) {
//     return (
//         <Card className="overflow-hidden">
//             <div className="p-6">
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                             {session.date} • {session.startTime} - {session.endTime}
//                         </p>
//                     </div>
//                     <Badge
//                         variant={session.accessType === 'public' ? 'destructive' : 'secondary'}
//                         className="ml-2"
//                     >
//                         {session.accessType === 'public' ? 'live' : session.accessType}
//                     </Badge>
//                 </div>
//                 <p className="mt-2 text-gray-600">{session.description}</p>

//                 <div className="mt-4 flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                         <div className="flex items-center text-sm text-gray-500">
//                             <Users className="w-4 h-4 mr-1" />
//                             <span>0 attendees</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-500">
//                             <Award className="w-4 h-4 mr-1" />
//                             <span>POAP Enabled</span>
//                         </div>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button variant="outline" size="sm" onClick={onEdit}>
//                             <Edit className="w-4 h-4 mr-2" />
//                             Edit
//                         </Button>
//                         <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
//                             {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </Card>
//     )
// }





"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Edit, Award, Loader2 } from "lucide-react"
import CreateSessionModal from "@/components/organisms/siher-live/create-session"

import { Card, CardContent } from "@/components/ui/card"
import NFTGatedLiveJoin from "@/components/organisms/sessions/NFTGatedLiveJoin"
import { useAppSelector } from '@/redux/store'

interface Session {
    _id: string
    title: string
    description: string
    status: string
    date: string
    startTime: string
    endTime: string
    accessType: string
    _createdAt?: string
    _updatedAt?: string
    // Add other session fields as needed
}

export default function LiveStreamingDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'live' | 'drafts'>('live')
    const [editingSession, setEditingSession] = useState<Session | null>(null)
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null)
    const user = useAppSelector((state) => state.authV2.user)
    // const isBetaTester = user?.email === 'codingfectum@gmail.com' //'shayanabbasi006@gmail.com'
    const isBetaTester = user?.email === 'codingfectum@gmail.com' || 'kara@si3.space' // || 'imhaseeb8@gmail.com';

    // Function to fetch sessions - removed all caching and revalidation logic
    const fetchSessions = async () => {
        try {
            const accessType = activeTab === 'live' ? 'public' : 'draft';
            const response = await fetch(`/api/siher-live?accessType=${accessType}`, {
                method: 'GET'
            });

            if (response.ok) {
                const result = await response.json();
                setSessions(result.data || []);
            } else {
                console.error('Failed to fetch sessions:', response.statusText);
                setSessions([]);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setSessions([]);
        }
    };

    // Fetch sessions when component mounts or activeTab changes
    useEffect(() => {
        const loadSessions = async () => {
            setIsLoading(true);
            await fetchSessions();
            setIsLoading(false);
        };
        
        loadSessions();
    }, [activeTab]);

    const handleSessionCreated = (newSession: any) => {
        if (newSession) {
            // Immediately update state - no revalidation needed
            setSessions(prev => [newSession, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleSessionUpdated = (updatedSession: any) => {
        if (updatedSession) {
            // Immediately update state - no revalidation needed
            setSessions(prev => prev.map(session =>
                session._id === updatedSession._id ? updatedSession : session
            ));
        }
        setEditingSession(null);
        setIsModalOpen(false);
    };

    const handleDeleteSession = async (id: string) => {
        if (!confirm('Are you sure you want to delete this session?')) return;

        setDeletingSessionId(id);

        try {
            const response = await fetch(`/api/siher-live/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Immediately remove from state - no revalidation needed
                setSessions(prev => prev.filter(session => session._id !== id));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete session');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete session. Please try again.');
        } finally {
            setDeletingSessionId(null);
        }
    };

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
            
            <img src="/fixx/SIHERGOLIVE.png" className="relative mb-8 rounded-2xl pt-2 text-white overflow-hidden" />

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
                            <SessionCard
                                key={session._id}
                                session={session}
                                onEdit={() => {
                                    setEditingSession(session);
                                    setIsModalOpen(true);
                                }}
                                onDelete={() => handleDeleteSession(session._id)}
                                isDeleting={deletingSessionId === session._id}
                            />
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
                    if (!open) setEditingSession(null);
                    setIsModalOpen(open);
                }}
                existingSession={editingSession as any}
                mode={editingSession ? 'edit' : 'create'}
                onSaved={editingSession ? handleSessionUpdated : handleSessionCreated}
            />
        </div>
    )
}

// Session Card Component
function SessionCard({ session, onEdit, onDelete, isDeleting }: { session: Session, onEdit: () => void, onDelete: () => void, isDeleting?: boolean }) {
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
                        <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}