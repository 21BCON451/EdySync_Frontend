import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from './Components/MinimalNavbar.jsx';
import Footer from './Components/Footer.jsx';
import MinimalNavbar from './Components/MinimalNavbar.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardPage from './pages/DashboardPage.jsx';


import CoursesPage from './pages/CoursesPage.jsx';
import CreateCourse from './pages/CreateCoursePage.jsx';
import EditCoursePage from './pages/EditCoursePage.jsx';
import AssessmentsPage from './pages/AssessmentsPage.jsx';
import EditAssessmentPage from './pages/EditAssessmentPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import AssessmentResultsPage from './pages/AssessmentResultsPage.jsx';
import StudentsListPage from './pages/StudentsListPage.jsx';


import StudentCourseListPage from './pages/StudentCourseListPage.jsx';
import StudentAssessmentListPage from './pages/StudentAssessmentListPage.jsx';
import TakeAssessmentPage from './pages/TakeAssessmentPage.jsx';
import StudentResultsPage from './pages/StudentResultsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import './index.css'; 

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {isAuthPage ? <MinimalNavbar /> : <Navbar />}

      <main className="flex-grow container px-4 py-6 mx-auto">
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />

          
          <Route path="/courses" element={<PrivateRoute element={<CoursesPage />} />} />
          <Route path="/courses/create" element={<PrivateRoute element={<CreateCourse />} />} />
          <Route path="/courses/edit/:id" element={<PrivateRoute element={<EditCoursePage />} />} />
          <Route path="/assessments" element={<PrivateRoute element={<AssessmentsPage />} />} />
          <Route path="/assessments/edit/:id" element={<PrivateRoute element={<EditAssessmentPage />} />} />
          <Route path="/results" element={<PrivateRoute element={<ResultsPage />} />} />
          <Route path="/assessments/:id/results" element={<PrivateRoute element={<AssessmentResultsPage />} />} />
          <Route path="/students" element={<PrivateRoute element={<StudentsListPage />} />} />

          
          <Route path="/student/courses" element={<PrivateRoute element={<StudentCourseListPage />} />} />
          <Route path="/student/courses/:courseId/assessments" element={<PrivateRoute element={<StudentAssessmentListPage />} />} />
          <Route path="/student/assessments/:id/take" element={<PrivateRoute element={<TakeAssessmentPage />} />} />
          <Route path="/student/results" element={<PrivateRoute element={<StudentResultsPage />} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;