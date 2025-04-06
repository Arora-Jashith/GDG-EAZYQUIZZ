
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';


if (typeof window !== 'undefined') {
  window.quizAttempts = window.quizAttempts || [];
  window.mockQuizzes = window.mockQuizzes || [];
}


export const getAttemptWithProfile = async (attemptId: string) => {
  try {
    
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*, student_id')
      .eq('id', attemptId)
      .single();
      
    if (attemptError) throw attemptError;
    
    if (!attempt) {
      return null;
    }
    
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', attempt.student_id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      
    }
    
    
    return {
      ...attempt,
      profileName: profile?.name || 'Unknown User'
    };
  } catch (error) {
    console.error('Error fetching attempt:', error);
    toast.error('Failed to load attempt details');
    return null;
  }
};


export const getQuizzes = async () => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*');
      
    if (error) throw error;
    
    
    const mockQuizzes = [
      { 
        id: 'mock-1', 
        title: 'JavaScript Fundamentals', 
        description: 'Test your knowledge of JavaScript basics', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What is JavaScript?', type: 'multiple-choice', options: [
            { id: '1', text: 'A programming language' },
            { id: '2', text: 'A markup language' },
            { id: '3', text: 'A database' },
            { id: '4', text: 'An operating system' }
          ], correctAnswer: '1' },
          { id: 'q2', text: 'Which of the following is not a JavaScript data type?', type: 'multiple-choice', options: [
            { id: '1', text: 'String' },
            { id: '2', text: 'Number' },
            { id: '3', text: 'Boolean' },
            { id: '4', text: 'Character' }
          ], correctAnswer: '4' },
          { id: 'q3', text: 'What does the "===" operator do?', type: 'multiple-choice', options: [
            { id: '1', text: 'Assigns a value' },
            { id: '2', text: 'Compares values only' },
            { id: '3', text: 'Compares values and types' },
            { id: '4', text: 'Concatenates strings' }
          ], correctAnswer: '3' },
          { id: 'q4', text: 'Which method adds an element to the end of an array?', type: 'multiple-choice', options: [
            { id: '1', text: 'push()' },
            { id: '2', text: 'pop()' },
            { id: '3', text: 'shift()' },
            { id: '4', text: 'unshift()' }
          ], correctAnswer: '1' },
          { id: 'q5', text: 'What is a closure in JavaScript?', type: 'essay' }
        ]
      },
      { 
        id: 'mock-2', 
        title: 'React Essentials', 
        description: 'Learn about React components and hooks', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What is a React component?', type: 'multiple-choice', options: [
            { id: '1', text: 'A reusable piece of UI' },
            { id: '2', text: 'A JavaScript function' },
            { id: '3', text: 'A CSS style' },
            { id: '4', text: 'A HTML element' }
          ], correctAnswer: '1' },
          { id: 'q2', text: 'Which hook is used for side effects in React?', type: 'multiple-choice', options: [
            { id: '1', text: 'useState' },
            { id: '2', text: 'useEffect' },
            { id: '3', text: 'useContext' },
            { id: '4', text: 'useReducer' }
          ], correctAnswer: '2' },
          { id: 'q3', text: 'What is the virtual DOM?', type: 'multiple-choice', options: [
            { id: '1', text: 'A lightweight copy of the actual DOM' },
            { id: '2', text: 'A browser feature' },
            { id: '3', text: 'A styling framework' },
            { id: '4', text: 'A React component' }
          ], correctAnswer: '1' },
          { id: 'q4', text: 'What does JSX stand for?', type: 'multiple-choice', options: [
            { id: '1', text: 'JavaScript XML' },
            { id: '2', text: 'JavaScript Extension' },
            { id: '3', text: 'JavaScript Syntax' },
            { id: '4', text: 'JavaScript Experience' }
          ], correctAnswer: '1' },
          { id: 'q5', text: 'Explain the concept of React state', type: 'essay' }
        ]
      },
      { 
        id: 'mock-3', 
        title: 'CSS and Styling', 
        description: 'Master modern CSS techniques and layouts', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What does CSS stand for?', type: 'multiple-choice', options: [
            { id: '1', text: 'Cascading Style Sheets' },
            { id: '2', text: 'Computer Style Sheets' },
            { id: '3', text: 'Creative Style System' },
            { id: '4', text: 'Colorful Style Sheets' }
          ], correctAnswer: '1' },
          { id: 'q2', text: 'Which CSS property is used to change text color?', type: 'multiple-choice', options: [
            { id: '1', text: 'text-color' },
            { id: '2', text: 'font-color' },
            { id: '3', text: 'color' },
            { id: '4', text: 'text-style' }
          ], correctAnswer: '3' },
          { id: 'q3', text: 'What is the correct CSS syntax for making all text elements bold?', type: 'multiple-choice', options: [
            { id: '1', text: 'text {font-weight: bold;}' },
            { id: '2', text: 'text {text-weight: bold;}' },
            { id: '3', text: 'text {font: bold;}' },
            { id: '4', text: 'text {style: bold;}' }
          ], correctAnswer: '1' },
          { id: 'q4', text: 'Which property is used for creating a flexbox layout?', type: 'multiple-choice', options: [
            { id: '1', text: 'display: flex' },
            { id: '2', text: 'display: flexbox' },
            { id: '3', text: 'display: box' },
            { id: '4', text: 'display: flexible' }
          ], correctAnswer: '1' },
          { id: 'q5', text: 'Describe the box model in CSS', type: 'essay' }
        ]
      },
      { 
        id: 'mock-4', 
        title: 'HTML Basics', 
        description: 'Learn the fundamentals of HTML markup', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What does HTML stand for?', type: 'multiple-choice', options: [
            { id: '1', text: 'Hyper Text Markup Language' },
            { id: '2', text: 'Home Tool Markup Language' },
            { id: '3', text: 'Hyperlinks and Text Markup Language' },
            { id: '4', text: 'Hyper Technical Modern Language' }
          ], correctAnswer: '1' },
          { id: 'q2', text: 'Which element is used to create a hyperlink?', type: 'multiple-choice', options: [
            { id: '1', text: '<link>' },
            { id: '2', text: '<a>' },
            { id: '3', text: '<hlink>' },
            { id: '4', text: '<url>' }
          ], correctAnswer: '2' },
          { id: 'q3', text: 'Which HTML element is used to define important text?', type: 'multiple-choice', options: [
            { id: '1', text: '<important>' },
            { id: '2', text: '<b>' },
            { id: '3', text: '<strong>' },
            { id: '4', text: '<i>' }
          ], correctAnswer: '3' },
          { id: 'q4', text: 'What is the correct HTML for creating a checkbox?', type: 'multiple-choice', options: [
            { id: '1', text: '<input type="check">' },
            { id: '2', text: '<check>' },
            { id: '3', text: '<checkbox>' },
            { id: '4', text: '<input type="checkbox">' }
          ], correctAnswer: '4' },
          { id: 'q5', text: 'Explain the importance of semantic HTML', type: 'essay' }
        ]
      }
    ];
    
    
    const userCreatedQuizzes = typeof window !== 'undefined' && window.mockQuizzes ? window.mockQuizzes : [];
    
    
    if (data && data.length > 0) {
      const realIds = data.map(quiz => quiz.id);
      const filteredMocks = [...mockQuizzes, ...userCreatedQuizzes].filter(mock => !realIds.includes(mock.id));
      return [...data, ...filteredMocks];
    }
    
    return [...mockQuizzes, ...userCreatedQuizzes];
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    toast.error('Failed to load quizzes');
    
    
    const userCreatedQuizzes = typeof window !== 'undefined' && window.mockQuizzes ? window.mockQuizzes : [];
    return [
      { 
        id: 'mock-1', 
        title: 'JavaScript Fundamentals', 
        description: 'Test your knowledge of JavaScript basics', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What is JavaScript?', type: 'multiple-choice' }
        ]
      },
      { 
        id: 'mock-2', 
        title: 'React Essentials', 
        description: 'Learn about React components and hooks', 
        created_by: 'system',
        created_at: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What is a React component?', type: 'multiple-choice' }
        ]
      },
      ...userCreatedQuizzes
    ];
  }
};

