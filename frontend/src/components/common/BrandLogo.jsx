/**
 * Component: BrandLogo
 * Purpose: Official corporate logo and branding for RetailPulse
 * Owner: Shared
 */

import React from 'react';

export default function BrandLogo({ size = 'medium', lightMode = false, showSlogan = true }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconDim = isSmall ? 28 : isLarge ? 44 : 36;
  const titleSize = isSmall ? '15px' : isLarge ? '22px' : '17px';
  const sloganSize = isSmall ? '10px' : isLarge ? '12.5px' : '11px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '8px' : '12px' }}>
      {/* Official Geometric RetailPulse Logo SVG */}
      <div style={{
        width: `${iconDim}px`,
        height: `${iconDim}px`,
        borderRadius: isSmall ? '7px' : '10px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
        flexShrink: 0
      }}>
        <svg
          width={iconDim * 0.6}
          height={iconDim * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shopping Bag / Inventory Box base */}
          <path
            d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Handle */}
          <path
            d="M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Pulse / Upward Growth Line */}
          <path
            d="M7 14L10 11L13 14L17 9"
            stroke="#60a5fa"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="9" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Text & Slogan */}
      <div>
        <div style={{
          fontSize: titleSize,
          fontWeight: '800',
          letterSpacing: '-0.02em',
          color: lightMode ? '#0f172a' : '#ffffff',
          lineHeight: '1.2'
        }}>
          Retail<span style={{ color: '#2563eb' }}>Pulse</span>
        </div>
        {showSlogan && (
          <div style={{
            fontSize: sloganSize,
            color: lightMode ? '#64748b' : '#94a3b8',
            fontWeight: '600',
            letterSpacing: '0.01em',
            marginTop: '2px'
          }}>
            Smart Inventory & Decision Support
          </div>
        )}
      </div>
    </div>
  );
}