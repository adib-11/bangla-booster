import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Contains userId

    if (!code || !state) {
      return new Response("Missing code or state parameter", { status: 400 });
    }

    const FB_APP_ID = Deno.env.get("FB_APP_ID");
    const FB_APP_SECRET = Deno.env.get("FB_APP_SECRET");
    const REDIRECT_URI = Deno.env.get("FB_REDIRECT_URI") || 
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/facebook-oauth-callback`;

    if (!FB_APP_ID || !FB_APP_SECRET) {
      console.error("Facebook app credentials not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Failed to get access token:", tokenData);
      return new Response("Failed to authenticate with Facebook", { status: 400 });
    }

    const userAccessToken = tokenData.access_token;

    // Get user's pages
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "no_pages",
          message: "No Facebook Pages found. Please create a Facebook Page first." 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use the first page (in production, you'd let user choose)
    const page = pagesData.data[0];
    const pageId = page.id;
    const pageName = page.name;
    const pageAccessToken = page.access_token;

    // Subscribe the page to webhook
    const subscribeUrl = `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${pageAccessToken}`;
    await fetch(subscribeUrl, { method: "POST" });

    // Store connection in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("messenger_connections")
      .upsert({
        owner_id: state, // userId from state parameter
        page_id: pageId,
        page_name: pageName,
        page_access_token: pageAccessToken,
        is_active: true,
      }, {
        onConflict: "page_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "database_error", message: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Redirect to success page
    const clientUrl = Deno.env.get("CLIENT_URL") || "http://localhost:5173";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${clientUrl}/chatbot?connected=true&page=${encodeURIComponent(pageName)}`,
      },
    });

  } catch (error) {
    console.error("OAuth callback error:", error);
    const clientUrl = Deno.env.get("CLIENT_URL") || "http://localhost:5173";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${clientUrl}/chatbot?error=auth_failed`,
      },
    });
  }
});
