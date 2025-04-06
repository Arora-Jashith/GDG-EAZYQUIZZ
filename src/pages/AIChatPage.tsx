
import React from 'react';
import MainLayout from '@/components/MainLayout';
import AIChat from '@/components/AIChat';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningInsights from '@/components/LearningInsights';

const AIChatPage = () => {
  const { role, user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">AI Learning Center</h1>
          <p className="text-gray-500">Get personalized help and insights from our AI learning assistant</p>
        </div>
        
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="w-full bg-white p-1 rounded-lg border border-gray-200">
            <TabsTrigger 
              value="chat" 
              className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white rounded-md text-gray-700"
            >
              AI Chat
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white rounded-md text-gray-700"
            >
              Learning Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <AIChat />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-0">
                <LearningInsights userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIChatPage;
