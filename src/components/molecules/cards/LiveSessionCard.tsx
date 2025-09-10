"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/lib/sanity/image";
import {
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LiveSessionCardProps {
  session: {
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
  };
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "ended":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const handleEditSession = () => {
    console.log("Edit session:", session._id);
  };

  const handleDeleteSession = () => {
    console.log("Delete session:", session._id);
  };

  const handleDuplicateSession = () => {
    console.log("Duplicate session:", session._id);
  };

  return (
    <Card className="p-6 border-2 border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-4">
        {/* Session Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {session.thumbnail ? (
            <Image
              src={urlForImage(session.thumbnail)?.src || ""}
              alt={session.title}
              fill
              loading="lazy"
              decoding="async"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {session.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Session Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`${getStatusColor(session.status)} text-xs font-medium`}
              >
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {session.attendeeCount} Attendees
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditSession}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateSession}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteSession}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="font-semibold text-lg text-black mb-1">
            {session.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(session.scheduledDate)} | {session.scheduledTime}
            </span>
          </div>

          <p className="text-gray-700 text-sm line-clamp-2 mb-4">
            {session.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {session.status === "live" && (
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Join Live
            </Button>
          )}
          {session.status === "scheduled" && (
            <Button size="sm" variant="outline">
              Edit Session
            </Button>
          )}
          {session.status === "ended" && session.proofOfAttendance && (
            <Button size="sm" variant="outline">
              Proof of Attendance
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
