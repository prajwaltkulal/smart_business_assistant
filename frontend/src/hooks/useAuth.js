/**
 * Hook: useAuth
 * Purpose: Convenient access to AuthContext
 * Owner: Member 2
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}
