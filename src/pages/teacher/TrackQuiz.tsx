
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getQuizzes, getStudentRankings } from '@/services/databaseService';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TrackQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) return;
      
      try {
        const quizzesData = await getQuizzes();
        const foundQuiz = quizzesData.find(q => q.id === quizId);
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
          console.log("Found quiz:", foundQuiz);
          
          if (foundQuiz.hasAttempts) {
            const studentsData = await getStudentRankings();
            setStudents(studentsData);
          }
        } else {
          console.log("Quiz not found with ID:", quizId);
          console.log("Available quizzes:", quizzesData.map(q => q.id));
          toast.error("Quiz not found. It may have been deleted or is not accessible.");
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast.error('Failed to load quiz data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading quiz data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!quiz) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
          <p>Quiz not found. Please make sure you have created the quiz.</p>
          <Button onClick={handleBack} variant="outline" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  
  const formattedDate = quiz.created_at || quiz.createdOn
    ? new Date(quiz.created_at || quiz.createdOn).toLocaleDateString()
    : 'Unknown date';

  
  const showTopStudents = quiz.hasAttempts || false;

  return (
    <MainLayout>
      <div className="mb-4">
        <Button onClick={handleBack} variant="outline" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-500">Created on {formattedDate}</p>
        {quiz.timeLimit && (
          <p className="text-gray-500 mt-1">Time limit: {quiz.timeLimit} minutes</p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${showTopStudents ? "md:grid-cols-2" : ""} gap-6`}>
        <Card className="overflow-hidden">
          <div className="bg-black text-white p-4">
            <h2 className="text-lg font-semibold">Quiz Details</h2>
          </div>
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Title:</h3>
              <p>{quiz.title}</p>
            </div>
            {quiz.description && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Description:</h3>
                <p>{quiz.description}</p>
              </div>
            )}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Questions:</h3>
              {quiz.questions && quiz.questions.length > 0 ? (
                quiz.questions.map((question, index) => (
                  <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0 mb-2">
                    <p><strong>Question {index + 1}:</strong> {question.text}</p>
                    <p className="text-sm text-gray-500">Type: {question.type}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No questions available for this quiz.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {showTopStudents && (
          <Card className="overflow-hidden">
            <div className="bg-black text-white p-4 flex items-center">
              <h2 className="text-lg font-semibold">Top Students</h2>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 5).map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.avgScore}%</TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                        No student attempts yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default TrackQuiz;
