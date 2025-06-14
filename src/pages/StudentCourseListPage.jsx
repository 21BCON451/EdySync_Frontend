import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCoursesAndAssessments = async () => {
    try {
      const [courseRes, assessmentRes] = await Promise.all([
        api.get('/Courses'),
        api.get('/Assessments')
      ]);

      console.log('📘 Courses:', courseRes.data);
      console.log('📝 Assessments:', assessmentRes.data);

      const allCourses = courseRes.data;
      const allAssessments = assessmentRes.data;

      // Keep only courses that have at least one matching assessment
      const coursesWithAssessments = allCourses.filter(course =>
        allAssessments.some(assess => String(assess.courseId) === String(course.courseId))
      );

      setCourses(coursesWithAssessments);
      setAssessments(allAssessments);
    } catch (err) {
      console.error('❌ Failed to fetch data', err);
      setError('Could not load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssessments = (courseId) => {
    if (!courseId) {
      alert('Invalid course ID');
      return;
    }
    navigate(`/student/courses/${courseId}/assessments`);
  };

  useEffect(() => {
    fetchCoursesAndAssessments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-purple-800 mb-2">
            Available Courses
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-purple-600 font-medium">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg inline-block">
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-purple-100 border border-purple-200 text-purple-700 px-6 py-4 rounded-lg inline-block">
              No available courses with assessments.
            </div>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              },
            }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.courseId}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    {course.title || 'Untitled Course'}
                  </h3>
                  <p className="text-sm text-purple-600 leading-relaxed">
                    {course.description || 'No description available.'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleViewAssessments(course.courseId)}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  📝 View Assessments
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseListPage;