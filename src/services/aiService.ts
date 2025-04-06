
export const getAILearningInsights = async (userId: string) => {
  try {
    
    console.log("Generating learning insights for user:", userId);
    
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      strengths: [
        "JavaScript Basics",
        "HTML Structure",
        "CSS Layouts"
      ],
      areasToImprove: [
        "React Hooks",
        "State Management",
        "API Integration"
      ],
      recommendations: [
        "Practice more with React Hooks by building small components",
        "Try building a project with Redux to understand state management better",
        "Review API documentation and integration patterns with RESTful services"
      ]
    };
  } catch (error) {
    console.error("Error generating AI learning insights:", error);
    return {
      strengths: [],
      areasToImprove: [],
      recommendations: []
    };
  }
};


export const generateQuestionFeedback = async (feedbackParams: { 
  questionText: string; 
  studentAnswer: string; 
  correctAnswer?: string; 
  isCorrect?: boolean;
}) => {
  try {
    console.log("Generating AI feedback for answer:", feedbackParams);
    
    
    const response = await fetch('/functions/v1/question-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...feedbackParams,
        includeConceptExplanation: true
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error from feedback service: ${response.status}`);
    }
    
    const data = await response.json();
    
    
    if (data && data.feedback) {
      return data.feedback;
    }
    
    
    if (feedbackParams.isCorrect) {
      return "Great job! Your answer is correct. " + 
        "This demonstrates your understanding of the concept. " + 
        "Let me explain further: " + getConceptExplanation(feedbackParams.questionText) + 
        "Keep up the good work and continue building on this knowledge.";
    } else if (feedbackParams.correctAnswer) {
      return `Your answer needs improvement. The correct answer is: ${feedbackParams.correctAnswer}. ` +
        "Here's a detailed explanation of this concept: " + getConceptExplanation(feedbackParams.questionText) + 
        "Take some time to review this concept. " +
        "Remember, mistakes are opportunities for learning and growth.";
    } else {
      
      return "Thank you for your response. Your answer shows effort, but let me provide a more detailed explanation of this concept: " + 
        getConceptExplanation(feedbackParams.questionText) + 
        "Consider reviewing the material and practicing with additional examples.";
    }
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    
   
    if (feedbackParams.isCorrect) {
      return "Excellent! Your answer is correct. " + getConceptExplanation(feedbackParams.questionText);
    } else if (feedbackParams.correctAnswer) {
      return `This answer needs improvement. The correct answer is: ${feedbackParams.correctAnswer}. ` + 
        getConceptExplanation(feedbackParams.questionText);
    } else {
      return "Thanks for your response. " + getConceptExplanation(feedbackParams.questionText);
    }
  }
};


function getConceptExplanation(questionText: string): string {
  
  const lowerCaseQuestion = questionText.toLowerCase();
  
  if (lowerCaseQuestion.includes("closure") && lowerCaseQuestion.includes("javascript")) {
    return "A closure in JavaScript is a function that has access to its own scope, the outer function's variables, and global variables, even after the outer function has finished executing. This is possible because functions in JavaScript form closures - they 'remember' the environment they were created in. Closures are useful for data encapsulation, creating private variables, and in callback functions. ";
  }
  
  if (lowerCaseQuestion.includes("react") && lowerCaseQuestion.includes("hook")) {
    return "React Hooks are functions that let you 'hook into' React state and lifecycle features from function components. Hooks like useState, useEffect, useContext, etc., allow you to use state and other React features without writing a class component. They help organize logic in components better and enable reuse of stateful logic between components. ";
  }
  
  
  return "This concept is fundamental in programming. Understanding it deeply will help you write more efficient and maintainable code. I recommend researching more examples and practicing implementation in small projects. ";
}
