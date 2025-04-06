import { QuizQuestion, Quiz, Answer, Attempt } from '@/types/quiz';

export type Student = {
  id: string;
  name: string;
  email: string;
  progress: number;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subject: string;
};


const students: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    progress: 75,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    progress: 60,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    progress: 90,
  },
];

const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Prof. Williams',
    email: 'williams@example.com',
    subject: 'Computer Science',
  },
  {
    id: '2',
    name: 'Dr. Martinez',
    email: 'martinez@example.com',
    subject: 'Web Development',
  },
];

const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript core concepts and modern features',
    deadline: '2025-04-15',
    topic: 'JavaScript',
    teacherId: '1',
    createdBy: '1',
    createdOn: '2025-03-15',
    questions: [
      {
        id: '1',
        quizId: '1',
        text: 'What is the correct way to declare a variable in modern JavaScript?',
        type: 'multiple-choice',
        options: [
          { id: '1a', text: 'var name = "value";' },
          { id: '1b', text: 'let name = "value";' },
          { id: '1c', text: 'variable name = "value";' },
          { id: '1d', text: 'val name = "value";' },
        ],
        correctAnswer: '1b',
        explanation: 'In modern JavaScript, we use let and const instead of var.',
        points: 10,
      },
      {
        id: '2',
        quizId: '1',
        text: 'What is the purpose of the "async" keyword in JavaScript?',
        type: 'multiple-choice',
        options: [
          { id: '2a', text: 'It makes functions run faster' },
          { id: '2b', text: 'It defines a function that returns a Promise' },
          { id: '2c', text: 'It prevents functions from being called' },
          { id: '2d', text: "It is used for animation timing" },
        ],
        correctAnswer: '2b',
        explanation: 'The async keyword is used to define asynchronous functions that return promises.',
        points: 10,
      },
      {
        id: '3',
        quizId: '1',
        text: 'What is a closure in JavaScript?',
        type: 'multiple-choice',
        options: [
          { id: '3a', text: 'A way to close a browser window' },
          { id: '3b', text: 'A method to end a function execution' },
          { id: '3c', text: 'A function that has access to variables from its outer scope' },
          { id: '3d', text: 'A technique to reduce memory usage' },
        ],
        correctAnswer: '3c',
        explanation: 'Closures are functions that have access to variables from their outer (enclosing) lexical scope.',
        points: 10,
      },
      {
        id: '4',
        quizId: '1',
        text: 'Which of these is NOT a JavaScript data type?',
        type: 'multiple-choice',
        options: [
          { id: '4a', text: 'String' },
          { id: '4b', text: 'Number' },
          { id: '4c', text: 'Class' },
          { id: '4d', text: 'Boolean' },
        ],
        correctAnswer: '4c',
        explanation: 'JavaScript has primitive data types like string, number, boolean, null, undefined, symbol, and bigint. Class is not a data type, but rather a way to create objects.',
        points: 10,
      },
      {
        id: '5',
        quizId: '1',
        text: 'What does the "===" operator do in JavaScript?',
        type: 'multiple-choice',
        options: [
          { id: '5a', text: 'Checks for equality, but converts types if needed' },
          { id: '5b', text: 'Checks for equality without converting types' },
          { id: '5c', text: 'Assigns a value to a variable' },
          { id: '5d', text: 'Checks if a value exists' },
        ],
        correctAnswer: '5b',
        explanation: 'The strict equality operator (===) checks that both value and type are the same without conversion.',
        points: 10,
      },
    ],
  },
  {
    id: 2,
    title: 'React Essentials',
    description: 'Test your understanding of React components, hooks, and state management',
    deadline: '2025-04-20',
    topic: 'React',
    teacherId: '2',
    createdBy: '2',
    createdOn: '2025-03-20',
    questions: [
      {
        id: '6',
        quizId: '2',
        text: 'What is the correct way to create a functional component in React?',
        type: 'multiple-choice',
        options: [
          { id: '6a', text: 'function MyComponent() { return <div>Hello</div>; }' },
          { id: '6b', text: 'class MyComponent { render() { return <div>Hello</div>; } }' },
          { id: '6c', text: 'const MyComponent = () => { render(<div>Hello</div>); }' },
          { id: '6d', text: 'component MyComponent() { return <div>Hello</div>; }' },
        ],
        correctAnswer: '6a',
        explanation: 'Functional components in React are JavaScript functions that return JSX.',
        points: 10,
      },
      {
        id: '7',
        quizId: '2',
        text: 'What is the purpose of useState hook in React?',
        type: 'multiple-choice',
        options: [
          { id: '7a', text: 'To create global state' },
          { id: '7b', text: 'To add state to functional components' },
          { id: '7c', text: 'To connect to a database' },
          { id: '7d', text: 'To render HTML elements' },
        ],
        correctAnswer: '7b',
        explanation: 'useState is a Hook that lets you add React state to functional components.',
        points: 10,
      },
      {
        id: '8',
        quizId: '2',
        text: 'What does useEffect hook do?',
        type: 'multiple-choice',
        options: [
          { id: '8a', text: 'It creates visual effects for React components' },
          { id: '8b', text: 'It optimizes performance' },
          { id: '8c', text: 'It performs side effects in functional components' },
          { id: '8d', text: 'It affects the CSS of a component' },
        ],
        correctAnswer: '8c',
        explanation: 'useEffect allows you to perform side effects in functional components.',
        points: 10,
      },
      {
        id: '9',
        quizId: '2',
        text: 'Which of these is NOT a React Hook?',
        type: 'multiple-choice',
        options: [
          { id: '9a', text: 'useState' },
          { id: '9b', text: 'useEffect' },
          { id: '9c', text: 'useContext' },
          { id: '9d', text: 'useDispatch' },
        ],
        correctAnswer: '9d',
        explanation: 'useDispatch is a Hook from Redux, not from React core. useState, useEffect, and useContext are all built-in React Hooks.',
        points: 10,
      },
      {
        id: '10',
        quizId: '2',
        text: 'What is the key property used for in React lists?',
        type: 'multiple-choice',
        options: [
          { id: '10a', text: 'To style list items differently' },
          { id: '10b', text: 'To help React identify which items have changed' },
          { id: '10c', text: 'To create clickable list items' },
          { id: '10d', text: 'To sort the list alphabetically' },
        ],
        correctAnswer: '10b',
        explanation: 'The key prop helps React identify which items have changed, are added, or are removed, which improves performance when updating the DOM.',
        points: 10,
      },
    ],
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    description: 'Test your knowledge of common data structures and algorithms',
    deadline: '2025-04-25',
    topic: 'Computer Science',
    teacherId: '1',
    createdBy: '1',
    createdOn: '2025-03-25',
    questions: [
      {
        id: '11',
        quizId: '3',
        text: 'What is the time complexity of binary search?',
        type: 'multiple-choice',
        options: [
          { id: '11a', text: 'O(n)' },
          { id: '11b', text: 'O(log n)' },
          { id: '11c', text: 'O(n²)' },
          { id: '11d', text: 'O(1)' },
        ],
        correctAnswer: '11b',
        explanation: 'Binary search has a time complexity of O(log n) because it divides the search space in half each time.',
        points: 10,
      },
      {
        id: '12',
        quizId: '3',
        text: 'Which data structure uses LIFO (Last In, First Out) principle?',
        type: 'multiple-choice',
        options: [
          { id: '12a', text: 'Queue' },
          { id: '12b', text: 'Stack' },
          { id: '12c', text: 'Tree' },
          { id: '12d', text: 'Heap' },
        ],
        correctAnswer: '12b',
        explanation: 'A stack is a data structure that follows LIFO (Last In, First Out) principle.',
        points: 10,
      },
      {
        id: '13',
        quizId: '3',
        text: 'What type of algorithm is Quicksort?',
        type: 'multiple-choice',
        options: [
          { id: '13a', text: 'Divide and Conquer' },
          { id: '13b', text: 'Greedy Algorithm' },
          { id: '13c', text: 'Dynamic Programming' },
          { id: '13d', text: 'Brute Force' },
        ],
        correctAnswer: '13a',
        explanation: 'Quicksort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array.',
        points: 10,
      },
      {
        id: '14',
        quizId: '3',
        text: 'What is the space complexity of a recursive Fibonacci implementation?',
        type: 'multiple-choice',
        options: [
          { id: '14a', text: 'O(1)' },
          { id: '14b', text: 'O(n)' },
          { id: '14c', text: 'O(n²)' },
          { id: '14d', text: 'O(2ⁿ)' },
        ],
        correctAnswer: '14b',
        explanation: 'A recursive Fibonacci implementation has O(n) space complexity due to the call stack depth.',
        points: 10,
      },
      {
        id: '15',
        quizId: '3',
        text: 'Which sorting algorithm has the best average-case time complexity?',
        type: 'multiple-choice',
        options: [
          { id: '15a', text: 'Bubble Sort' },
          { id: '15b', text: 'Selection Sort' },
          { id: '15c', text: 'Merge Sort' },
          { id: '15d', text: 'Insertion Sort' },
        ],
        correctAnswer: '15c',
        explanation: 'Merge sort, quicksort, and heapsort all have O(n log n) average-case time complexity, which is optimal for comparison-based sorting.',
        points: 10,
      },
    ],
  },
  {
    id: 4,
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of modern web development practices',
    deadline: '2025-05-05',
    topic: 'Web Development',
    teacherId: '2',
    createdBy: '2',
    createdOn: '2025-03-30',
    questions: [
      {
        id: '16',
        quizId: '4',
        text: 'What is the purpose of CSS Flexbox?',
        type: 'multiple-choice',
        options: [
          { id: '16a', text: 'To add animations to elements' },
          { id: '16b', text: 'To create flexible layouts in one dimension' },
          { id: '16c', text: 'To compress image files' },
          { id: '16d', text: 'To store website data locally' },
        ],
        correctAnswer: '16b',
        explanation: 'CSS Flexbox is a layout model that allows you to design flexible responsive layouts.',
        points: 10,
      },
      {
        id: '17',
        quizId: '4',
        text: 'Which HTTP method is idempotent?',
        type: 'multiple-choice',
        options: [
          { id: '17a', text: 'POST' },
          { id: '17b', text: 'GET' },
          { id: '17c', text: 'PATCH' },
          { id: '17d', text: 'OPTIONS' },
        ],
        correctAnswer: '17b',
        explanation: 'GET, PUT, and DELETE are idempotent, meaning multiple identical requests should have the same effect as a single request.',
        points: 10,
      },
      {
        id: '18',
        quizId: '4',
        text: 'What does API stand for?',
        type: 'multiple-choice',
        options: [
          { id: '18a', text: 'Application Programming Interface' },
          { id: '18b', text: 'Automated Program Integration' },
          { id: '18c', text: 'Advanced Programming Implementation' },
          { id: '18d', text: 'Application Process Infrastructure' },
        ],
        correctAnswer: '18a',
        explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate with each other.',
        points: 10,
      },
      {
        id: '19',
        quizId: '4',
        text: 'Which technology is NOT typically used in a modern web development stack?',
        type: 'multiple-choice',
        options: [
          { id: '19a', text: 'Node.js' },
          { id: '19b', text: 'GraphQL' },
          { id: '19c', text: 'COBOL' },
          { id: '19d', text: 'TypeScript' },
        ],
        correctAnswer: '19c',
        explanation: 'COBOL is an older programming language primarily used in business and administrative systems, not in modern web development.',
        points: 10,
      },
      {
        id: '20',
        quizId: '4',
        text: 'What is the purpose of a CDN in web development?',
        type: 'multiple-choice',
        options: [
          { id: '20a', text: 'To create database connections' },
          { id: '20b', text: 'To deliver content from servers geographically closer to users' },
          { id: '20c', text: 'To compress JavaScript code' },
          { id: '20d', text: 'To manage API authentication' },
        ],
        correctAnswer: '20b',
        explanation: 'A Content Delivery Network (CDN) distributes service spatially relative to end users to provide high availability and performance.',
        points: 10,
      },
    ],
  }
];

