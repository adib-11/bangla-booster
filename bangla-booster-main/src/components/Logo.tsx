import { Sparkles } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-lg">
        <Sparkles className="w-5 h-5 text-accent-foreground" />
      </div>
      <span className="text-xl font-bold text-primary">ShopBot</span>
    </div>
  );
};
