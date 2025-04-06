
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import MainLayout from '@/components/MainLayout';
import { getAttemptById, getQuizById } from '@/services/databaseService';
import { toast } from 'sonner';

const QuizResults = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!attemptId) return;
      
      try {
        console.log('Fetching attempt data for ID:', attemptId);
        const attemptData = await getAttemptById(attemptId);
        console.log('Attempt data retrieved:', attemptData);
        
        if (attemptData) {
          setAttempt(attemptData);
          
          // Get quiz data
          const quizData = await getQuizById(attemptData.quizId);
          console.log('Quiz data retrieved:', quizData);
          
          if (quizData) {
            setQuiz(quizData);
          } else {
            console.error('Quiz not found for ID:', attemptData.quizId);
            toast.error('Quiz data not found');
          }
        } else {
          console.error('Attempt not found for ID:', attemptId);
          toast.error('Result data not found');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [attemptId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading results...</p>
        </div>
      </MainLayout>
    );
  }

  if (!attempt || !quiz) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl mb-4">Results not found.</p>
            <Button onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Prepare chart data for correct/incorrect answers
  const correctCount = attempt.answers.filter(a => a.isCorrect).length;
  const incorrectCount = attempt.answers.filter(a => a.isCorrect === false).length;
  const essayCount = attempt.answers.filter(a => a.isCorrect === undefined).length;
  
  const chartData = [
    { name: 'Correct', value: correctCount, color: '#4CAF50' },
    { name: 'Incorrect', value: incorrectCount, color: '#F44336' },
    { name: 'Essay', value: essayCount, color: '#2196F3' }
  ].filter(item => item.value > 0);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{quiz.title} - Results</h1>
        <p className="text-gray-500">Completed on {attempt.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 border rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Score</h2>
            <div className="text-5xl font-bold mb-2">{attempt.score}%</div>
            <p className={`text-sm ${
              attempt.score >= 80 ? 'text-green-600' : 
              attempt.score >= 60 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {attempt.score >= 80 ? 'Excellent' : 
               attempt.score >= 60 ? 'Good' : 
               'Needs Improvement'}
            </p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Overall Feedback:</h3>
            <p className="text-gray-700">{attempt.feedback || 'No feedback provided.'}</p>
          </div>
        </div>
        
        <div className="lg:col-span-2 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mb-8">
        <div className="bg-black text-white p-4">
          <h2 className="text-lg font-semibold">Detailed Feedback</h2>
        </div>
        <div className="divide-y">
          {attempt.answers.map((answer, index) => {
            const question = quiz.questions?.find(q => q.id === answer.questionId);
            if (!question) return null;
            
            const isMultipleChoice = question.type === 'multiple-choice';
            const selectedOption = isMultipleChoice && question.options
              ? question.options.find(o => o.id === answer.selectedAnswerId)?.text
              : null;
            const correctOption = isMultipleChoice && question.correctAnswer && question.options
              ? question.options.find(o => o.id === question.correctAnswer)?.text
              : null;
            
            return (
              <div key={answer.questionId} className="p-4">
                <h3 className="font-medium mb-2">Question {index + 1}:</h3>
                <p className="mb-3">{question.text}</p>
                
                <div className="ml-4 space-y-1 mb-3">
                  <p className="font-medium">Your Answer:</p>
                  <p className={isMultipleChoice ? (answer.isCorrect ? 'text-green-600' : 'text-red-600') : ''}>
                    {selectedOption || answer.answer || 'No answer provided'}
                  </p>
                  
                  {isMultipleChoice && !answer.isCorrect && correctOption && (
                    <>
                      <p className="font-medium mt-2">Correct Answer:</p>
                      <p className="text-green-600">{correctOption}</p>
                    </>
                  )}
                </div>
                
                {answer.feedback && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <p className="font-medium">Feedback:</p>
                    <p className="text-gray-700">{answer.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </MainLayout>
  );
};

export default QuizResults;
