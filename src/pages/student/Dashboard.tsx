
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzes, getAttemptsByStudentId } from '@/services/databaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIChat from '@/components/AIChat';
import LearningInsights from '@/components/LearningInsights';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, BookOpen, TrendingUp, Activity, Check, X, ArrowUp, MessageCircle, Calendar, Code } from 'lucide-react';
import { toast } from 'sonner';
import { getAILearningInsights } from '@/services/aiService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [insightsRefreshCounter, setInsightsRefreshCounter] = useState(0);
  const navigate = useNavigate();
  
  const [learningInsights, setLearningInsights] = useState({
    strengths: [],
    areasToImprove: [],
    recommendations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const quizzesData = await getQuizzes();
        setUpcomingQuizzes(quizzesData || []); 
        
       
        if (user?.id) {
          const attemptsData = await getAttemptsByStudentId(user.id);
          console.log("Student attempts:", attemptsData);
          setRecentAttempts(attemptsData || []);
          
          
          if (attemptsData && attemptsData.length > 0) {
            const insights = await getAILearningInsights(user.id);
            setLearningInsights(insights);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  
  const handleStartQuiz = (quizId: string | number) => {
    navigate(`/student/take-quiz/${quizId}`);
    toast.success("Quiz Started", {
      description: "Good luck on your quiz!"
    });
  };

  
  const refreshAfterQuizCompletion = () => {
    
    if (user?.id) {
      getAttemptsByStudentId(user.id).then(attemptsData => {
        setRecentAttempts(attemptsData || []);
        
        getAILearningInsights(user.id).then(insights => {
          setLearningInsights(insights);
        });
        
        setInsightsRefreshCounter(prev => prev + 1);
      });
    }
  };

  
  useEffect(() => {
    
    const simulateQuizCompletion = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('completed') === 'true') {
        refreshAfterQuizCompletion();
        
        navigate('/student/dashboard', { replace: true });
      }
    };
    
    simulateQuizCompletion();
  }, [navigate]);

  
  const chartData = upcomingQuizzes.map(quiz => {
    
    const attempt = recentAttempts.find(a => a.quizId === quiz.id);
    return {
      name: quiz.title,
      score: attempt?.score || 0
    };
  });

  
  const avgScore = recentAttempts.length 
    ? Math.round(recentAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / recentAttempts.length) 
    : 0;

  const quizzesCompleted = recentAttempts.length;
  
  const highestScore = recentAttempts.length 
    ? Math.max(...recentAttempts.map(attempt => attempt.score || 0)) 
    : 0;
  
  
  let improvement = 0;
  let showImprovement = false;
  
  if (recentAttempts.length >= 2) {
    
    const sortedAttempts = [...recentAttempts].sort((a, b) => 
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
    
    
    const mostRecent = sortedAttempts[0];
    const previousAttempt = sortedAttempts[1];
    
    
    if (previousAttempt.score > 0) {
      improvement = Math.round(((mostRecent.score - previousAttempt.score) / previousAttempt.score) * 100);
      showImprovement = true;
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

 
  const { strengths, areasToImprove: areasForImprovement, recommendations } = learningInsights;

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Your Performance Analytics</h1>
          <p className="text-gray-600">Track your progress and improve your learning</p>
          
          <div className="flex justify-end mt-4 gap-3">
            <Button variant="outline" onClick={() => navigate('/ai-chat')}>
              <MessageCircle className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            <Button onClick={() => navigate('/student/take-quiz/1')}>
              Take More Quizzes
            </Button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-gray-500 mb-2">Average Score</h3>
              <div className="flex items-baseline">
                <Award className="text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{avgScore}%</span>
              </div>
              <div className="mt-2 bg-gray-200 h-2 rounded-full w-full">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${avgScore}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h3 className="text-gray-500 mb-2">Quizzes Completed</h3>
              <div className="flex items-baseline">
                <BookOpen className="text-purple-500 mr-2" />
                <span className="text-3xl font-bold">{quizzesCompleted}</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Total quizzes attempted</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h3 className="text-gray-500 mb-2">Highest Score</h3>
              <div className="flex items-baseline">
                <TrendingUp className="text-green-500 mr-2" />
                <span className="text-3xl font-bold">{highestScore}%</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Your best performance</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <h3 className="text-gray-500 mb-2">Improvement</h3>
              <div className="flex items-baseline">
                {showImprovement ? (
                  improvement > 0 ? (
                    <ArrowUp className="text-green-500 mr-2" />
                  ) : (
                    <ArrowUp className="text-red-500 mr-2 transform rotate-180" />
                  )
                ) : (
                  <Activity className="text-amber-500 mr-2" />
                )}
                <span className="text-3xl font-bold">
                  {showImprovement ? `${improvement > 0 ? '+' : ''}${improvement}%` : 'N/A'}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {recentAttempts.length < 2 
                  ? 'Complete more quizzes to see improvement' 
                  : 'Improvement from previous quiz'}
              </p>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Available Tech Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingQuizzes.length > 0 ? (
              upcomingQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Code className="h-5 w-5 text-blue-500 mr-2" />
                      <CardTitle>{quiz.title}</CardTitle>
                    </div>
                    <CardDescription>{quiz.description || 'Take this quiz to test your knowledge'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {quiz.deadline || 'No deadline'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {quiz.questions?.length || 0} questions
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{quiz.topic || 'Technology'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      Start Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No quizzes available yet</p>
                <p>Check back later for new quizzes to attempt</p>
              </div>
            )}
          </div>
        </div>

        {}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 bg-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="aiInsights">AI Insights</TabsTrigger>
            <TabsTrigger value="quizHistory">Quiz History</TabsTrigger>
            <TabsTrigger value="aiChat">AI Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">Quiz Performance</h2>
                    <p className="text-gray-500 text-sm mb-4">Your scores across different quizzes</p>
                    
                    {chartData.length > 0 && recentAttempts.length > 0 ? (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData.filter(item => item.score > 0)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#000" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-64 text-gray-500">
                        No quiz data available yet. Take some quizzes to see your performance.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <h2 className="text-xl font-bold">Areas for Improvement</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">Topics that need more attention</p>
                    
                    {recentAttempts.length > 0 ? (
                      <div className="space-y-3">
                        {areasForImprovement.map((area, index) => (
                          <div key={index} className="flex items-start">
                            <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{area}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Complete quizzes to identify areas for improvement
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <h2 className="text-xl font-bold">Strengths</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">Topics you excel at</p>
                    
                    {recentAttempts.length > 0 ? (
                      <div className="space-y-3">
                        {strengths.map((strength, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{strength}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Complete quizzes to identify your strengths
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">Recommendations</h2>
                    <p className="text-gray-500 text-sm mb-4">AI-generated learning recommendations</p>
                    
                    {recentAttempts.length > 0 ? (
                      <div className="space-y-3">
                        {recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start bg-blue-50 p-3 rounded-md">
                            <Activity className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Complete quizzes to get personalized recommendations
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Learning Progress</h2>
                {recentAttempts.length > 0 ? (
                  <div>
                    <p className="mb-4">Your progress across {recentAttempts.length} completed quizzes:</p>
                    
                    <div className="space-y-4 mt-6">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Quiz Completion Rate</h3>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{width: `${Math.min(recentAttempts.length * 10, 100)}%`}}></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{recentAttempts.length} of 10 recommended quizzes completed</p>
                      </div>
                      
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Average Performance</h3>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: `${avgScore}%`}}></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{avgScore}% average score across all quizzes</p>
                      </div>
                      
                      {showImprovement && (
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Learning Improvement</h3>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${improvement > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                              style={{width: `${Math.abs(improvement) * 2}%`}}></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            {improvement > 0 ? `+${improvement}%` : `${improvement}%`} improvement from previous quiz
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Complete quizzes to see your learning progress tracked here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aiInsights">
            <Card className="border-white/10 bg-black">
              <CardContent className="p-0">
                <LearningInsights userId={user?.id} forceRefresh={insightsRefreshCounter} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizHistory">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Quiz History</h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Quiz Name</th>
                        <th className="text-left py-3 px-4 font-medium">Score</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttempts.map((attempt) => {
                        const quiz = upcomingQuizzes.find(q => q.id === attempt.quizId);
                        return (
                          <tr key={attempt.id} className="border-t border-gray-200">
                            <td className="py-3 px-4">{quiz?.title || `Quiz ${attempt.quizId}`}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded ${
                                attempt.score >= 80 ? 'bg-green-100 text-green-800' : 
                                attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="py-3 px-4">{attempt.date}</td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/student/quiz-results/${attempt.id}`)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {recentAttempts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                            No recent attempts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aiChat">
            <AIChat />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
