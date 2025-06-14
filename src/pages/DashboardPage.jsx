import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  BarChart2,
  LayoutGrid,
  UserCircle,
} from 'lucide-react';

const styles = {
  page: {
    padding: '48px 24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  heading: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: 'center',
    background: 'linear-gradient(to right, #581c87, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 8,
  },
  subheading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#475569',
    marginBottom: 48,
  },
  grid: {
    display: 'grid',
    gap: 24,
    gridTemplateColumns: '1fr',
    maxWidth: '600px',
    margin: '0 auto',
  },
  cardWrapper: {
    borderRadius: 16,
    padding: 2,
    background: 'linear-gradient(135deg, #581c87, #8b5cf6)',
  },
  card: {
    background: 'linear-gradient(135deg, #581c87, #8b5cf6)',
    borderRadius: 16,
    padding: 24,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    color: '#ffffff',
    textDecoration: 'none',
    boxShadow: '0 8px 20px rgba(88, 28, 135, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(88, 28, 135, 0.25)',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
    position: 'relative',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  },
  label: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#cbd5e1',
  },
};

const DashboardPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const dashboardCards = {
    Instructor: [
      {
        to: '/courses',
        label: 'Manage Courses',
        icon: <BookOpen size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        shadow: 'rgba(102, 126, 234, 0.4)',
        hoverShadow: 'rgba(102, 126, 234, 0.6)',
      },
      {
        to: '/assessments',
        label: 'Manage Assessments',
        icon: <ClipboardCheck size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
        shadow: 'rgba(240, 147, 251, 0.4)',
        hoverShadow: 'rgba(240, 147, 251, 0.6)',
      },
      {
        to: '/students',
        label: 'View Results',
        icon: <BarChart2 size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        shadow: 'rgba(79, 172, 254, 0.4)',
        hoverShadow: 'rgba(79, 172, 254, 0.6)',
      },
    ],
    Student: [
      {
        to: '/student/courses',
        label: 'Browse Courses',
        icon: <LayoutGrid size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        shadow: 'rgba(67, 233, 123, 0.4)',
        hoverShadow: 'rgba(67, 233, 123, 0.6)',
      },
      {
        to: '/student/results',
        label: 'My Results',
        icon: <BarChart2 size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
        shadow: 'rgba(250, 112, 154, 0.4)',
        hoverShadow: 'rgba(250, 112, 154, 0.6)',
      },
      {
        to: '/profile',
        label: 'My Profile',
        icon: <UserCircle size={30} color="#fff" />,
        gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        shadow: 'rgba(168, 237, 234, 0.4)',
        hoverShadow: 'rgba(168, 237, 234, 0.6)',
      },
    ],
  };

  return (
    <div style={styles.page}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.heading}
      >
        Welcome, {name || 'User'}!
      </motion.h1>
      <p style={styles.subheading}>
        You are logged in as <strong>{role || '...'}</strong>. Let's get started!
      </p>

      <div style={styles.grid}>
        {(dashboardCards[role] || []).map((item, i) => (
          <motion.div
            key={item.to}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            style={{
              ...styles.cardWrapper,
              background: item.gradient || styles.cardWrapper.background,
            }}
          >
            <Link
              to={item.to}
              style={{
                ...styles.card,
                background: item.gradient || styles.card.background,
                boxShadow: `0 8px 20px ${item.shadow || 'rgba(88, 28, 135, 0.2)'}`,
              }}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 28px ${item.hoverShadow || 'rgba(88, 28, 135, 0.25)'}`,
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, { 
                  transform: '', 
                  boxShadow: `0 8px 20px ${item.shadow || 'rgba(88, 28, 135, 0.2)'}`,
                })
              }
            >
              <div style={styles.cardContent}>
                <div style={styles.iconContainer}>{item.icon}</div>
                <div>
                  <h2 style={styles.label}>{item.label}</h2>
                  <p style={styles.desc}>Click to open</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;