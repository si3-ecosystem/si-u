"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateSessionModal from "@/components/organisms/sessions/SessionInfo";
import { Button } from "@/components/ui/button";
import NFTGatedLiveJoin from "@/components/organisms/sessions/NFTGatedLiveJoin";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Radio, Award, ChevronDown, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAppSelector } from '@/redux/store';

interface Session {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  accessType: 'public' | 'nft' | 'token';
  attendees: number;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  attendeeAvatars?: string[];
  nftContractAddress?: string;
  tokenAddress?: string;
  tokenAmount?: number;
  enablePOAP?: boolean;
  poapEventId?: string;
  enableQuiz?: boolean;
}

const calculateMetrics = (sessions: Session[]) => {
  const totalSessions = sessions.length;
  const totalAttendees = sessions.reduce((sum, session) => sum + (session.attendees || 0), 0);
  const liveSessions = sessions.filter(session => session.status === 'live').length;
  const completedSessions = sessions.filter(session => session.status === 'completed').length;

  return [
    {
      icon: Calendar,
      label: "Sessions",
      value: totalSessions.toString(),
      iconColor: "text-orange-500",
    },
    {
      icon: Users,
      label: "Attendees",
      value: totalAttendees.toString(),
      iconColor: "text-purple-500",
    },
    {
      icon: Radio,
      label: "Live Now",
      value: liveSessions.toString(),
      iconColor: "text-orange-500",
    },
    {
      icon: Award,
      label: "Completed",
      value: completedSessions.toString(),
      iconColor: "text-green-500",
    },
  ];
};

const placeholderAvatars = [
  "/sessions/diverse-person-portrait.png",
  "/sessions/diverse-group-conversation.png",
  "/sessions/diverse-group-meeting.png"
];

export default function SessionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.authV2.user);
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const metrics = calculateMetrics(sessions);

  const filteredSessions = sessions.filter(session => 
    activeTab === 'upcoming' 
      ? ['draft', 'scheduled', 'live'].includes(session.status)
      : session.status === 'completed'
  );

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/grow3dge?status=all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSessions(result.data || []);
      } else {
        console.error('Failed to fetch sessions:', await response.text());
        toast({
          title: 'Error',
          description: 'Failed to load sessions. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching sessions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle session creation
  const handleCreateNewSession = () => {
    setEditingSession(null);
    setIsCreateModalOpen(true);
  };

  // Handle session edit
  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setIsCreateModalOpen(true);
  };

  // Handle session delete
  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    setDeletingSessionId(id);
    
    try {
      const response = await fetch(`/api/grow3dge/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optimistically remove from UI
        setSessions(prev => prev.filter(session => session._id !== id));
        toast({
          title: 'Success',
          description: 'Session deleted successfully.',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete session',
        variant: 'destructive',
      });
    } finally {
      setDeletingSessionId(null);
    }
  };

  // Handle session save (create/update)
  const handleSaveSession = async (sessionData: any) => {
    const isEdit = !!editingSession;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit 
      ? `/api/grow3dge/${editingSession?._id}`
      : '/api/grow3dge';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the sessions list
        if (isEdit) {
          setSessions(prev => 
            prev.map(s => s._id === editingSession?._id ? result.data : s)
          );
        } else {
          setSessions(prev => [result.data, ...prev]);
        }

        toast({
          title: 'Success',
          description: `Session ${isEdit ? 'updated' : 'created'} successfully!`,
        });
        
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isEdit ? 'update' : 'create'} session`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} session:`, error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} session`,
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingSession(null);
  };

  // Fetch sessions on component mount
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  return (
    <div className="space-y-8">
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
      <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${metric.iconColor}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Sessions</h1>
          <p className="text-gray-600">Manage your live sessions and attendance.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            All
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Schedule Session
          </Button>

          <Button 
            onClick={handleCreateNewSession}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Create New Session
          </Button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Sessions
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab === 'upcoming' ? 'upcoming' : 'past'} sessions</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'upcoming' 
              ? 'Get started by creating a new session.'
              : 'No past sessions found.'}
          </p>
          {activeTab === 'upcoming' && (
            <Button onClick={handleCreateNewSession}>
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const sessionDate = new Date(session.startTime);
            const formattedDate = format(sessionDate, 'MMMM d, yyyy | h:mm a');
            const isLive = session.status === 'live';
            const isUpcoming = ['draft', 'scheduled'].includes(session.status);
            
            return (
              <Card key={session._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4 relative h-48 md:h-auto">
                      <img
                        src={session.coverImage || '/sessions/default-session.jpg'}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                      {isLive && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                          LIVE
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{session.title}</h3>
                              <p className="text-sm text-gray-600 mb-4">{formattedDate}</p>
                              <p className="text-gray-700 line-clamp-2">{session.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditSession(session)}
                                disabled={session.status === 'completed'}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteSession(session._id)}
                                disabled={deletingSessionId === session._id}
                              >
                                {deletingSessionId === session._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center">
                            {session.attendees > 0 ? (
                              <div className="flex items-center">
                                <div className="flex -space-x-2">
                                  {Array.from({ length: Math.min(3, session.attendees) }).map((_, i) => (
                                    <Avatar key={i} className="h-8 w-8 border-2 border-white">
                                      <AvatarImage 
                                        src={placeholderAvatars[i % placeholderAvatars.length]} 
                                        alt={`Attendee ${i + 1}`} 
                                      />
                                      <AvatarFallback>A</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="ml-3 text-sm text-gray-600">
                                  {session.attendees} {session.attendees === 1 ? 'attendee' : 'attendees'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No attendees yet</span>
                            )}
                          </div>
                          
                          <div>
                            <Badge
                              variant={isLive ? 'destructive' : isUpcoming ? 'secondary' : 'outline'}
                              className={`${
                                isLive
                                  ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                  : isUpcoming
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                  : 'bg-green-100 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Session Modal */}
      {isCreateModalOpen && (
        <CreateSessionModal 
          isOpen={isCreateModalOpen} 
          onClose={handleCloseModal}
          session={editingSession}
          onSave={handleSaveSession}
        />
      )}
    </div>
  );
}