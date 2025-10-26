import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Check, AlertCircle, Loader2, ExternalLink, Sparkles, Send } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  business_name: string;
  subdomain: string;
}

interface MessengerConnection {
  id: string;
  page_id: string;
  page_name: string;
  connected_at: string;
  is_active: boolean;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connection, setConnection] = useState<MessengerConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testResults, setTestResults] = useState<Array<{ query: string; response: string }>>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get("connected");
    const pageName = urlParams.get("page");
    const error = urlParams.get("error");
    
    if (connected === "true" && pageName) {
      toast({
        title: "Connected successfully!",
        description: `Your Facebook Page "${decodeURIComponent(pageName)}" is now connected.`,
      });
      // Clean URL
      window.history.replaceState({}, document.title, "/chatbot");
      // Refresh connection status
      setTimeout(checkAuth, 1000);
    } else if (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Facebook. Please try again.",
        variant: "destructive",
      });
      // Clean URL
      window.history.replaceState({}, document.title, "/chatbot");
    }
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("business_name, subdomain")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileData) {
        navigate("/setup");
        return;
      }

      setProfile(profileData);

      // Fetch messenger connection status
      const { data: connectionData } = await supabase
        .from("messenger_connections")
        .select("*")
        .eq("owner_id", user.id)
        .eq("is_active", true)
        .maybeSingle();
      
      setConnection(connectionData);

    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleConnectMessenger = async () => {
    setIsConnecting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to connect to Messenger.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      // Get Facebook App ID from environment or use a placeholder
      const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "YOUR_FB_APP_ID";
      
      // Supabase function URL for OAuth callback
      const REDIRECT_URI = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/facebook-oauth-callback`;
      
      // Required permissions for Messenger integration
      const permissions = "pages_show_list,pages_messaging,pages_manage_metadata";
      
      // Build Facebook OAuth URL with state parameter (userId for callback)
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${user.id}&scope=${permissions}&response_type=code`;
      
      // Redirect to Facebook OAuth
      window.location.href = authUrl;
      
    } catch (error) {
      console.error("Error connecting to Messenger:", error);
      toast({
        title: "Connection failed",
        description: "There was an error connecting to Facebook Messenger. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;
    
    try {
      const { error } = await supabase
        .from("messenger_connections")
        .update({ is_active: false })
        .eq("id", connection.id);
        
      if (error) throw error;
      
      toast({
        title: "Disconnected",
        description: "Your Facebook Page has been disconnected from the chatbot.",
      });
      setConnection(null);
      checkAuth();
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast({
        title: "Disconnect failed",
        description: "There was an error disconnecting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim()) return;
    
    setIsTesting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get products for testing
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("owner_id", user.id);

      if (!products || products.length === 0) {
        setTestResults(prev => [...prev, {
          query: testMessage,
          response: "⚠️ No products found. Please add products first to test the chatbot."
        }]);
        setTestMessage("");
        setIsTesting(false);
        return;
      }

      // Call the Gemini analyzer
      const { data: analysis, error: analysisError } = await supabase.functions.invoke(
        "gemini-analyzer",
        {
          body: {
            messageText: testMessage,
            products: products,
          },
        }
      );

      if (analysisError) {
        throw analysisError;
      }

      // Generate response based on intent
      let response = "";
      if (analysis.intent === "direct_question" && analysis.productMatch) {
        const product = analysis.productMatch;
        response = `✅ Direct Question Detected\n\n📦 ${product.title}\n💰 Price: ৳${product.price.toLocaleString()}\n🔗 Would show product image and link to website`;
      } else if (analysis.intent === "purchase_intent") {
        response = `✅ Purchase Intent Detected\n\n🛒 Would redirect customer to website for ordering`;
      } else if (analysis.intent === "ambiguous_query") {
        response = `✅ Ambiguous Query Detected\n\n🔍 Search term: "${analysis.searchTerm}"\n🔗 Would provide search link to website`;
      } else {
        response = `✅ Greeting Detected\n\n👋 Would send welcome message with product information`;
      }

      response += `\n\nConfidence: ${(analysis.confidence * 100).toFixed(0)}%`;

      setTestResults(prev => [...prev, {
        query: testMessage,
        response: response
      }]);
      setTestMessage("");
      
    } catch (error) {
      console.error("Test error:", error);
      setTestResults(prev => [...prev, {
        query: testMessage,
        response: "❌ Error processing test message. Please check the console."
      }]);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        businessName={profile?.business_name || ""}
        onSignOut={handleSignOut}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-primary">AI Chatbot</h1>
          </div>
          <p className="text-muted-foreground">
            Connect your Facebook Messenger to provide 24/7 intelligent customer support powered by AI.
          </p>
        </div>

        {/* Connection Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Facebook Messenger Integration
                  {connection && (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {connection 
                    ? `Connected to ${connection.page_name}` 
                    : "Connect your Facebook Page to activate the AI chatbot"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {connection ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">
                        Chatbot is Active
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your AI chatbot is now responding to customer messages on Facebook Messenger.
                        Connected since {new Date(connection.connected_at).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Facebook
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Connected</AlertTitle>
                  <AlertDescription>
                    Connect your Facebook Page in just one click to start using the AI chatbot.
                  </AlertDescription>
                </Alert>

                <Button 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
                  onClick={handleConnectMessenger}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Connect to Messenger
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Intelligent Responses</CardTitle>
              </div>
              <CardDescription>
                Powered by Google Gemini 2.5 Flash, the chatbot understands customer queries and provides accurate product information.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">24/7 Availability</CardTitle>
              </div>
              <CardDescription>
                Never miss a customer inquiry. The chatbot responds instantly, any time of day or night.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Product Showcase</CardTitle>
              </div>
              <CardDescription>
                Automatically shows product images, prices, and links when customers ask about specific items.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Website Integration</CardTitle>
              </div>
              <CardDescription>
                Seamlessly directs customers to your website for purchases, without handling transactions in chat.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How the AI Chatbot Works</CardTitle>
            <CardDescription>
              Your intelligent assistant handles customer queries in three ways
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Direct Product Questions</h3>
                <p className="text-sm text-muted-foreground">
                  When customers ask "What's the price of Casual T-Shirt?", the bot shows the full product details with image and website link.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Purchase Intent</h3>
                <p className="text-sm text-muted-foreground">
                  When customers say "I want to buy this", the bot guides them to your website to complete their order.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ambiguous Queries</h3>
                <p className="text-sm text-muted-foreground">
                  For questions like "Do you have red shirts?", the bot searches by product type and provides helpful search links to your website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Interface */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Test Your Chatbot
            </CardTitle>
            <CardDescription>
              Try different queries to see how the AI will respond to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="test" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="test">Send Test Message</TabsTrigger>
                <TabsTrigger value="results">Test Results ({testResults.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="test" className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Try queries like: "What's the price of [product name]?", "I want to buy this", "Do you have shirts?"
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a test message..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleTestMessage()}
                      disabled={isTesting}
                    />
                    <Button 
                      onClick={handleTestMessage}
                      disabled={isTesting || !testMessage.trim()}
                    >
                      {isTesting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Quick Tests:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTestMessage("Hello")}
                    >
                      Greeting
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const input = prompt("Enter product name to test:");
                        if (input) setTestMessage(`What's the price of ${input}?`);
                      }}
                    >
                      Direct Question
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTestMessage("I want to buy this")}
                    >
                      Purchase Intent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTestMessage("Do you have shirts?")}
                    >
                      Ambiguous Query
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                {testResults.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No test results yet. Send a test message to see how the chatbot responds.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Customer Query:</p>
                          <p className="font-medium">{result.query}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bot Response:</p>
                          <p className="text-sm whitespace-pre-line">{result.response}</p>
                        </div>
                      </div>
                    )).reverse()}
                  </div>
                )}
                {testResults.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTestResults([])}
                    className="w-full"
                  >
                    Clear Results
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
