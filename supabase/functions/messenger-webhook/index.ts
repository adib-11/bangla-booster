import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookEntry {
  id: string;
  time: number;
  messaging: MessagingEvent[];
}

interface MessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
  };
}

interface WebhookPayload {
  object: string;
  entry: WebhookEntry[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // GET request - Facebook webhook verification
    if (req.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      const VERIFY_TOKEN = Deno.env.get("FB_VERIFY_TOKEN") || "bangla_booster_verify_token_2025";

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully");
        return new Response(challenge, { 
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      } else {
        console.error("Webhook verification failed");
        return new Response("Forbidden", { status: 403 });
      }
    }

    // POST request - Handle incoming messages
    if (req.method === "POST") {
      const payload: WebhookPayload = await req.json();

      // Verify this is a page subscription
      if (payload.object !== "page") {
        return new Response("Not a page subscription", { status: 404 });
      }

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Process each entry
      for (const entry of payload.entry) {
        const pageId = entry.id;

        // Process each messaging event
        for (const event of entry.messaging) {
          // Skip if no message text
          if (!event.message?.text) {
            continue;
          }

          const senderId = event.sender.id;
          const messageText = event.message.text;

          console.log(`Received message from ${senderId}: ${messageText}`);

          // Get the owner and page info from messenger_connections
          const { data: connection, error: connError } = await supabase
            .from("messenger_connections")
            .select("owner_id, page_access_token, page_name")
            .eq("page_id", pageId)
            .eq("is_active", true)
            .single();

          if (connError || !connection) {
            console.error("Connection not found for page:", pageId);
            continue;
          }

          // Invoke the chatbot processor
          const { data: processorData, error: processorError } = await supabase.functions.invoke(
            "chatbot-processor",
            {
              body: {
                ownerId: connection.owner_id,
                senderId: senderId,
                messageText: messageText,
                pageAccessToken: connection.page_access_token,
              },
            }
          );

          if (processorError) {
            console.error("Error processing message:", processorError);
          } else {
            console.log("Message processed successfully:", processorData);
          }
        }
      }

      // Always return 200 to Facebook
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
