
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not found" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { questionText, studentAnswer, correctAnswer, isCorrect, includeConceptExplanation } = await req.json();
    
    
    let prompt = `
You are an expert educational AI assistant providing feedback on student quiz answers.
Please analyze the student's response carefully and provide constructive, encouraging feedback:

Question: ${questionText}
Student's Answer: ${studentAnswer}
`;

    if (correctAnswer) {
      prompt += `Correct Answer: ${correctAnswer}\n`;
    }
    
    if (isCorrect !== undefined) {
      prompt += `The answer is ${isCorrect ? 'correct' : 'incorrect'}.\n`;
      
      if (isCorrect) {
        prompt += `
Since the answer is correct, provide:
1. A brief confirmation of correctness
2. A thorough explanation of the concept being tested, making sure to cover:
   - The core definition of the concept
   - How it works in practical terms
   - Common use cases or applications
   - At least one simple example
3. Possibly one related concept that builds on this knowledge
4. Keep your tone encouraging and positive
5. Keep your response between 150-200 words
`;
      } else {
        prompt += `
Since the answer is incorrect, provide:
1. A gentle acknowledgment that the answer needs improvement
2. A thorough explanation of the correct concept, including:
   - A clear definition of the concept
   - How it works in practice
   - Why it's important in programming
   - A simple code example if relevant
3. Common misconceptions about this concept
4. Practical tips on how to remember and apply this concept better
5. Keep your tone supportive and encouraging, not discouraging
6. Keep your response between 200-250 words
`;
      }
    } else {
      
      prompt += `
For this open-ended answer, provide:
1. Specific comments on the strengths of the student's answer
2. A detailed explanation of the concept being tested, including:
   - Core definition and principles
   - Practical applications
   - At least one example
3. Areas where the answer could be improved or elaborated
4. Suggestions for deepening understanding of this topic
5. Keep your tone supportive and encouraging
6. Keep your response between 175-225 words
`;
    }
    
    console.log("Sending prompt to Gemini API:", prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();
    
    console.log("Gemini API response for question feedback:", JSON.stringify(data));
    
    
    let feedbackText = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      feedbackText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    } else {
      throw new Error("Unexpected API response format");
    }

    return new Response(
      JSON.stringify({ feedback: feedbackText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in question feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
