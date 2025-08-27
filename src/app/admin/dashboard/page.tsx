"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/atoms/admin/StatCard";
import { CronJobStatus } from "@/components/molecules/admin/CronJobStatus";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
  Calendar,
  Users,
  Activity,
  Mail,
  RefreshCw,
  Filter,
  Settings,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { stats, cronJobs, isLoadingStats, fetchRSVPs, refreshStats } =
    useAdminDashboard();

  const [isLoadingRSVPs, setIsLoadingRSVPs] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    sessionId: "",
    search: "",
  });

  const loadRSVPs = React.useCallback(async () => {
    setIsLoadingRSVPs(true);
    try {
    } catch (error) {
      toast.error("Failed to load RSVPs");
      console.error("Load RSVPs error:", error);
    } finally {
      setIsLoadingRSVPs(false);
    }
  }, [filters.status, filters.sessionId, fetchRSVPs]);

  // Load RSVPs on component mount
  useEffect(() => {
    loadRSVPs();
  }, [loadRSVPs]);

  const getHealthBadge = () => {
    if (!stats) return null;

    switch (stats.systemHealth) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage RSVPs and monitor system health
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getHealthBadge()}
          <Button
            onClick={refreshStats}
            disabled={isLoadingStats}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoadingStats ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessions"
          value={stats?.totalSessions || 0}
          description="All time"
          icon={Calendar}
        />
        <StatCard
          title="Total RSVPs"
          value={stats?.totalRSVPs || 0}
          description="All time"
          icon={Users}
        />
        <StatCard
          title="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          description="Next 30 days"
          icon={Activity}
        />
        <StatCard
          title="Reminders Sent Today"
          value={stats?.remindersSentToday || 0}
          description="Today"
          icon={Mail}
        />
      </div>

      {/* Cron Jobs Status */}
      <CronJobStatus cronJobs={cronJobs || []} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Button className="w-full justify-start" variant="outline" disabled>
              <Mail className="h-4 w-4 mr-2" />
              Send Announcements
            </Button>
            <Button className="w-full justify-start" variant="outline" disabled>
              <Activity className="h-4 w-4 mr-2" />
              System Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RSVP Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            RSVP Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search users or sessions..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="max-w-sm"
              />
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="not_attending">Not Attending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={loadRSVPs}
              disabled={isLoadingRSVPs}
              variant="outline"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
