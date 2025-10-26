import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
}

interface RequestBody {
  messageText: string;
  products: Product[];
}

interface GeminiResponse {
  intent: "direct_question" | "purchase_intent" | "ambiguous_query" | "greeting";
  productMatch?: Product;
  searchTerm?: string;
  confidence: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messageText, products }: RequestBody = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not set");
      // Fallback to basic keyword matching
      return new Response(
        JSON.stringify(await fallbackAnalysis(messageText, products)),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare product list for Gemini
    const productList = products.map((p, idx) => 
      `${idx + 1}. ${p.title} - ৳${p.price}`
    ).join("\n");

    const prompt = `You are a customer service AI for an e-commerce business. Analyze the customer's message and determine their intent.

Available products:
${productList}

Customer message: "${messageText}"

Determine the intent and respond in JSON format:
{
  "intent": "direct_question" | "purchase_intent" | "ambiguous_query" | "greeting",
  "productMatch": <product number if direct question about a specific product, null otherwise>,
  "searchTerm": <extracted product type/category for ambiguous queries>,
  "confidence": <0-1 confidence score>
}

Intent definitions:
- "direct_question": Customer asks about a specific product by name (e.g., "What's the price of Casual T-Shirt?")
- "purchase_intent": Customer wants to buy something (e.g., "I want to buy this", "How can I order?")
- "ambiguous_query": Customer asks about product types/categories without specifying exact product (e.g., "Do you have red shirts?")
- "greeting": General greeting or inquiry (e.g., "Hi", "Hello", "What do you sell?")

Respond only with valid JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 256,
          }
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return new Response(
        JSON.stringify(await fallbackAnalysis(messageText, products)),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response (Gemini might wrap it in markdown)
    const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON in Gemini response:", geminiText);
      return new Response(
        JSON.stringify(await fallbackAnalysis(messageText, products)),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // If direct question with product match, get the actual product
    if (analysis.intent === "direct_question" && analysis.productMatch) {
      const productIndex = parseInt(analysis.productMatch) - 1;
      if (productIndex >= 0 && productIndex < products.length) {
        analysis.productMatch = products[productIndex];
      } else {
        analysis.productMatch = null;
        analysis.intent = "ambiguous_query";
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini analyzer error:", error);
    
    // Fallback to basic analysis
    const { messageText, products } = await req.json() as RequestBody;
    return new Response(
      JSON.stringify(await fallbackAnalysis(messageText, products)),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Fallback analysis using keyword matching
async function fallbackAnalysis(
  messageText: string,
  products: Product[]
): Promise<GeminiResponse> {
  const lowerMessage = messageText.toLowerCase();

  // Check for purchase intent keywords
  const purchaseKeywords = ["buy", "purchase", "order", "want to buy", "how to order", "কিনতে", "অর্ডার"];
  if (purchaseKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      intent: "purchase_intent",
      confidence: 0.8,
    };
  }

  // Check for greeting
  const greetingKeywords = ["hi", "hello", "hey", "হাই", "হ্যালো"];
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      intent: "greeting",
      confidence: 0.9,
    };
  }

  // Try to match exact product name
  for (const product of products) {
    const productTitle = product.title.toLowerCase();
    if (lowerMessage.includes(productTitle)) {
      return {
        intent: "direct_question",
        productMatch: product,
        confidence: 0.85,
      };
    }
  }

  // Extract potential search term (simple noun extraction)
  const words = messageText.split(/\s+/);
  const searchTerm = words.find(word => word.length > 3) || messageText;

  return {
    intent: "ambiguous_query",
    searchTerm,
    confidence: 0.6,
  };
}
