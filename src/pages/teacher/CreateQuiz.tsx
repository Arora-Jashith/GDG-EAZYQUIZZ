import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X, Plus, AlignLeft, CheckSquare, List, ToggleLeft, Clock } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { createQuiz, Quiz, QuizQuestion } from '@/services/mockData';
import { toast } from 'sonner';
import { QuestionType } from '@/types/quiz';

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([{
    text: '',
    type: 'multiple-choice' as QuestionType,
    options: [{ id: '1', text: '' }, { id: '2', text: '' }]
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionTypeChange = (type: QuestionType, index: number) => {
    const updatedQuestions = [...questions];
    
    if (type === 'multiple-choice') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type,
        options: [{ id: '1', text: '' }, { id: '2', text: '' }],
        correctAnswer: undefined
      };
    } else if (type === 'true-false') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type,
        options: [{ id: '1', text: 'True' }, { id: '2', text: 'False' }],
        correctAnswer: undefined
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type,
        options: undefined,
        correctAnswer: type === 'essay' ? undefined : ''
      };
    }
    
    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (text: string, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], text };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (text: string, questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      const updatedOptions = [...question.options];
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], text };
      
      updatedQuestions[questionIndex] = { 
        ...question, 
        options: updatedOptions 
      };
      
      setQuestions(updatedQuestions);
    }
  };

  const handleCorrectAnswerChange = (optionId: string, questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = { 
      ...updatedQuestions[questionIndex], 
      correctAnswer: optionId 
    };
    setQuestions(updatedQuestions);
  };

  const handleShortAnswerChange = (text: string, questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = { 
      ...updatedQuestions[questionIndex], 
      correctAnswer: text 
    };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      const newOptionId = (question.options.length + 1).toString();
      updatedQuestions[questionIndex] = {
        ...question,
        options: [...question.options, { id: newOptionId, text: '' }]
      };
      
      setQuestions(updatedQuestions);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    if (question.options && question.options.length > 2) {
      const updatedOptions = question.options.filter((_, index) => index !== optionIndex);
      
      let correctAnswer = question.correctAnswer;
      if (question.correctAnswer === question.options[optionIndex].id) {
        correctAnswer = undefined;
      }
      
      updatedQuestions[questionIndex] = {
        ...question,
        options: updatedOptions,
        correctAnswer
      };
      
      setQuestions(updatedQuestions);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'multiple-choice' as QuestionType,
        options: [{ id: '1', text: '' }, { id: '2', text: '' }]
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'multiple-choice':
        return <CheckSquare className="h-4 w-4 mr-2" />;
      case 'essay':
        return <AlignLeft className="h-4 w-4 mr-2" />;
      case 'short-answer':
        return <List className="h-4 w-4 mr-2" />;
      case 'one-liner':
        return <AlignLeft className="h-4 w-4 mr-2" />;
      case 'true-false':
        return <ToggleLeft className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (timeLimit && (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0)) {
      toast.error('Please enter a valid time limit (positive number)');
      return;
    }
    
    const isValid = questions.every((q, index) => {
      if (!q.text?.trim()) {
        toast.error(`Please enter text for question ${index + 1}`);
        return false;
      }
      
      if ((q.type === 'multiple-choice' || q.type === 'true-false') && q.options) {
        if (!q.options?.every(o => o.text.trim())) {
          toast.error(`Please enter text for all options in question ${index + 1}`);
          return false;
        }
        
        if (!q.correctAnswer) {
          toast.error(`Please select a correct answer for question ${index + 1}`);
          return false;
        }
      }
      
      if ((q.type === 'short-answer' || q.type === 'one-liner') && !q.correctAnswer) {
        toast.error(`Please enter a correct answer for question ${index + 1}`);
        return false;
      }
      
      return true;
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating quiz with data:", {
        title,
        description,
        timeLimit,
        questions,
        userId: user?.id
      });
      
      const quizData: Omit<Quiz, 'id'> = {
        title,
        description,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
        createdBy: user?.id || 'unknown',
        teacherId: user?.id || 'unknown',
        topic: title,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        createdOn: new Date().toISOString(),
        hasAttempts: false,
        questions: questions.map((q, index) => ({
          id: `new-${index}`,
          quizId: 'temp',
          text: q.text || '',
          type: q.type as QuestionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: '',
          points: 10
        }))
      };
      
      const newQuiz = await createQuiz(quizData);
      console.log("Quiz created successfully:", newQuiz);
      
      toast.success('Quiz created successfully');
      
      setTimeout(() => {
        if (newQuiz && newQuiz.id) {
          navigate(`/teacher/track-quiz/${newQuiz.id}`);
        } else {
          console.error("No quiz ID returned after creation");
          navigate('/teacher/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const createSampleQuiz = () => {
    setTitle("Web Development & Programming Fundamentals");
    setDescription("A comprehensive quiz covering JavaScript, React, Data Structures, Algorithms and modern web development concepts");
    setTimeLimit("45");
    
    setQuestions([
      {
        text: "Which of the following is NOT a JavaScript data type?",
        type: "multiple-choice",
        options: [
          { id: "1", text: "Symbol" },
          { id: "2", text: "Character" },
          { id: "3", text: "Object" },
          { id: "4", text: "BigInt" }
        ],
        correctAnswer: "2"
      },
      {
        text: "What is the time complexity of searching for an element in a balanced binary search tree?",
        type: "multiple-choice",
        options: [
          { id: "1", text: "O(1)" },
          { id: "2", text: "O(log n)" },
          { id: "3", text: "O(n)" },
          { id: "4", text: "O(n log n)" }
        ],
        correctAnswer: "2"
      },
      {
        text: "In React, what hook would you use to perform side effects after render?",
        type: "multiple-choice",
        options: [
          { id: "1", text: "useEffect" },
          { id: "2", text: "useState" },
          { id: "3", text: "useContext" },
          { id: "4", text: "useReducer" }
        ],
        correctAnswer: "1"
      },
      {
        text: "JavaScript is a synchronous, blocking, single-threaded language.",
        type: "true-false",
        options: [
          { id: "1", text: "True" },
          { id: "2", text: "False" }
        ],
        correctAnswer: "2"
      },
      {
        text: "What is the output of: console.log(typeof [])?",
        type: "one-liner",
        correctAnswer: "object"
      },
      {
        text: "Explain the concept of closures in JavaScript and provide an example.",
        type: "essay"
      },
      {
        text: "What algorithm would be most efficient for finding the shortest path in a weighted graph?",
        type: "multiple-choice",
        options: [
          { id: "1", text: "Depth-First Search" },
          { id: "2", text: "Breadth-First Search" },
          { id: "3", text: "Dijkstra's Algorithm" },
          { id: "4", text: "Binary Search" }
        ],
        correctAnswer: "3"
      },
      {
        text: "What is the purpose of the 'key' prop in React lists?",
        type: "short-answer",
        correctAnswer: "Keys help React identify which items have changed, are added, or are removed. They give elements a stable identity across renders."
      },
      {
        text: "What does the CSS property 'position: absolute' do?",
        type: "short-answer",
        correctAnswer: "It positions an element relative to its nearest positioned ancestor (or the document body). The element is removed from the normal document flow."
      },
      {
        text: "In Big O notation, what is the time complexity of merging two sorted arrays of size n?",
        type: "one-liner",
        correctAnswer: "O(n)"
      }
    ]);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Quiz</h1>
        <Button 
          variant="outline" 
          onClick={createSampleQuiz}
          type="button"
        >
          Load Sample Quiz
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Quiz Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your quiz"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="timeLimit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Limit (minutes, Optional)
            </Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time limit in minutes"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty for no time limit
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                <Textarea
                  id={`question-${qIndex}`}
                  value={question.text}
                  onChange={(e) => handleQuestionTextChange(e.target.value, qIndex)}
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => handleQuestionTypeChange(value as QuestionType, qIndex)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">
                      <div className="flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Multiple Choice
                      </div>
                    </SelectItem>
                    <SelectItem value="true-false">
                      <div className="flex items-center">
                        <ToggleLeft className="h-4 w-4 mr-2" />
                        True/False
                      </div>
                    </SelectItem>
                    <SelectItem value="one-liner">
                      <div className="flex items-center">
                        <AlignLeft className="h-4 w-4 mr-2" />
                        One-liner Answer
                      </div>
                    </SelectItem>
                    <SelectItem value="short-answer">
                      <div className="flex items-center">
                        <List className="h-4 w-4 mr-2" />
                        Short Answer
                      </div>
                    </SelectItem>
                    <SelectItem value="essay">
                      <div className="flex items-center">
                        <AlignLeft className="h-4 w-4 mr-2" />
                        Essay/Open-ended
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(question.type === 'multiple-choice' || question.type === 'true-false') && question.options && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    {question.type === 'multiple-choice' && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addOption(qIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Option
                      </Button>
                    )}
                  </div>

                  <RadioGroup 
                    value={question.correctAnswer} 
                    onValueChange={(value) => handleCorrectAnswerChange(value, qIndex)}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option.id} id={`option-${qIndex}-${oIndex}`} />
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionChange(e.target.value, qIndex, oIndex)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1"
                          disabled={question.type === 'true-false'}
                        />
                        {question.type === 'multiple-choice' && question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-gray-500">Select the correct answer</p>
                </div>
              )}

              {(question.type === 'short-answer' || question.type === 'one-liner') && (
                <div className="space-y-2">
                  <Label htmlFor={`answer-${qIndex}`}>Correct Answer</Label>
                  <Input
                    id={`answer-${qIndex}`}
                    value={question.correctAnswer || ''}
                    onChange={(e) => handleShortAnswerChange(e.target.value, qIndex)}
                    placeholder="Enter the correct answer"
                  />
                  <p className="text-sm text-gray-500">
                    {question.type === 'one-liner' 
                      ? 'Enter a brief, one-line answer that will be used to evaluate responses' 
                      : 'Enter a model answer for reference and grading'}
                  </p>
                </div>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/teacher/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </MainLayout>
  );
};

export default CreateQuiz;
