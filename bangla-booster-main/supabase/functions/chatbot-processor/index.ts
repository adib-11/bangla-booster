import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  ownerId: string;
  senderId: string;
  messageText: string;
  pageAccessToken: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  owner_id: string;
}

interface Profile {
  subdomain: string;
  business_name: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ownerId, senderId, messageText, pageAccessToken }: RequestBody = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get owner's profile for subdomain
    const { data: profile } = await supabase
      .from("profiles")
      .select("subdomain, business_name")
      .eq("id", ownerId)
      .single();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Get all products for this owner
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", ownerId);

    if (!products || products.length === 0) {
      await sendTextMessage(
        senderId,
        pageAccessToken,
        "Hello! We don't have any products listed at the moment. Please check back later!"
      );
      return new Response(JSON.stringify({ status: "no_products" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Gemini to understand the query
    const { data: geminiData, error: geminiError } = await supabase.functions.invoke(
      "gemini-analyzer",
      {
        body: {
          messageText,
          products,
        },
      }
    );

    if (geminiError) {
      console.error("Gemini error:", geminiError);
      await sendTextMessage(
        senderId,
        pageAccessToken,
        "Sorry, I'm having trouble understanding your request. Could you please rephrase?"
      );
      return new Response(JSON.stringify({ error: "gemini_error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { intent, productMatch, searchTerm } = geminiData;

    // Handle different intents
    if (intent === "direct_question" && productMatch) {
      // Show full product showcase
      await sendProductShowcase(
        senderId,
        pageAccessToken,
        productMatch as Product,
        profile.subdomain
      );
    } else if (intent === "purchase_intent") {
      // Redirect to website
      await sendPurchaseResponse(senderId, pageAccessToken, profile);
    } else if (intent === "ambiguous_query") {
      // Search by product type
      await sendSearchResponse(
        senderId,
        pageAccessToken,
        searchTerm || messageText,
        profile
      );
    } else {
      // Default response
      await sendTextMessage(
        senderId,
        pageAccessToken,
        `Hi! I'm the ${profile.business_name} chatbot. Ask me about our products or say "show me products" to browse!`
      );
    }

    return new Response(JSON.stringify({ status: "processed", intent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Processor error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Send text message via Messenger API
async function sendTextMessage(
  recipientId: string,
  pageAccessToken: string,
  text: string
) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  return response.json();
}

// Send product showcase with image and buttons
async function sendProductShowcase(
  recipientId: string,
  pageAccessToken: string,
  product: Product,
  subdomain: string
) {
  const productUrl = `https://${subdomain}.ourplatform.com/product/${product.id}`;
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;

  // First, send the product image and details
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: product.title,
                subtitle: `Price: ৳${product.price.toLocaleString()}`,
                image_url: product.image_url,
                buttons: [
                  {
                    type: "web_url",
                    url: productUrl,
                    title: "View Product",
                  },
                  {
                    type: "web_url",
                    url: `https://${subdomain}.ourplatform.com`,
                    title: "Visit Store",
                  },
                ],
              },
            ],
          },
        },
      },
    }),
  });
}

// Send purchase intent response
async function sendPurchaseResponse(
  recipientId: string,
  pageAccessToken: string,
  profile: Profile
) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;
  const websiteUrl = `https://${profile.subdomain}.ourplatform.com`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `Great! To complete your purchase, please visit our website:`,
            buttons: [
              {
                type: "web_url",
                url: websiteUrl,
                title: "Visit Website",
              },
            ],
          },
        },
      },
    }),
  });

  // Follow up with text
  await sendTextMessage(
    recipientId,
    pageAccessToken,
    "You can browse all products and contact us directly through the website. Thank you!"
  );
}

// Send search response for ambiguous queries
async function sendSearchResponse(
  recipientId: string,
  pageAccessToken: string,
  searchTerm: string,
  profile: Profile
) {
  const websiteUrl = `https://${profile.subdomain}.ourplatform.com`;

  await sendTextMessage(
    recipientId,
    pageAccessToken,
    `I found your query about "${searchTerm}". Please visit our website to search and browse all available products:`
  );

  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `Visit ${profile.business_name}`,
            buttons: [
              {
                type: "web_url",
                url: websiteUrl,
                title: "Browse Products",
              },
            ],
          },
        },
      },
    }),
  });
}
