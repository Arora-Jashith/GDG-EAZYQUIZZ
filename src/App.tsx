
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import TrackQuiz from "./pages/teacher/TrackQuiz";
import StudentDashboard from "./pages/student/Dashboard";
import TakeQuiz from "./pages/student/TakeQuiz";
import QuizResults from "./pages/student/QuizResults";
import AIChatPage from "./pages/AIChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {}
            <Route 
              path="/ai-chat" 
              element={
                <ProtectedRoute>
                  <AIChatPage />
                </ProtectedRoute>
              } 
            />
            
            {}
            <Route 
              path="/teacher/dashboard" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/create-quiz" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <CreateQuiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/track-quiz/:quizId" 
              element={
                <ProtectedRoute allowedRole="teacher">
                  <TrackQuiz />
                </ProtectedRoute>
              } 
            />
            
            {}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/take-quiz/:quizId" 
              element={
                <ProtectedRoute allowedRole="student">
                  <TakeQuiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/quiz-results/:attemptId" 
              element={
                <ProtectedRoute allowedRole="student">
                  <QuizResults />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
