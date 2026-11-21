/**
 * Page: LoginPage
 * Purpose: Clean, official light-themed login interface for RetailPulse
 * Owner: Shared
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';
import BrandLogo from '../../components/common/BrandLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('prajwal.test@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState('owner'); // 'owner' or 'supervisor'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { setBusiness } = useBusiness();
  const navigate = useNavigate();

  // Role Switcher Handler
  const handleRoleSwitch = (role) => {
    setActiveRoleTab(role);
    setError('');
    if (role === 'owner') {
      setEmail('prajwal.test@example.com');
      setPassword('password123');
    } else {
      setEmail('supervisor@example.com');
      setPassword('staff123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await authApi.login({ email, password });

      const userRole = res.businesses?.[0]?.role || (email.includes('supervisor') ? 'manager' : 'owner');
      localStorage.setItem('user_role', userRole);

      // Save user profile details
      login({ ...res.user, role: userRole }, res.token);

      // Save active business
      if (res.businesses && res.businesses.length > 0) {
        const activeBiz = res.businesses[0];
        localStorage.setItem('active_business_id', String(activeBiz.id));
        setBusiness(activeBiz);
        navigate('/dashboard');
      } else {
        navigate('/setup/business');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle retail/inventory background pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.35,
          zIndex: 0
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="retail-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Soft grid line */}
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            {/* Mini subtle box / chart icons */}
            <rect x="25" y="25" width="12" height="12" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M 50 65 L 56 55 L 62 60 L 68 50" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
            <circle cx="15" cy="65" r="1.5" fill="#cbd5e1" />
            <circle cx="65" cy="15" r="1.5" fill="#cbd5e1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#retail-pattern)" />
      </svg>

      {/* Decorative soft ambient gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '36px 32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <BrandLogo size="large" lightMode={true} showSlogan={false} />
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '13.5px', fontWeight: '500' }}>
            Intelligent Sales, Continuous Inventory & Decision Support
          </p>
        </div>

        {/* 1-Click Role Switcher Segment */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            fontSize: '11.5px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Select Account Role
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px'
          }}>
            <button
              type="button"
              onClick={() => handleRoleSwitch('owner')}
              style={{
                padding: '9px 12px',
                border: activeRoleTab === 'owner' ? '1px solid #bfdbfe' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeRoleTab === 'owner' ? '#ffffff' : 'transparent',
                color: activeRoleTab === 'owner' ? '#2563eb' : '#64748b',
                boxShadow: activeRoleTab === 'owner' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>👑</span> Shop Owner
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('supervisor')}
              style={{
                padding: '9px 12px',
                border: activeRoleTab === 'supervisor' ? '1px solid #fed7aa' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeRoleTab === 'supervisor' ? '#ffffff' : 'transparent',
                color: activeRoleTab === 'supervisor' ? '#b45309' : '#64748b',
                boxShadow: activeRoleTab === 'supervisor' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🛡️</span> Supervisor
            </button>
          </div>
        </div>

        {/* Role Description Pill */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: activeRoleTab === 'owner' ? '#eff6ff' : '#fffbeb',
          border: `1px solid ${activeRoleTab === 'owner' ? '#bfdbfe' : '#fde68a'}`,
          color: activeRoleTab === 'owner' ? '#1e40af' : '#92400e',
          fontSize: '12px',
          lineHeight: '1.4',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>
            {activeRoleTab === 'owner' ? '📊' : '📋'}
          </span>
          <span>
            {activeRoleTab === 'owner'
              ? 'Store Owner: Full financial P&L analysis, smart restocking budget planner, and store settings.'
              : 'Floor Supervisor: Supervised daily billing CSV report imports, stock count audits, and ledger monitoring.'}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
          >
            {loading ? 'Signing in...' : `Sign in as ${activeRoleTab === 'owner' ? 'Owner' : 'Supervisor'}`}
          </button>
        </form>

        {/* Create Account Link */}
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b'
        }}>
          New business?{' '}
          <Link
            to="/register"
            style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}
          >
            Register your store account
          </Link>
        </div>

        {/* Demo Helper Hint */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          textAlign: 'center',
          fontSize: '11.5px',
          color: '#64748b'
        }}>
          💡 Demonstration credentials are automatically filled when selecting a role above.
        </div>
      </div>

      {/* Footer Branding */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b',
        position: 'relative',
        zIndex: 1
      }}>
        <strong>RetailPulse</strong> • College Mini-Project IS15 • Sahyadri College of Engineering & Management
      </div>
    </div>
  );
}