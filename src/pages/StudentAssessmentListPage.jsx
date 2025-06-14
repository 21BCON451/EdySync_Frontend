import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentAssessmentListPage = () => {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;

    const fetchAssessments = async () => {
      try {
        const res = await api.get('/Assessments'); // ✅ NO `/api`
        const filtered = res.data.filter(a => a.courseId === courseId);
        setAssessments(filtered);
      } catch (err) {
        console.error('Failed to fetch assessments', err);
      }
    };

    const fetchCourseTitle = async () => {
      try {
        const res = await api.get(`/Courses/${courseId}`); // ✅ FIXED
        setCourseTitle(res.data.title || 'Course');
      } catch (err) {
        console.error('Course title fetch failed', err);
      }
    };

    fetchCourseTitle();
    fetchAssessments();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-purple-800 mb-2">
            Assessments for: {courseTitle}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
        </motion.div>

        {assessments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-purple-100 border border-purple-200 text-purple-700 px-6 py-4 rounded-lg inline-block">
              No assessments found for this course.
            </div>
          </div>
        ) : (
          <motion.ul
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {assessments.map((a) => (
              <motion.li
                key={a.assessmentId}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    {a.title}
                  </h3>
                  <div className="flex items-center text-sm text-purple-600">
                    <span className="bg-purple-100 px-3 py-1 rounded-full">
                      🎯 Max Score: {a.maxScore}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/student/assessments/${a.assessmentId}/take`)}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Take Assessment
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default StudentAssessmentListPage;