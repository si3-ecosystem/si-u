"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail } from 'lucide-react';

export function SupportSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Support
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Need help? Email us:</label>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <a 
              href="mailto:kara@si3.space" 
              className="text-sm text-blue-600 hover:underline"
            >
              kara@si3.space
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
