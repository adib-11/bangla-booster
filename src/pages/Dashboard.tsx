import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, ExternalLink, Loader2 } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { AddProductDialog } from "@/components/AddProductDialog";
import { ProductList } from "@/components/ProductList";

interface Profile {
  business_name: string;
  subdomain: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuth();
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

      // Get product count
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id);

      setProductCount(count || 0);
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

  const handleProductAdded = () => {
    setShowAddProduct(false);
    setRefreshTrigger(prev => prev + 1);
    checkAuth(); // Refresh stats
    toast({
      title: "Product added!",
      description: "Your product is now live on your website.",
    });
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-3xl font-bold">{productCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Package className="w-3 h-3 mr-1" />
                Products listed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Your Website</CardDescription>
              <CardTitle className="text-lg font-semibold truncate">
                {profile?.subdomain}.ourplatform.com
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => window.open(`/${profile?.subdomain}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Visit Site
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <ProductList key={refreshTrigger} />

        {/* Add Product Dialog */}
        <AddProductDialog 
          open={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          onProductAdded={handleProductAdded}
        />
      </div>
    </div>
  );
}
