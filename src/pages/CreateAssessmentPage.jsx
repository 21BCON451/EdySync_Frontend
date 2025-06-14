import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CreateAssessmentPage = () => {
  const [formData, setFormData] = useState({
    assessmentTitle: "",
    assessmentDescription: "",
    courseId: "",
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
   
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://localhost:7262/api/Course");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      assessmentTitle: formData.assessmentTitle,
      assessmentDescription: formData.assessmentDescription,
      courseId: parseInt(formData.courseId), // Ensure it's an integer
    };

    try {
      const response = await fetch("https://localhost:7262/api/Assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Assessment created successfully", data);

      
      setFormData({
        assessmentTitle: "",
        assessmentDescription: "",
        courseId: "",
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  return (
    <div
      style={{
        padding: '48px 24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            textAlign: 'center',
            background: 'linear-gradient(to right, #581c87, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}
        >
          Create Assessment
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#475569',
            marginBottom: 48,
          }}
        >
          Build a new assessment for your students
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: 16,
            padding: 2,
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor="assessmentTitle"
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#374151',
                  }}
                >
                  Assessment Title
                </label>
                <input
                  type="text"
                  id="assessmentTitle"
                  name="assessmentTitle"
                  value={formData.assessmentTitle}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 16,
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor="assessmentDescription"
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#374151',
                  }}
                >
                  Description
                </label>
                <textarea
                  id="assessmentDescription"
                  name="assessmentDescription"
                  value={formData.assessmentDescription}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 16,
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    minHeight: 120,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label
                  htmlFor="courseId"
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#374151',
                  }}
                >
                  Select Course
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 16,
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <motion.button
                type="submit"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Create Assessment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateAssessmentPage;