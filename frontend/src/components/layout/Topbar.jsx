/**
 * Component: Topbar
 * Purpose: Header bar with shop profile, user details, and logout action
 * Owner: Member 1
 */

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { business } = useBusiness();

  return (
    <header className="topbar">
      <div className="topbar-shop-name">
        <span>{business?.name || 'My Shop'}</span>
      </div>
      <div className="topbar-user">
        <span>{user?.name || 'User'}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