const attempts: Attempt[] = [
  {
    id: '1',
    quizId: 1,
    studentId: '1',
    score: 80,
    date: 'April 1, 2025',
    duration: 15,
    feedback: 'Good work! You demonstrated a solid understanding of JavaScript concepts.',
    answers: [
      {
        questionId: '1',
        selectedAnswerId: '1b',
        isCorrect: true,
        feedback: 'Correct! Modern JavaScript uses let and const for variable declarations.'
      },
      {
        questionId: '2',
        selectedAnswerId: '2b',
        isCorrect: true,
        feedback: 'Correct! The async keyword is used to define functions that return Promises.'
      },
      {
        questionId: '3',
        selectedAnswerId: '3c',
        isCorrect: true,
        feedback: 'Correct! Closures allow functions to access variables from their outer scope.'
      },
    ],
  },
  {
    id: '2',
    quizId: 2,
    studentId: '1',
    score: 66,
    date: 'April 2, 2025',
    duration: 20,
    feedback: 'You have a good understanding of React but need to work on some concepts.',
    answers: [
      {
        questionId: '4',
        selectedAnswerId: '4b',
        isCorrect: false,
        feedback: 'Incorrect. Class is not a JavaScript data type.'
      },
      {
        questionId: '5',
        selectedAnswerId: '5b',
        isCorrect: true,
        feedback: 'Correct! The strict equality operator checks both value and type.'
      },
      {
        questionId: '6',
        selectedAnswerId: '6c',
        isCorrect: true,
        feedback: 'Correct! This is the proper way to define a functional component in React.'
      },
    ],
  },
];



