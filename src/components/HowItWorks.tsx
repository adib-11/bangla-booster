import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Package, MessageSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and connect your Facebook business page.",
  },
  {
    icon: Package,
    step: "02",
    title: "Add Your Products",
    description: "Upload product photos, descriptions, and prices. Our AI learns everything.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Connect Messenger",
    description: "Link your Facebook Messenger and WhatsApp with one click.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Go Live",
    description: "Your website and AI chatbot are ready to serve customers 24/7.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple setup process that gets your business online fast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="border-border bg-card shadow-sm relative overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">
                    {step.step}
                  </div>
                  
                  <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
