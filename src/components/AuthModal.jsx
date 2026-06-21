import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    width: '90%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    position: 'relative',
    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  closeButton: {
    position: 'absolute',
    top: '1.2rem',
    right: '1.2rem',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  title: {
    marginTop: 0,
    marginBottom: '0.5rem',
    color: '#0f172a',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: '700',
    fontFamily: "'Outfit', sans-serif",
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: '1.5',
  },
  formGroup: {
    marginBottom: '1.2rem',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    color: '#0f172a',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, var(--primary, #4f46e5), #818cf8)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px -10px rgba(79, 70, 229, 0.5)',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '0.02em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    color: '#475569',
  },
  toggleLink: {
    color: 'var(--primary, #4f46e5)',
    cursor: 'pointer',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    marginLeft: '5px',
    transition: 'color 0.2s',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    border: '1px solid #fecaca',
    animation: 'slideUp 0.3s ease-out',
  },
  success: {
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    border: '1px solid #a7f3d0',
    animation: 'slideUp 0.3s ease-out',
  }
};

const AuthModal = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Signup successful! You can now access your resume.');
        // If email confirmation is off, they are logged in immediately.
        if (data.session) {
          onSuccess(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess(data.session);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button 
          style={styles.closeButton} 
          onClick={onClose}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'; e.currentTarget.style.color = '#64748b'; }}
        >
          <X size={18} />
        </button>
        
        <h2 style={styles.title}>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
        <p style={styles.subtitle}>
          {isSignUp 
            ? 'Sign up to build, save, and download your beautiful resume.' 
            : 'Sign in to access your resume and continue editing.'}
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {successMsg && <div style={styles.success}>{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                style={styles.input}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary, #4f46e5)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                style={styles.input}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary, #4f46e5)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
              />
            </div>
          </div>

          <button 
            style={styles.button} 
            type="submit" 
            disabled={loading}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'translateY(1px)')}
            onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
          >
            {loading ? <><Loader2 size={18} className="animate-spin" style={{animation: 'spin 1s linear infinite'}} /> Processing...</> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button 
            style={styles.toggleLink} 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
            onMouseOver={(e) => e.currentTarget.style.color = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary, #4f46e5)'}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AuthModal;
