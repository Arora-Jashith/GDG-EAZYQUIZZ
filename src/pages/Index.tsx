
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, BookOpen } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-6">EAZYQUIZZ</h1>
        <p className="text-xl mb-8 max-w-2xl">
          An AI-powered teacher assistant that automates grading and provides personalized feedback to students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">For Teachers</h2>
            <ul className="space-y-2 mb-4">
              <li>✓ Create and manage quizzes easily</li>
              <li>✓ Automatic grading of assignments</li>
              <li>✓ AI-generated personalized feedback</li>
              <li>✓ Track student performance</li>
              <li>✓ Save hours of manual grading</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <ul className="space-y-2 mb-4">
              <li>✓ Take quizzes online</li>
              <li>✓ Receive immediate feedback</li>
              <li>✓ Track your progress</li>
              <li>✓ Personalized learning experience</li>
              <li>✓ Improve with targeted suggestions</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          
          {isAuthenticated && (
            <Button size="lg" variant="outline" onClick={() => navigate('/ai-chat')}>
              <MessageSquare className="mr-2 h-5 w-5" />
              AI Learning Assistant
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
