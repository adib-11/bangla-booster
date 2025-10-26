import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "৳999",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: [
      "Professional website",
      "Up to 50 products",
      "Basic analytics",
      "Mobile responsive design",
      "Email support",
      "Secure hosting",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "৳1,999",
    period: "/month",
    description: "Best for growing businesses",
    features: [
      "Everything in Starter",
      "Unlimited products",
      "Advanced analytics",
      "Custom domain",
      "Priority support",
      "Remove ShopBot branding",
      "SEO optimization",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large businesses with custom needs",
    features: [
      "Everything in Professional",
      "Multiple websites",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "White-label solution",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade anytime. All plans include 14-day free trial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`border-border shadow-sm relative ${
                plan.highlighted 
                  ? 'border-accent shadow-xl scale-105' 
                  : 'hover:shadow-md'
              } transition-all duration-200`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-sm font-medium px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full h-11 font-medium ${
                    plan.highlighted 
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All prices in Bangladesh Taka (BDT) • Cancel anytime • No hidden fees
        </p>
      </div>
    </section>
  );
};