export const getAttemptsByStudentId = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('attempts')
      .select('*, quizzes(*)')
      .eq('student_id', studentId);
      
    if (error) throw error;
    
    
    if (!data || data.length === 0) {
      if (typeof window !== 'undefined' && window.quizAttempts) {
        const localAttempts = window.quizAttempts.filter(a => a.studentId === studentId);
        if (localAttempts.length > 0) {
          return localAttempts;
        }
      }
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching student attempts:', error);
    toast.error('Failed to load your attempts');
    
    
    if (typeof window !== 'undefined' && window.quizAttempts) {
      const localAttempts = window.quizAttempts.filter(a => a.studentId === studentId);
      if (localAttempts.length > 0) {
        return localAttempts;
      }
    }
    return [];
  }
};

export const getStudentRankings = async () => {
  try {
    
    return [
      { id: '1', name: 'Arjun Sharma', avgScore: 92, trend: 'up', bestIn: 'React Fundamentals', quizCount: 4 },
      { id: '2', name: 'Priya Patel', avgScore: 88, trend: 'up', bestIn: 'JavaScript Basics', quizCount: 3 },
      { id: '3', name: 'Vikram Singh', avgScore: 85, trend: 'down', bestIn: 'Web Development', quizCount: 5 },
      { id: '4', name: 'Neha Gupta', avgScore: 83, trend: 'up', bestIn: 'CSS Layouts', quizCount: 3 },
      { id: '5', name: 'Rahul Verma', avgScore: 79, trend: 'same', bestIn: 'Node.js', quizCount: 4 },
      { id: '6', name: 'Ananya Desai', avgScore: 77, trend: 'down', bestIn: 'API Design', quizCount: 2 },
      { id: '7', name: 'Karan Malhotra', avgScore: 75, trend: 'up', bestIn: 'Database Concepts', quizCount: 3 },
      { id: '8', name: 'Divya Agarwal', avgScore: 72, trend: 'same', bestIn: 'UI/UX Principles', quizCount: 4 },
      { id: '9', name: 'Suresh Kumar', avgScore: 68, trend: 'down', bestIn: 'React Hooks', quizCount: 2 },
      { id: '10', name: 'Meera Reddy', avgScore: 65, trend: 'up', bestIn: 'TypeScript', quizCount: 3 },
    ];
  } catch (error) {
    console.error('Error fetching student rankings:', error);
    toast.error('Failed to load student rankings');
    return [];
  }
};

