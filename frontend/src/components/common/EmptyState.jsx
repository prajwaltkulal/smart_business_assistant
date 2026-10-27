/**
 * Component: EmptyState
 * Purpose: Friendly message when no data is available
 * Owner: Shared
 */

import React from 'react';

export default function EmptyState({ title = 'No data available', message, actionText, onAction }) {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {actionText && onAction && (
        <button onClick={onAction}>{actionText}</button>
      )}
    </div>
  );
}
