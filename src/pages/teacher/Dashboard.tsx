import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, BarChart2, Clock, Plus, Award, TrendingUp } from 'lucide-react';
import { getQuizzes, getStudentRankings } from '@/services/databaseService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [avgScore, setAvgScore] = useState('N/A');
  const [latestActivity, setLatestActivity] = useState('No activity');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, studentsData] = await Promise.all([
          getQuizzes(),
          getStudentRankings()
        ]);
        
        setQuizzes(quizzesData);
        setStudents(studentsData);
        
        
        if (quizzesData.length > 0) {
          const scoreValue = Math.floor(Math.random() * 30) + 60;
          setAvgScore(`${scoreValue}%`);
        }
        
        
        if (quizzesData.length > 0) {
          
          const sortedQuizzes = [...quizzesData].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          if (sortedQuizzes[0].created_at) {
            const latestDate = new Date(sortedQuizzes[0].created_at);
            setLatestActivity(format(latestDate, 'MMM dd, yyyy'));
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const questionPerformanceData = [
    { name: 'What is React?', score: 90 },
    { name: 'What is JSX?', score: 80 },
    { name: 'React uses a virtual...', score: 95 },
    { name: 'Explain the concept...', score: 60 },
  ];

  
  const quizScoreData = quizzes.length > 0 
    ? quizzes.map(quiz => ({ name: quiz.title, score: Math.floor(Math.random() * 40) + 60 }))
    : [{ name: 'No quizzes available', score: 0 }];

  const quizCompletionData = quizzes.length > 0
    ? quizzes.map(quiz => ({ name: quiz.title, students: Math.floor(Math.random() * 10) + 1 }))
    : [{ name: 'No quizzes available', students: 0 }];

  
  const hasQuizzes = quizzes.length > 0;
  const needsImprovement = hasQuizzes && parseInt(avgScore) < 70;

  const renderStatCard = (title: string, value: string, subtitle: string, icon: React.ReactNode, color?: string) => (
    <div className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-gray-500 text-sm">{subtitle}</p>
          {color && (
            <div className={`mt-2 inline-block px-2 py-1 rounded text-xs ${color}`}>
              ↓Needs Improvement
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-600">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Teacher'}</p>
        </div>
        <Button onClick={() => navigate('/teacher/create-quiz')} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" /> Create Quiz
        </Button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {renderStatCard("Total Students", students.length.toString(), "Students who attempted quizzes", <Users className="h-6 w-6 text-green-600" />)}
        {renderStatCard("Published Quizzes", quizzes.length.toString(), "Active quizzes for students", <BookOpen className="h-6 w-6 text-green-600" />)}
        {renderStatCard("Average Score", avgScore, "Across all quizzes", <BarChart2 className="h-6 w-6 text-green-600" />, needsImprovement ? "bg-red-100 text-red-700" : undefined)}
        {renderStatCard("Latest Activity", latestActivity, "Last quiz update", <Clock className="h-6 w-6 text-green-600" />)}
      </div>

      {}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white rounded-md">Overview</TabsTrigger>
          <TabsTrigger value="student-rankings" className="data-[state=active]:bg-white rounded-md">Student Rankings</TabsTrigger>
          <TabsTrigger value="my-quizzes" className="data-[state=active]:bg-white rounded-md">My Quizzes</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white rounded-md">Analytics</TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Quiz Performance</h2>
                <p className="text-gray-500 text-sm mb-4">Average scores across your quizzes</p>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quizScoreData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-bold">Top Students</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">Highest performing students</p>
                
                {students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-sm">Rank</th>
                          <th className="text-left py-2 px-2 font-semibold text-sm">Student</th>
                          <th className="text-left py-2 px-2 font-semibold text-sm">Avg. Score</th>
                          <th className="text-left py-2 px-2 font-semibold text-sm">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 5).map((student, index) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2">{index + 1}</td>
                            <td className="py-2 px-2">{student.name}</td>
                            <td className="py-2 px-2">{student.avgScore}%</td>
                            <td className="py-2 px-2">
                              {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                              {student.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                              {student.trend === 'same' && <span className="inline-block w-4 h-0.5 bg-gray-400"></span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40 text-gray-500">
                    Create quizzes and have students complete them to see rankings here.
                  </div>
                )}
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('student-rankings')}>
                    View All Rankings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Recent Quizzes</h2>
                <p className="text-gray-500 text-sm mb-4">Your most recently updated quizzes</p>
                
                {quizzes.length > 0 ? (
                  quizzes.slice(0, 2).map((quiz, index) => (
                    <div key={quiz.id} className="border-b last:border-0 py-4">
                      <h3 className="font-medium mb-1">{quiz.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">{quiz.questions?.length || 0} questions</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/teacher/track-quiz/${quiz.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No quizzes created yet. Create your first quiz to see it here.
                  </div>
                )}
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('my-quizzes')}>
                    View All Quizzes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Question Performance</h2>
                <p className="text-gray-500 text-sm mb-4">How students perform on individual questions</p>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={questionPerformanceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {}
        <TabsContent value="student-rankings">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                <h2 className="text-xl font-bold">Student Rankings</h2>
              </div>
              <p className="text-gray-500 mb-6">Performance rankings across all your quizzes</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-1">Overall Student Performance</h3>
                <p className="text-gray-500 text-sm mb-4">Rankings based on average scores across all quizzes</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Rank</th>
                        <th className="text-left py-3 px-4 font-medium">Student</th>
                        <th className="text-left py-3 px-4 font-medium">Best In</th>
                        <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                        <th className="text-left py-3 px-4 font-medium">Quizzes</th>
                        <th className="text-left py-3 px-4 font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? (
                        students.map((student, index) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{student.name}</td>
                            <td className="py-3 px-4">{student.bestIn}</td>
                            <td className="py-3 px-4">{student.avgScore}%</td>
                            <td className="py-3 px-4">{student.quizCount}</td>
                            <td className="py-3 px-4">
                              {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                              {student.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                              {student.trend === 'same' && <span className="inline-block w-4 h-0.5 bg-gray-400"></span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            Create quizzes and have students complete them to see rankings here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="my-quizzes">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">My Quizzes</h2>
              <p className="text-gray-500 mb-6">Manage and review all your created quizzes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="border rounded-lg overflow-hidden">
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1">{quiz.title}</h3>
                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                        Web Development
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        A quiz to test your knowledge on React basics
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <BookOpen className="h-4 w-4 mr-2" /> {quiz.questions.length} Questions
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="h-4 w-4 mr-2" /> 30 min
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/teacher/track-quiz/${quiz.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border rounded-lg border-dashed flex flex-col items-center justify-center p-5 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/teacher/create-quiz')}>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">Create New Quiz</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Performance Analytics</h2>
              <p className="text-gray-500 mb-6">Detailed insights about student performance</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Average Scores by Quiz</h3>
                  <p className="text-gray-500 text-sm mb-4">How students perform across different quizzes</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quizScoreData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Quiz Completions</h3>
                  <p className="text-gray-500 text-sm mb-4">Number of students completing each quiz</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quizCompletionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default TeacherDashboard;
