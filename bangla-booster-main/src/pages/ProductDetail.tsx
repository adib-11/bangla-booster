import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
}

interface Profile {
  business_name: string;
  subdomain: string;
}

export default function ProductDetail() {
  const { subdomain, productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProduct();
  }, [subdomain, productId]);

  const loadProduct = async () => {
    try {
      // Get profile by subdomain
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("business_name, subdomain, id")
        .eq("subdomain", subdomain)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error("Profile not found");
        return;
      }

      setProfile(profileData);

      // Get product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, title, price, image_url")
        .eq("id", productId)
        .eq("owner_id", profileData.id)
        .maybeSingle();

      if (productError || !productData) {
        console.error("Product not found");
        return;
      }

      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!profile || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          {subdomain && (
            <Link to={`/${subdomain}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/${subdomain}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {profile.business_name}
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <Card className="overflow-hidden">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </Card>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              {product.title}
            </h1>

            <div className="text-3xl font-bold text-accent mb-8">
              ৳{product.price.toFixed(2)}
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-2">
                      Interested in this product?
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Message us on Facebook or contact us directly to place your order.
                      We're here to answer all your questions!
                    </p>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-primary mb-3">
                  About {profile.business_name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  We're a trusted business providing quality products to our customers.
                  Feel free to reach out with any questions!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
