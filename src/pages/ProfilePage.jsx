import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setErrorMsg('User ID not found. Please log in again.');
        return;
      }

      try {
        const res = await api.get(`/Users/${userId}`);
        console.log('📥 Profile fetched:', res.data);
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || '',
          email: res.data.email || ''
        });
      } catch (err) {
        console.error('❌ Failed to load profile', err);
        setErrorMsg('❌ Unauthorized or user not found. Please log in again.');
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.email.includes('@') || !form.email.includes('.')) {
      setErrorMsg('❌ Please enter a valid email.');
      return;
    }

    const payload = {
      userId,
      fullName: form.fullName.trim(),
      email: form.email.trim()
    };

    console.log('📤 Sending PUT request:', payload);

    try {
      const res = await api.put(`/Users/${userId}`, payload);
      console.log('✅ Profile updated:', res.data);

      setProfile({ ...form, userId });
      setEditMode(false);
      setSuccessMsg('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
      if (err.response?.data) {
        console.error('🚨 Backend error:', err.response.data);
        setErrorMsg(`❌ ${err.response.data}`);
      } else {
        setErrorMsg('❌ Server error. Please try again later.');
      }
    }
  };

  if (errorMsg && !profile) {
    return <p className="p-6 text-red-600 text-center">{errorMsg}</p>;
  }

  if (!profile) {
    return <p className="p-6 text-blue-800 dark:text-blue-300">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-8 border border-blue-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 text-center mb-6">
          My Profile
        </h2>

        {successMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 border border-green-300 dark:border-green-700 rounded px-4 py-2 text-sm mb-4"
          >
            {successMsg}
          </motion.p>
        )}

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 border border-red-300 dark:border-red-700 rounded px-4 py-2 text-sm mb-4"
          >
            {errorMsg}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white rounded-lg transition shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 text-slate-800 dark:text-slate-200"
            >
              <p><strong>Full Name:</strong> {profile.fullName}</p>
              <p><strong>Email:</strong> {profile.email}</p>

              <div className="text-center mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 border-2 border-blue-700 text-blue-700 dark:text-blue-300 dark:border-blue-400 rounded-lg transition hover:bg-blue-100 dark:hover:bg-slate-700"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
