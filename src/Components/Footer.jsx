import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-purple-50 dark:bg-slate-800 border-t border-purple-200 dark:border-slate-700 mt-10 shadow-inner"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-purple-900 dark:text-purple-300">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-semibold"
        >
          © {new Date().getFullYear()} EduSync LMS
        </motion.span>{' '}
        — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;