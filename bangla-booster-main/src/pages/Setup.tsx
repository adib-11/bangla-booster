import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { Loader2 } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if profile already exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setIsCheckingProfile(false);
    }
  };

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    setSubdomain(generateSubdomain(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      // Check if subdomain is available
      const { data: existing } = await supabase
        .from("profiles")
        .select("subdomain")
        .eq("subdomain", subdomain)
        .maybeSingle();

      if (existing) {
        throw new Error("This subdomain is already taken. Please choose a different business name.");
      }

      // Create profile
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          business_name: businessName,
          subdomain: subdomain,
        });

      if (error) throw error;

      toast({
        title: "Business created!",
        description: `Your website is ready at ${subdomain}.ourplatform.com`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-primary mt-6 mb-2">
            Set Up Your Business
          </h1>
          <p className="text-muted-foreground">
            Choose your business name and get your unique subdomain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              This will be used to create your public website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  type="text"
                  placeholder="e.g., Adib's Kicks"
                  value={businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This is how your business will appear to customers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Your Subdomain</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    required
                    pattern="[a-z0-9-]+"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    .ourplatform.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your website URL. Only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading || !businessName || !subdomain}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create My Business"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
