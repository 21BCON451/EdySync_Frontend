import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('authToken') ||
          localStorage.getItem('accessToken');

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const [resResults, resAssessments] = await Promise.all([
          api.get('/Results', config),
          api.get('/Assessments', config),
        ]);

        const userResults = resResults.data.filter(
          (r) =>
            r.userId === userId ||
            r.userId?.toString() === userId ||
            r.userId?.toString().toLowerCase() === userId?.toLowerCase()
        );

        setResults(userResults);
        setAssessments(resAssessments.data);
      } catch (err) {
        console.error('Failed to fetch student results', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view results.");
        } else if (err.message.includes('No authentication token')) {
          setError(err.message);
        } else {
          setError('Failed to load results. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError('No user ID found. Please log in again.');
      setLoading(false);
    }
  }, [userId]);

  const getAssessment = (assessmentId) =>
    assessments.find((a) => a.assessmentId === assessmentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-700 font-medium text-lg">Loading Your Results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-red-100 border border-red-300 text-red-700 px-8 py-6 rounded-2xl shadow-lg max-w-md">
          <div className="text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="font-semibold text-xl mb-3">Something went wrong</h3>
            <p className="mb-6 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-purple-800 mb-4">
            📊 My Results
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-purple-100 shadow-sm">
              <div className="text-8xl mb-6">📋</div>
              <h3 className="text-2xl font-semibold text-purple-800 mb-4">No Results Yet</h3>
              <p className="text-purple-600 mb-2">You haven't completed any assessments yet.</p>
              <p className="text-sm text-purple-500">
                Take some assessments to see your performance here!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {results.map((r, i) => {
              const assessment = getAssessment(r.assessmentId);
              const title = assessment?.title || 'Unknown Assessment';
              const maxScore = assessment?.maxScore || 100;
              const percentage = Math.round((r.score / maxScore) * 100);
              const isPass = percentage >= 40;

              return (
                <motion.div
                  key={r.resultId}
                  className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">
                        {title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-purple-600">
                        <span className="bg-purple-100 px-3 py-1 rounded-full">
                          📅 {new Date(r.attemptDate).toLocaleDateString()}
                        </span>
                        <span className="bg-pink-100 px-3 py-1 rounded-full">
                          ⏰ {new Date(r.attemptDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        isPass
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {isPass ? '✅ Pass' : '❌ Fail'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-purple-800">
                        Score: {r.score} / {maxScore}
                      </span>
                      <span className="text-2xl font-bold text-purple-700">
                        {percentage}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-4 rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          percentage >= 70 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                          percentage >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600">Performance:</span>
                      <span className={`font-medium ${
                        percentage >= 90 ? 'text-green-600' :
                        percentage >= 70 ? 'text-blue-600' :
                        percentage >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {percentage >= 90 ? '🌟 Excellent' :
                         percentage >= 70 ? '👏 Good' :
                         percentage >= 40 ? '👍 Average' :
                         '📚 Needs Improvement'}
                      </span>
                    </div>
                    <div className="text-purple-500">
                      Result ID: #{r.resultId}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">
                📈 Your Progress Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-700">{results.length}</div>
                  <div className="text-sm text-purple-600">Total Assessments</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-700">
                    {results.filter(r => {
                      const assessment = getAssessment(r.assessmentId);
                      const maxScore = assessment?.maxScore || 100;
                      const percentage = Math.round((r.score / maxScore) * 100);
                      return percentage >= 40;
                    }).length}
                  </div>
                  <div className="text-sm text-green-600">Passed</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(results.reduce((acc, r) => {
                      const assessment = getAssessment(r.assessmentId);
                      const maxScore = assessment?.maxScore || 100;
                      return acc + ((r.score / maxScore) * 100);
                    }, 0) / results.length) || 0}%
                  </div>
                  <div className="text-sm text-blue-600">Average Score</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentResultsPage;