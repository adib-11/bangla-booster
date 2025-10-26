import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ShoppingBag, Sparkles, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Professional Website",
    description: "Beautiful product showcase website that works on all devices. No coding required.",
  },
  {
    icon: ShoppingBag,
    title: "Product Management",
    description: "Easily add, edit, and organize your products with images, descriptions, and pricing.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Design",
    description: "Modern, professional design that makes your products look amazing and builds customer trust.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track visitor activity, popular products, and customer engagement in real-time.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get your website live in minutes. No technical skills required - just add your products and go.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is safe with enterprise-grade security and reliable hosting infrastructure.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional tools designed for Bangladesh businesses to succeed online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
