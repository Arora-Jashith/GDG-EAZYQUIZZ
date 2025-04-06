
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, BookOpen, ArrowUp } from 'lucide-react';
import { getAILearningInsights } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { getAttemptsByStudentId } from '@/services/databaseService';

interface LearningInsightsProps {
  userId?: string;
  isTeacherView?: boolean;
  studentName?: string;
  forceRefresh?: number; 
}

const LearningInsights = ({ 
  userId, 
  isTeacherView = false, 
  studentName,
  forceRefresh = 0
}: LearningInsightsProps) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<{
    strengths: string[];
    areasToImprove: string[];
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedQuizzes, setHasAttemptedQuizzes] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const userIdToUse = userId || user?.id || '';
        
        const attempts = await getAttemptsByStudentId(userIdToUse);
        console.log("Fetched attempts in LearningInsights:", attempts);
        
        const quizAttempted = attempts && attempts.length > 0;
        
        setHasAttemptedQuizzes(quizAttempted);
        setAttemptCount(attempts?.length || 0);
        
        if (quizAttempted) {
          const data = await getAILearningInsights(userIdToUse);
          console.log("Fetched insights:", data);
          setInsights(data);
        } else {
          setInsights(null);
        }
      } catch (error) {
        console.error('Error fetching learning insights:', error);
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userId, user?.id, forceRefresh]); 

  if (loading) {
    return (
      <div className="p-8 text-center bg-white text-black">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading AI insights...</p>
      </div>
    );
  }

  if (!hasAttemptedQuizzes) {
    
    const demoInsights = {
      strengths: ['JavaScript Basics', 'HTML Structure', 'CSS Layouts'],
      areasToImprove: ['React Hooks', 'State Management', 'API Integration'],
      recommendations: [
        'Practice more with React Hooks by building small components',
        'Try building a project with Redux to understand state management better',
        'Review API documentation and integration patterns with RESTful services'
      ]
    };
    
    return (
      <div className="space-y-6 bg-white text-black p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Check className="text-green-600 mr-2 h-5 w-5" />
                <h3 className="text-lg font-bold text-black">Strengths</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Topics you excel at</p>
              
              <div className="space-y-2">
                {demoInsights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <X className="text-red-500 mr-2 h-5 w-5" />
                <h3 className="text-lg font-bold text-black">Areas for Improvement</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Topics that need more attention</p>
              
              <div className="space-y-2">
                {demoInsights.areasToImprove.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="text-blue-500 mr-2 h-5 w-5" />
              <h3 className="text-lg font-bold text-black">Personalized Recommendations</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">AI-generated learning recommendations</p>
            
            <div className="space-y-3">
              {demoInsights.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-md flex items-start border border-blue-100">
                  <ArrowUp className="h-4 w-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-600 italic mt-4">
          These are sample insights for demonstration purposes.
          As {isTeacherView ? 'they take' : 'you take'} more quizzes, the recommendations will become more personalized and accurate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white text-black p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Check className="text-green-600 mr-2 h-5 w-5" />
              <h3 className="text-lg font-bold text-black">Strengths</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Topics you excel at</p>
            
            {insights?.strengths?.length ? (
              <div className="space-y-2">
                {insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{strength}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Complete more quizzes to identify strengths</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <X className="text-red-500 mr-2 h-5 w-5" />
              <h3 className="text-lg font-bold text-black">Areas for Improvement</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Topics that need more attention</p>
            
            {insights?.areasToImprove?.length ? (
              <div className="space-y-2">
                {insights.areasToImprove.map((area, index) => (
                  <div key={index} className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{area}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Complete more quizzes to identify areas for improvement</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="text-blue-500 mr-2 h-5 w-5" />
            <h3 className="text-lg font-bold text-black">Personalized Recommendations</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">AI-generated learning recommendations</p>
          
          {insights?.recommendations?.length ? (
            <div className="space-y-3">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-md flex items-start border border-blue-100">
                  <ArrowUp className="h-4 w-4 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-800">{recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Complete more quizzes to get personalized recommendations</p>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 italic mt-4">
        These insights are generated by AI based on {isTeacherView ? `${studentName}'s` : 'your'} quiz performance patterns. 
        As {isTeacherView ? 'they take' : 'you take'} more quizzes, the recommendations will become more personalized and accurate.
        {attemptCount === 1 && " You've completed 1 quiz so far."}
        {attemptCount > 1 && ` You've completed ${attemptCount} quizzes so far.`}
      </p>
    </div>
  );
};

export default LearningInsights;