export const generateQuestionFeedback = async (questionData: any) => {
  try {
    
    const { questionText, studentAnswer, correctAnswer, isCorrect } = questionData;
    
    console.log("Generating feedback for:", { questionText, studentAnswer, correctAnswer, isCorrect });
    
    
    if (correctAnswer) {
      if (isCorrect) {
        return `Correct! ${studentAnswer} is the right answer.`;
      } else {
        return `Not quite right. The correct answer is "${correctAnswer}". Your answer was "${studentAnswer}".`;
      }
    } else {
      
      if (studentAnswer.length < 20) {
        return "Your answer is quite brief. Consider elaborating more on the concept to demonstrate deeper understanding.";
      } else if (studentAnswer.length < 50) {
        return "Good start! You've touched on some key points, but there's room for more detailed explanation.";
      } else {
        return "Excellent response! You've provided a thorough explanation that shows good understanding of the concept.";
      }
    }
  } catch (error) {
    console.error('Error generating question feedback:', error);
    return "Unable to generate feedback for this answer.";
  }
};


export const createQuiz = async (quizData) => {
  console.log('Saving quiz data:', quizData);
  try {
    
    const newQuizId = 'quiz-' + Math.random().toString(36).substr(2, 9);
    const newQuiz = {
      ...quizData,
      id: newQuizId,
      created_at: new Date().toISOString()
    };
    
    
    if (typeof window !== 'undefined') {
      window.mockQuizzes = window.mockQuizzes || [];
      window.mockQuizzes.push(newQuiz);
      console.log('Stored new quiz in window.mockQuizzes:', newQuiz);
    }
    
    console.log('Created new quiz:', newQuiz);
    toast.success('Quiz created successfully!');
    return newQuiz;
  } catch (error) {
    console.error('Error saving quiz:', error);
    toast.error('Failed to create quiz');
    return null;
  }
};


