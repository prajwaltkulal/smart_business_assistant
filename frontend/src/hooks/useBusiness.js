/**
 * Hook: useBusiness
 * Purpose: Convenient access to BusinessContext
 * Owner: Member 1
 */

import { useContext } from 'react';
import { BusinessContext } from '../context/BusinessContext';

export function useBusiness() {
  return useContext(BusinessContext);
}
