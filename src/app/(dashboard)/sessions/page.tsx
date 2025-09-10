"use client";

import { useState } from "react";
import CreateSessionModal from "@/components/organisms/sessions/SessionInfo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Radio, Award, ChevronDown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const metrics = [
  {
    icon: Calendar,
    label: "Sessions",
    value: "12",
    iconColor: "text-orange-500",
  },
  {
    icon: Users,
    label: "Attendees",
    value: "156",
    iconColor: "text-purple-500",
  },
  {
    icon: Radio,
    label: "Live Now",
    value: "1",
    iconColor: "text-orange-500",
  },
  {
    icon: Award,
    label: "Certificates",
    value: "38",
    iconColor: "text-orange-500",
  },
]

const sessions = [
  {
    id: 1,
    title: "Mastering DAO Governance",
    date: "April 25, 2025 | 2:00 PM",
    status: "Live",
    attendees: 56,
    avatarSrc: "/sessions/happy-woman.jpg",
    attendeeAvatars: ["/sessions/diverse-person-portrait.png", "/sessions/diverse-group-conversation.png", "/sessions/diverse-group-meeting.png"],
  },
  {
    id: 2,
    title: "Mastering DAO Governance",
    date: "April 25, 2025 | 2:00 PM",
    status: "Upcoming",
    attendees: 0,
    avatarSrc: "/sessions/smiling-woman.jpg",
    attendeeAvatars: [],
  },
  {
    id: 3,
    title: "Mastering DAO Governance",
    date: "April 25, 2025 | 2:00 PM",
    status: "Upcoming",
    attendees: 0,
    avatarSrc: "/sessions/smiling-woman.png",
    attendeeAvatars: [],
  },
  {
    id: 4,
    title: "Mastering DAO Governance",
    date: "April 25, 2025 | 2:00 PM",
    status: "Upcoming",
    attendees: 0,
    avatarSrc: "/sessions/happy-woman.jpg",
    attendeeAvatars: [],
  },
]

export default function SessionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateNewSession = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-8">
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

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.avatarSrc || "/placeholder.svg"} alt="Session host" />
                    <AvatarFallback>SH</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <Badge
                        variant={session.status === "Live" ? "destructive" : "secondary"}
                        className={
                          session.status === "Live"
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {session.status === "Live" && session.attendeeAvatars.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {session.attendeeAvatars.map((avatar, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarImage src={avatar || "/placeholder.svg"} alt={`Attendee ${index + 1}`} />
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{session.attendees} Attendees</span>
                    </div>
                  )}

                  {session.status === "Upcoming" && (
                    <span className="text-sm text-gray-500">{session.attendees} Attendees</span>
                  )}

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      Edit Session
                    </Button>
                    <Button variant="outline" size="sm">
                      Proof of Attendance
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      View Attendance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Session Modal */}
      {isCreateModalOpen && (
        <CreateSessionModal 
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}