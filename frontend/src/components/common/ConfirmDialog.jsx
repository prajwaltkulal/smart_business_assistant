/**
 * Component: ConfirmDialog
 * Purpose: User confirmation dialog for destructive or critical actions
 * Owner: Shared
 */

import React from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-box">
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>
  );
}