export const getStudents = (): Promise<Student[]> => {
  return Promise.resolve(students);
};

export const getStudentById = (id: string): Promise<Student | undefined> => {
  return Promise.resolve(students.find(student => student.id === id));
};

export const getTeachers = (): Promise<Teacher[]> => {
  return Promise.resolve(teachers);
};

export const getTeacherById = (id: string): Promise<Teacher | undefined> => {
  return Promise.resolve(teachers.find(teacher => teacher.id === id));
};

export const getQuizzes = (): Promise<Quiz[]> => {
  return Promise.resolve(quizzes);
};

export const getQuizById = (id: string | number): Promise<Quiz | undefined> => {
  return Promise.resolve(quizzes.find(quiz => quiz.id.toString() === id.toString()));
};

export const getQuizzesByTeacherId = (teacherId: string): Promise<Quiz[]> => {
  return Promise.resolve(quizzes.filter(quiz => quiz.teacherId === teacherId));
};

export const getAttempts = (): Promise<Attempt[]> => {
  return Promise.resolve(attempts);
};

export const getAttemptsByStudentId = (studentId: string): Promise<Attempt[]> => {
  return Promise.resolve(attempts.filter(attempt => attempt.studentId === studentId));
};

export const getAttemptById = (id: string): Promise<Attempt | undefined> => {
  return Promise.resolve(attempts.find(attempt => attempt.id === id));
};

