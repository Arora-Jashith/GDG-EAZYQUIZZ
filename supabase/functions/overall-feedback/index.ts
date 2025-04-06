
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    const { score, totalQuestions, correctCount, quizTitle, answersSummary } = await req.json();
    
    // Create a prompt for the Gemini model
    const prompt = `
You are an AI educational assistant providing overall feedback on a quiz performance.

Quiz: "${quizTitle}"
Score: ${score}% (${correctCount} out of ${totalQuestions} questions correct)
Details: ${answersSummary || "No detailed answer information provided."}

Please provide:
1. A personalized assessment of the performance (3-4 sentences)
2. Highlight areas of strength based on the score and details
3. Suggest areas for improvement
4. Include specific, actionable advice for future learning
5. Be encouraging, positive, and constructive in your feedback
6. Keep your response under 200 words
`;

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
          maxOutputTokens: 600,
        }
      }),
    });

    const data = await response.json();
    
    console.log("Gemini API response for overall feedback:", JSON.stringify(data));
    
    // Extract the text from the response
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
    console.error("Error in overall feedback function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
