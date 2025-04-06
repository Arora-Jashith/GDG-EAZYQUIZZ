
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
    const { message, role } = await req.json();
    
    
    let systemPrompt = "You are a helpful, friendly AI assistant for educational purposes. Keep your responses conversational, brief and focused. DO NOT USE markdown formatting like asterisks for bold or italics in your responses.";
    
    if (role === "teacher") {
      systemPrompt = "You are a helpful, friendly AI assistant for teachers. Provide brief insights on education, teaching methods, quiz creation, and student assessment. Keep responses conversational and under 3-4 sentences per paragraph. DO NOT USE markdown formatting like asterisks for bold or italics in your responses.";
    } else if (role === "student") {
      systemPrompt = "You are a helpful, friendly AI assistant for students. Provide brief educational support, study tips, and help understand concepts without directly giving answers to homework. Keep responses conversational and under 3-4 sentences per paragraph. DO NOT USE markdown formatting like asterisks for bold or italics in your responses.";
    }

    // Using gemini-1.5-flash model
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
              { text: `${systemPrompt} Remember to keep responses conversational, brief (under 200 words), and focused on directly answering the question. Format your response in plain text without markdown symbols.` },
              { text: message }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300, 
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", JSON.stringify(errorData));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    console.log("Gemini API response:", JSON.stringify(data));
    
    
    let aiResponse = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      aiResponse = data.candidates[0].content.parts[0].text;
      
      
      aiResponse = aiResponse.replace(/\*\*/g, "").replace(/\*/g, "");
    } else if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    } else {
      throw new Error("Unexpected API response format");
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in AI chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
