import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: '16px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    maxWidth: 900,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  leftPanel: {
    padding: 48,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightPanel: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  rightPanelBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
  rightContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
  },
  rightHeading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 1.2,
  },
  rightSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
    lineHeight: 1.5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#7c3aed',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: '#1e293b',
    lineHeight: 1.2,
  },
  subheading: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  messageError: {
    color: '#dc2626',
    marginBottom: 16,
    fontSize: 14,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    border: '1px solid #fecaca',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#a855f7',
    boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
    marginTop: 8,
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(168, 85, 247, 0.6)',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 32,
  },
  link: {
    color: '#a855f7',
    textDecoration: 'none',
    fontWeight: 600,
  },
  containerMobile: {
    gridTemplateColumns: '1fr',
    maxWidth: 450,
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnHover, setBtnHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.userId);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('role', res.data.user.role);

      window.location.href = '/dashboard';
    } catch {
      setError('Invalid email or password.');
    }
  };

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          ...styles.container, 
          ...(isMobile ? styles.containerMobile : {}) 
        }}
      >
        {/* Left Panel - Login Form */}
        <div style={styles.leftPanel}>
          <div style={styles.companyName}>EduSync</div>
          <h2 style={styles.heading}>Sign into Account</h2>
          <p style={styles.subheading}>or use your email account</p>

          {error && <div style={styles.messageError}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
                style={{
                  ...styles.input,
                  ...(emailFocus ? styles.inputFocus : {})
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                required
                style={{
                  ...styles.input,
                  ...(passwordFocus ? styles.inputFocus : {})
                }}
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              SIGN IN
            </motion.button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
        </div>

        {/* Right Panel - Welcome Message */}
        {!isMobile && (
          <div style={styles.rightPanel}>
            <div style={styles.rightPanelBg}></div>
            <div style={styles.rightContent}>
              <h2 style={styles.rightHeading}>Hello, Friend!</h2>
              <p style={styles.rightSubtext}>
                Fill up personal information and start your journey with us.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;