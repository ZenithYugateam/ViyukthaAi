import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TALENT_POOL_STORAGE_KEY = "talentPoolOptIn";

export const TalentPoolCard = () => {
  const [isOptedIn, setIsOptedIn] = useState(() => {
    const saved = localStorage.getItem(TALENT_POOL_STORAGE_KEY);
    return saved === "true";
  });

  const handleToggle = (checked: boolean) => {
    setIsOptedIn(checked);
    localStorage.setItem(TALENT_POOL_STORAGE_KEY, checked.toString());
    
    if (checked) {
      toast.success("You've joined the Talent Pool! Your profile will be visible to companies.", {
        description: "Companies can now discover and contact you directly.",
      });
    } else {
      toast.info("You've left the Talent Pool. Your profile is no longer visible to companies.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Talent Pool</CardTitle>
                {isOptedIn && (
                  <Badge variant="default" className="bg-primary">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <CardDescription>
                Join our talent pool to get discovered by top companies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="talent-pool-toggle" className="text-sm font-medium cursor-pointer">
                  Enable Talent Pool Visibility
                </Label>
              </div>
              <Switch
                id="talent-pool-toggle"
                checked={isOptedIn}
                onCheckedChange={handleToggle}
              />
            </div>
            
            {isOptedIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 border-t"
              >
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Benefits:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Your profile appears in company Quick Hire searches</li>
                      <li>Companies can contact you directly</li>
                      <li>Better visibility and job opportunities</li>
                      <li>Priority consideration for matching roles</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {!isOptedIn && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-3">
                When enabled, your profile will be automatically listed in company Quick Hire searches based on your skills and experience.
              </p>
              <Button
                onClick={() => handleToggle(true)}
                className="w-full gradient-primary text-white"
                size="sm"
              >
                Join Talent Pool
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

