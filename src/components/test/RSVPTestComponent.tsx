"use client";

import React, { useState } from 'react';
import { SessionCard } from '@/components/molecules/cards/sessionCard';
import { GuidesSession } from '@/types/siherguides/session';

// Test session data
const testSession: GuidesSession = {
  _id: 'test-session-123',
  title: 'Test RSVP Session',
  description: 'This is a test session to verify RSVP functionality',
  date: '2024-12-15T10:00:00Z',
  endDate: '2024-12-15T11:00:00Z',
  time: '10:00 AM',
  guideName: 'Test Guide',
  language: 'English',
  rsvpSettings: {
    enabled: true,
    maxCapacity: 50,
    waitlistEnabled: true,
    allowGuests: true,
    maxGuestsPerRSVP: 3,
    requiresApproval: false,
    collectContactInfo: true,
  },
  location: {
    type: 'virtual',
    venue: 'Zoom Meeting',
    virtualLink: 'https://zoom.us/j/123456789',
  },
  organizer: {
    name: 'SI3 Team',
    email: 'guides@si3.space',
  },
};

export function RSVPTestComponent() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">RSVP Test Component</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-900 mb-2">Test Instructions:</h2>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>1. Click the "Attend Event" button to open the dropdown</li>
          <li>2. Try "Add to Google Calendar" - should open Google Calendar</li>
          <li>3. Try "Add to Apple iCal" - should download an .ics file</li>
          <li>4. Try "Join the X Channel" - should open the virtual link</li>
          <li>5. Try "Cancel the Attendance" - should cancel any existing RSVP</li>
          <li>6. Try "RSVP" - should open the detailed RSVP form</li>
        </ul>
      </div>

      <SessionCard
        session={testSession}
        openDropdownId={openDropdownId}
        toggleDropdown={toggleDropdown}
        setOpenDropdownId={setOpenDropdownId}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Expected Behavior:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Calendar options should generate proper calendar events</li>
          <li>• X Channel should open the virtual meeting link</li>
          <li>• Cancel should remove any existing RSVP</li>
          <li>• RSVP should open a detailed form modal</li>
          <li>• All actions should provide user feedback</li>
        </ul>
      </div>
    </div>
  );
}
