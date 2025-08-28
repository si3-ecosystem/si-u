"use client";

import { useState } from "react";
import { Tabs } from "@/components/molecules/tabs/guideTabs";
import { LiveSessionCard } from "@/components/molecules/cards/LiveSessionCard";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface LiveSession {
  _id: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "live" | "draft" | "scheduled" | "ended";
  attendeeCount: number;
  maxAttendees: number;
  speakerName: string;
  speakerImage: any;
  thumbnail: any;
  category: string;
  meetingUrl?: string;
  recordingUrl?: string;
  proofOfAttendance: boolean;
}

interface LiveSessionsManagerProps {
  sessions: LiveSession[];
  globalFilter: string;
}

export function LiveSessionsManager({ sessions, globalFilter }: LiveSessionsManagerProps) {
  const [activeTab, setActiveTab] = useState("live");

  // Filter sessions based on global filter and tab
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = globalFilter === "" || 
      session.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      session.speakerName.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesTab = activeTab === "live" ? session.status === "live" :
                      activeTab === "draft" ? session.status === "draft" :
                      activeTab === "scheduled" ? session.status === "scheduled" :
                      activeTab === "ended" ? session.status === "ended" : true;

    return matchesSearch && matchesTab;
  });

  const handleCreateSession = () => {
    // TODO: Implement create session modal/navigation
    console.log("Create new session");
  };

  const handleScheduleSession = () => {
    // TODO: Implement schedule session modal/navigation
    console.log("Schedule session");
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-black mb-2">Live Sessions</h1>
          <p className="text-brandGray text-base leading-[140%]">
            Manage your live sessions and attendance.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleScheduleSession}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Session
          </Button>
          <Button
            onClick={handleCreateSession}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Create New Session
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "live", label: "Live" },
          { id: "draft", label: "Drafts" },
          { id: "scheduled", label: "Scheduled" },
          { id: "ended", label: "Ended" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Sessions List */}
      <div className="mt-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {globalFilter ? (
              <>
                <p>No sessions found for "{globalFilter}".</p>
                <p className="text-sm mt-2">Try adjusting your search term.</p>
              </>
            ) : (
              <div>
                <p className="mb-4">No {activeTab} sessions yet.</p>
                <Button
                  onClick={handleCreateSession}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Session
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <LiveSessionCard
                key={session._id}
                session={session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}