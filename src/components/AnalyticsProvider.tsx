'use client';

import { FormoAnalyticsProvider } from '@formo/analytics';
import React, { FC, useEffect } from 'react';

type FormoAnalyticsProviderProps = {
  writeKey: any
  children: React.ReactNode,
};

// The provider component
export const AnalyticsProvider: FC<FormoAnalyticsProviderProps> = ({
  writeKey,
  children,
}) => {
  return (
    <FormoAnalyticsProvider writeKey={writeKey}>
      {children}
    </FormoAnalyticsProvider>
  );
};

export default AnalyticsProvider;