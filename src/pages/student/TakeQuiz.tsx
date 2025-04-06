
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getQuizById, submitQuizAttempt } from '@/services/databaseService';
import { generateQuestionFeedback } from '@/services/aiService';
import { getAILearningInsights } from '@/services/aiService';
import { Quiz, Answer, QuestionType } from '@/types/quiz';

const TakeQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); 

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      
      try {
        console.log("Fetching quiz with ID:", quizId);
        const quizData = await getQuizById(quizId);
        console.log("Retrieved quiz data:", quizData);
        
        if (quizData) {
          
          const transformedQuiz: Quiz = {
            id: quizData.id,
            title: quizData.title,
            description: quizData.description || '',
            createdBy: quizData.created_by || '',
            createdOn: quizData.created_at || '',
            questions: []
          };
          
          
          if ('questions' in quizData && Array.isArray(quizData.questions)) {
            
            transformedQuiz.questions = quizData.questions.map(q => {
              
              const validType: QuestionType = validateQuestionType(q.type);
              
              return {
                ...q,
                quizId: quizData.id,
                type: validType 
              };
            });
          }
          
          setQuiz(transformedQuiz);
          
          
          if (transformedQuiz.questions.length > 0) {
            const initialAnswers: Record<string, string> = {};
            transformedQuiz.questions.forEach(q => {
              initialAnswers[q.id] = '';
            });
            setAnswers(initialAnswers);
          }
        } else {
          toast.error('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

 
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  
  const validateQuestionType = (type: string): QuestionType => {
    const validTypes: QuestionType[] = ['multiple-choice', 'essay', 'short-answer', 'true-false', 'one-liner'];
    
    if (validTypes.includes(type as QuestionType)) {
      return type as QuestionType;
    }
    
    
    console.warn(`Invalid question type: ${type}. Defaulting to 'essay'`);
    return 'essay';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = (quiz: Quiz, userAnswers: Record<string, string>): { score: number, answerResults: Answer[] } => {
    let correctCount = 0;
    const answerResults: Answer[] = [];
    
    for (const question of quiz.questions) {
      const userAnswer = userAnswers[question.id] || '';
      let isCorrect = false;
      
      if (question.type === 'multiple-choice' && question.correctAnswer) {
        isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) correctCount++;
        
        answerResults.push({
          questionId: question.id,
          selectedAnswerId: userAnswer,
          isCorrect
        });
      } else {
        
        answerResults.push({
          questionId: question.id,
          answer: userAnswer
        });
      }
    }
    
    
    const mcQuestions = quiz.questions.filter(q => q.type === 'multiple-choice');
    const score = mcQuestions.length > 0
      ? Math.round((correctCount / mcQuestions.length) * 100)
      : 0; 
    
    return { score, answerResults };
  };

  const handleSubmit = async () => {
    if (!quiz || !user) {
      toast.error('Cannot submit quiz: Quiz data or user information is missing');
      return;
    }
    
   
    const unanswered = Object.entries(answers).filter(([_, value]) => !value.trim());
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions before submitting`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting quiz answers:", answers);
      
      
      const { score, answerResults } = calculateScore(quiz, answers);
      
      
      const feedbackPromises = answerResults.map(async (answer) => {
        const question = quiz.questions.find(q => q.id === answer.questionId);
        if (!question) return answer;
        
        try {
          const correctOption = question.type === 'multiple-choice' && question.correctAnswer
            ? question.options?.find(o => o.id === question.correctAnswer)?.text
            : undefined;
          
          const feedbackResult = await generateQuestionFeedback({
            questionText: question.text,
            studentAnswer: answer.answer || answer.selectedAnswerId || '',
            correctAnswer: correctOption,
            isCorrect: answer.isCorrect
          });
          
          return { ...answer, feedback: feedbackResult };
        } catch (error) {
          console.error('Error generating feedback:', error);
          return answer;
        }
      });
      
      const answersWithFeedback = await Promise.all(feedbackPromises);
      
      
      const attempt = await submitQuizAttempt({
        studentId: user.id,
        quizId: quiz.id,
        score,
        answers: answersWithFeedback
      });
      
      toast.success('Quiz submitted successfully');
      
      
      console.log("Redirecting to results page with attempt ID:", attempt.id);
      navigate(`/student/quiz-results/${attempt.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading quiz...</p>
        </div>
      </MainLayout>
    );
  }

  if (!quiz) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Quiz not found. Please go back to the dashboard and select a valid quiz.</p>
        </div>
      </MainLayout>
    );
  }

  
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-gray-500">{quiz.description}</p>
        </div>
        <div className="flex justify-center items-center min-h-[40vh]">
          <p>This quiz has no questions yet. Please try another quiz.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{quiz?.title}</h1>
          <p className="text-gray-500">Answer all questions before submitting</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono mb-1">{formatTime(timeLeft)}</div>
          <p className="text-sm text-gray-500">Time Remaining</p>
        </div>
      </div>

      <div className="space-y-8 mb-8">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Question {index + 1}:</h2>
            <p className="mb-6">{question.text}</p>
            
            {question.type === 'multiple-choice' && question.options ? (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`option-${question.id}-${option.id}`} />
                      <Label htmlFor={`option-${question.id}-${option.id}`}>{option.text}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-32"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </Button>
      </div>
    </MainLayout>
  );
};

export default TakeQuiz;
