"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportSection() {
  return (
    <Card className="!mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center justify-between gap-3 flex-wrap w-full">
            <h3 className="text-lg lg:text-xl font-bold"> Support</h3>
            <p className="text-gray-500 font-normal">Contact Support</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-3 flex-wrap w-full border border-gray-200 p-4 rounded-lg">
          <label className="text-sm font-medium text-gray-700">
            Need help? Email us:
          </label>
          <div className="flex items-center gap-2">
            <a
              href="mailto:members@si3.space"
              className="text-sm  hover:underline"
            >
              members@si3.space
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