export const getAttemptsByQuizId = (quizId: string | number): Promise<Attempt[]> => {
  return Promise.resolve(attempts.filter(attempt => attempt.quizId.toString() === quizId.toString()));
};

export const saveQuiz = (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
  const newQuiz = {
    ...quiz,
    id: (quizzes.length + 1).toString(),
  };
  quizzes.push(newQuiz);
  return Promise.resolve(newQuiz);
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
      if (!window.mockQuizzes) {
        window.mockQuizzes = [];
      }
      window.mockQuizzes.push(newQuiz);
      console.log('Stored new quiz in window.mockQuizzes:', newQuiz);
    }
    
    console.log('Created new quiz:', newQuiz);
    return newQuiz;
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw error;
  }
};

export const saveAttempt = (attempt: Omit<Attempt, 'id'>): Promise<Attempt> => {
  const newAttempt = {
    ...attempt,
    id: (attempts.length + 1).toString(),
  };
  attempts.push(newAttempt);
  return Promise.resolve(newAttempt);
};

export const submitQuizAttempt = (attemptData: {
  studentId: string;
  quizId: string | number;
  score: number;
  answers: Answer[];
}): Promise<Attempt> => {
  const newAttempt: Omit<Attempt, 'id'> = {
    ...attemptData,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    duration: Math.floor(Math.random() * 30) + 10, 
  };
  
  return saveAttempt(newAttempt);
};


export type { QuizQuestion, Quiz, Answer, Attempt };
