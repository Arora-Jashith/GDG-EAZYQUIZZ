
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Bot, Search, BookOpen, HelpCircle, MessageSquare, ArrowUp } from 'lucide-react';

type ChatMessage = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const AIChat = () => {
  const { user, role } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeChatTip, setActiveChatTip] = useState<string | null>(null);

  const chatTips = [
    {
      id: 'explain',
      icon: <HelpCircle className="h-5 w-5 text-gray-700" />,
      title: 'Explain difficult concepts and topics'
    },
    {
      id: 'materials',
      icon: <BookOpen className="h-5 w-5 text-gray-700" />,
      title: 'Help understand study materials'
    },
    {
      id: 'tips',
      icon: <MessageSquare className="h-5 w-5 text-gray-700" />,
      title: 'Provide study tips and techniques'
    },
    {
      id: 'quiz',
      icon: <Search className="h-5 w-5 text-gray-700" />,
      title: 'Answer questions about quiz topics'
    }
  ];

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) {
        setLoadingHistory(false);
        return;
      }

      try {
        
        const userId = user.id || 'guest-user-123';
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat messages:', error);
          setLoadingHistory(false);
          return;
        }

        if (data) {
          const formattedMessages = data.map((msg): ChatMessage => ({
            id: msg.id,
            content: msg.message,
            isUser: true,
            timestamp: new Date(msg.created_at)
          }));

          data.forEach((msg) => {
            if (msg.response) {
              formattedMessages.push({
                id: `response-${msg.id}`,
                content: msg.response,
                isUser: false,
                timestamp: new Date(msg.created_at)
              });
            }
          });

          formattedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userId = user?.id || 'guest-user-123';
    
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      try {
        await supabase
          .from('chat_messages')
          .insert({
            user_id: userId,
            message: input
          });
      } catch (err) {
        console.error('Error saving message:', err);
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: input, role: role || 'student' }
      });

      if (error) throw error;

      if (!data || !data.response) {
        throw new Error('No response from AI service');
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      try {
        await supabase
          .from('chat_messages')
          .update({ response: data.response })
          .eq('user_id', userId)
          .eq('message', input);
      } catch (err) {
        console.error('Error updating message with response:', err);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: `I'm sorry, I couldn't process your message right now. Please try again in a moment.`,
        isUser: false,
        timestamp: new Date()
      }]);
      
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatTipClick = (tip: string) => {
    let message = '';
    
    switch(tip) {
      case 'explain':
        message = "Can you explain the concept of React hooks to me?";
        break;
      case 'materials':
        message = "How can I better understand JavaScript closures?";
        break;
      case 'tips':
        message = "What are some effective study techniques for programming concepts?";
        break;
      case 'quiz':
        message = "What should I focus on when studying for my web development quiz?";
        break;
      default:
        message = "Hi, I need help with my studies.";
    }
    
    setInput(message);
    setActiveChatTip(tip);
  };

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white text-black rounded-lg border border-gray-200">
        <Loader2 className="h-8 w-8 animate-spin text-black mb-2" />
        <p className="text-black">Loading your conversation history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-black p-4 text-white border-b border-gray-200">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-3" />
          <h3 className="font-semibold text-lg">AI Learning Assistant</h3>
        </div>
      </div>
      
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.length === 0 ? (
              <div className="text-center text-gray-700 mt-8 p-6 bg-white rounded-lg border border-gray-200">
                <Bot className="h-10 w-10 mx-auto mb-2 text-black" />
                <h3 className="font-medium mb-2">Hi there! I'm your AI learning assistant. How can I help you with your studies today?</h3>
                <p className="text-sm">Ask me questions about concepts, study strategies, or specific topics.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-1 ${message.isUser ? 'text-gray-300' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any topic or assignment..."
                className="flex-1 min-h-10 resize-none bg-white border-gray-200 text-black placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !input.trim()}
                className="h-10 w-10 p-0 rounded-full bg-black hover:bg-gray-800 text-white"
              >
                {loading ? 
                  <Loader2 className="h-5 w-5 animate-spin" /> : 
                  <ArrowUp className="h-5 w-5" />
                }
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-72 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-black">I can help with:</h3>
              <div className="space-y-3">
                {chatTips.map(tip => (
                  <div 
                    key={tip.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${activeChatTip === tip.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleChatTipClick(tip.id)}
                  >
                    {tip.icon}
                    <span className="ml-2 text-sm text-gray-700">{tip.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-black">Tips for Better Responses</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Be specific with your questions</p>
                <p>Provide context when needed</p>
                <p>Ask follow-up questions if you need clarification</p>
                <p>Break down complex problems into simpler parts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
