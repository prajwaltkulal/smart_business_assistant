/**
 * Component: Loader
 * Purpose: Loading spinner placeholder
 * Owner: Shared
 */

import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
