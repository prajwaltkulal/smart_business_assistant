/**
 * Context: BusinessContext
 * Purpose: Manage active business profile, current operating mode, and currency
 * Owner: Member 1 & Member 2
 */

import React, { createContext, useState } from 'react';

export const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(null);
  const [operatingMode, setOperatingMode] = useState('owner-managed');

  return (
    <BusinessContext.Provider value={{ business, setBusiness, operatingMode, setOperatingMode }}>
      {children}
    </BusinessContext.Provider>
  );
}
