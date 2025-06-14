import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function TakeAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const res = await axios.get(`https://localhost:7156/api/Assessments/${id}`);
        const data = res.data;
        const parsed = JSON.parse(data.questions);
        setAssessment(data);
        setQuestions(parsed);
      } catch (err) {
        setError(err);
      }
    }

    fetchAssessment();
  }, [id]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let correct = 0;

    questions.forEach((q, i) => {
      const correctAnswer = q.correctAnswer?.toLowerCase();
      const selected = answers[i]?.toLowerCase();
      if (selected && correctAnswer === selected) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * assessment.maxScore);
    setScore(calculatedScore);
    setSubmitted(true);

    // Optional: Save result to backend
    try {
      await axios.post('https://localhost:7156/api/Results', {
        assessmentId: assessment.assessmentId,
        userId: localStorage.getItem('userId'), // Replace this with actual logged-in user ID
        score: calculatedScore,
        attemptDate: new Date().toISOString()
      });
      alert('🎉 Result submitted successfully!');
    } catch (err) {
      console.error('❌ Failed to submit result:', err);
      alert('Something went wrong saving your result.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-red-100 border border-red-300 text-red-700 px-8 py-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-lg">Error Loading Assessment</h3>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-700 font-medium text-lg">Loading Assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            {assessment.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-purple-600">
            <span className="bg-purple-100 px-4 py-2 rounded-full">
              📝 {questions.length} Questions
            </span>
            <span className="bg-pink-100 px-4 py-2 rounded-full">
              🎯 Max Score: {assessment.maxScore}
            </span>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-300 to-pink-300 mx-auto rounded-full mt-4"></div>
        </motion.div>

        {/* Questions */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {questions.map((q, i) => (
            <motion.div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  <span className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm mr-3">
                    Q{i + 1}
                  </span>
                  {q.question1 || q.questionText}
                </h3>
              </div>

              <div className="space-y-3">
                {q.options?.map((opt, j) => (
                  <motion.label
                    key={j}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      answers[i] === opt
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-purple-100 bg-white/50 hover:border-purple-200 hover:bg-purple-25'
                    } ${submitted ? 'cursor-not-allowed opacity-75' : ''}`}
                    whileHover={!submitted ? { scale: 1.02 } : {}}
                    whileTap={!submitted ? { scale: 0.98 } : {}}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleAnswerChange(i, opt)}
                      disabled={submitted}
                      className="w-5 h-5 text-purple-500 border-purple-300 focus:ring-purple-400 focus:ring-2"
                    />
                    <span className="ml-4 text-purple-700 font-medium">{opt}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button or Score */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Submit Assessment
              </span>
            </button>
          ) : (
            <motion.div
              className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-8 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Assessment Completed!
                </h3>
                <div className="text-3xl font-bold text-green-700">
                  Your Score: {score} / {assessment.maxScore}
                </div>
                <div className="mt-4 text-green-600">
                  {score === assessment.maxScore ? "Perfect Score! 🌟" : 
                   score >= assessment.maxScore * 0.8 ? "Great Job! 👏" : 
                   score >= assessment.maxScore * 0.6 ? "Good Effort! 👍" : "Keep Learning! 📚"}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TakeAssessmentPage;