export const getMockLearningInsights = (attemptCount = 0) => {
  
  if (attemptCount === 0) {
    return {
      strengths: ['Not enough data'],
      areasToImprove: ['Not enough data'], 
      recommendations: ['Complete more quizzes to get personalized recommendations'],
      improvementRate: 0,
      quizzesCompleted: 0
    };
  }
  
  return {
    strengths: ['JavaScript Basics', 'HTML Structure', 'CSS Layouts'],
    areasToImprove: ['React Hooks', 'State Management', 'API Integration'],
    recommendations: [
      'Practice more with React Hooks',
      'Try building a project with Redux',
      'Review API documentation and integration patterns'
    ],
    improvementRate: attemptCount > 1 ? 15 : 0,
    quizzesCompleted: attemptCount
  };
};


export const getQuizById = async (quizId) => {
  try {
    if (!quizId) return null;
    
    const quizzes = await getQuizzes();
    return quizzes.find(quiz => quiz.id === quizId) || null;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    toast.error('Failed to load quiz');
    return null;
  }
};


export const submitQuizAttempt = async (attemptData) => {
  console.log('Submitting attempt:', attemptData);
  try {
    
    const attemptId = 'attempt-' + Math.random().toString(36).substr(2, 9);
    const attempt = {
      ...attemptData,
      id: attemptId,
      date: format(new Date(), 'MMM dd, yyyy'),
      duration: Math.floor(Math.random() * 30) + 10 
    };
    
    console.log('Created attempt:', attempt);
    
    
    if (typeof window !== 'undefined') {
      window.quizAttempts = window.quizAttempts || [];
      window.quizAttempts.push(attempt);
      console.log("Updated quizAttempts in window:", window.quizAttempts);
    }
    
    return attempt;
  } catch (error) {
    console.error('Error submitting attempt:', error);
    toast.error('Failed to submit quiz attempt');
    throw error;
  }
};


export const getAttemptById = async (attemptId) => {
  try {
    
    if (typeof window !== 'undefined' && window.quizAttempts) {
      const attempt = window.quizAttempts.find(a => a.id === attemptId);
      if (attempt) {
        console.log("Found attempt in window.quizAttempts:", attempt);
        return attempt;
      }
    }
    
    
    console.log(`Fetching attempt with ID: ${attemptId}`);
    
    
    const mockAttempt = {
      id: attemptId,
      quizId: 'mock-1',
      studentId: 'student-1',
      score: 85,
      date: format(new Date(), 'MMM dd, yyyy'),
      feedback: 'Good work on this quiz! You demonstrated a solid understanding of the core concepts.',
      answers: [
        {
          questionId: 'q1',
          selectedAnswerId: '1',
          isCorrect: true,
          feedback: 'Correct! JavaScript is indeed a programming language.'
        },
        {
          questionId: 'q2',
          selectedAnswerId: '4',
          isCorrect: true,
          feedback: 'Right! Character is not a JavaScript data type.'
        },
        {
          questionId: 'q3',
          selectedAnswerId: '3',
          isCorrect: true,
          feedback: 'Correct! The === operator compares both values and types.'
        },
        {
          questionId: 'q4',
          selectedAnswerId: '1',
          isCorrect: true,
          feedback: 'Right! push() adds elements to the end of an array.'
        },
        {
          questionId: 'q5',
          answer: 'A closure is a function that has access to its outer function scope even after the outer function has returned.',
          feedback: "Good explanation! You've captured the essence of closures in JavaScript."
        }
      ]
    };
    
    
    if (typeof window !== 'undefined') {
      window.quizAttempts = window.quizAttempts || [];
      window.quizAttempts.push(mockAttempt);
    }
    
    return mockAttempt;
  } catch (error) {
    console.error('Error fetching attempt by ID:', error);
    toast.error('Failed to load attempt details');
    return null;
  }
};
