import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    maxScore: 100,
    questions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      // Fixed: Removed duplicate /api
      const res = await api.get('/Assessments');
      setAssessments(res.data);
    } catch (err) {
      console.error('Failed to fetch assessments', err);
      setError('Failed to fetch assessments');
    }
  };

  const fetchCourses = async () => {
    try {
      // Fixed: Removed duplicate /api
      const res = await api.get('/Courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
      setError('Failed to fetch courses');
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate JSON format first
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(form.questions);
      } catch (jsonError) {
        throw new Error('Invalid JSON format in questions field');
      }

      // Validate questions structure
      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Questions must be an array');
      }

      // Validate each question has required fields
      for (let i = 0; i < parsedQuestions.length; i++) {
        const q = parsedQuestions[i];
        if (!q.questionText || !q.options || !q.correctAnswer) {
          throw new Error(`Question ${i + 1} is missing required fields (questionText, options, correctAnswer)`);
        }
        if (!Array.isArray(q.options)) {
          throw new Error(`Question ${i + 1} options must be an array`);
        }
      }

      // Create payload matching Swagger schema
      const payload = {
        title: form.title, // lowercase to match AssessmentCreateDTO
        questions: form.questions, // Keep as JSON string as per Swagger
        maxScore: parseInt(form.maxScore, 10),
        courseId: form.courseId // lowercase to match AssessmentCreateDTO
      };

      console.log('Sending payload:', payload); // Debug log

      // Fixed: Removed duplicate /api
      await api.post('/Assessments', payload);
      
      // Reset form and refresh data
      setForm({ courseId: '', title: '', maxScore: 100, questions: '' });
      await fetchAssessments();
      setError('');
      
    } catch (error) {
      console.error('Failed to create assessment', error);
      
      if (error.message.includes('JSON')) {
        setError('❗ Please enter valid JSON for the Questions field.');
      } else if (error.response) {
        // API error response
        setError(`API Error: ${error.response.data?.message || error.response.statusText}`);
      } else {
        setError(error.message || 'Failed to create assessment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    
    try {
      // Fixed: Removed duplicate /api
      await api.delete(`/Assessments/${assessmentId}`);
      await fetchAssessments();
      setError('');
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      setError('Error deleting assessment');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAssessments();
  }, []);

  return (
    <motion.div 
      className="p-6 max-w-6xl mx-auto" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-purple-500">
        Manage Assessments
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <motion.form 
        onSubmit={handleCreateAssessment} 
        className="space-y-4 mb-12 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700" 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">
          Create New Assessment
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Course *
            </label>
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Assessment Title *
            </label>
            <input
              type="text"
              placeholder="Enter assessment title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Score *
            </label>
            <input
              type="number"
              placeholder="Enter maximum score"
              value={form.maxScore}
              onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
              className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Questions (JSON Format) *
            </label>
            <textarea
              placeholder={`[
  {
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "4", "5"],
    "correctAnswer": "4"
  },
  {
    "questionText": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": "Paris"
  }
]`}
              value={form.questions}
              onChange={(e) => setForm({ ...form, questions: e.target.value })}
              className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              rows={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter questions in JSON format. Each question must have questionText, options (array), and correctAnswer.
            </p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-800 to-purple-500 text-white px-5 py-2.5 rounded-md font-semibold hover:from-purple-900 hover:to-purple-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Creating...' : '➕ Create Assessment'}
        </button>
      </motion.form>

      {/* Assessment Cards */}
      {assessments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-slate-300 text-lg">No assessments found.</p>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">Create your first assessment using the form above.</p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" 
          initial="hidden" 
          animate="visible" 
          variants={{ 
            visible: { 
              transition: { 
                staggerChildren: 0.1 
              } 
            } 
          }}
        >
          {assessments.map((assessment) => {
            const course = courses.find((c) => c.courseId === assessment.courseId);
            return (
              <motion.div 
                key={assessment.assessmentId} 
                className="bg-white dark:bg-slate-800 p-6 border-2 border-purple-100 dark:border-purple-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-95 hover:border-purple-300 dark:hover:border-purple-500 group" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    📋
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                      Assessment
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors">
                  {assessment.title}
                </h4>
                
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                    <span className="mr-2">🎓</span>
                    Course: <span className="font-semibold ml-1 text-purple-700 dark:text-purple-300">{course?.title || 'Unknown'}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                    <span className="mr-2">🎯</span>
                    Max Score: <span className="font-semibold ml-1 text-purple-700 dark:text-purple-300">{assessment.maxScore}</span>
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <motion.button 
                    onClick={() => navigate(`/assessments/edit/${assessment.assessmentId}`)} 
                    className="flex-1 text-sm text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-500 rounded-xl px-4 py-2 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900 transition-all text-center shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✏️ Edit
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDeleteAssessment(assessment.assessmentId)} 
                    className="flex-1 text-sm text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗑️ Delete
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssessmentsPage;