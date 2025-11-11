import React from "react";
import Sidebar from "@/components/company-dashboard/Sidebar";
import TopNav from "@/components/company-dashboard/TopNav";
import { PageTransition } from "@/components/company-dashboard/PageTransition";
import { TOKEN_PACKAGES, TOKEN_COSTS, tokenSystem, TokenTransaction } from "@/data/tokenSystem";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Coins,
  Check,
  TrendingUp,
  History,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const TokensPage: React.FC = () => {
  const [balance, setBalance] = React.useState(() => tokenSystem.getBalance());
  const [transactions, setTransactions] = React.useState<TokenTransaction[]>(() =>
    tokenSystem.getTransactions()
  );
  const [purchasing, setPurchasing] = React.useState(false);

  const refreshData = () => {
    setBalance(tokenSystem.getBalance());
    setTransactions(tokenSystem.getTransactions());
  };

  React.useEffect(() => {
    window.addEventListener("focus", refreshData);
    return () => window.removeEventListener("focus", refreshData);
  }, []);

  const handlePurchase = async (packageId: string) => {
    setPurchasing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const success = tokenSystem.purchaseTokens(packageId);
    
    if (success) {
      const pkg = TOKEN_PACKAGES.find((p) => p.id === packageId);
      toast.success(`Successfully purchased ${pkg?.name}! ${pkg?.tokens} tokens added to your account.`);
      refreshData();
    } else {
      toast.error("Purchase failed. Please try again.");
    }
    
    setPurchasing(false);
  };

  const usagePercentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Interview Tokens</h1>
              <p className="text-muted-foreground">
                Purchase tokens to conduct interviews. Each interview type costs different tokens.
              </p>
            </div>

            {/* Token Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Balance</span>
                      <Coins className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-4xl font-bold text-amber-600">{balance.current}</div>
                    <p className="text-xs text-muted-foreground mt-1">Available tokens</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Purchased</span>
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-4xl font-bold text-blue-600">{balance.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime tokens</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tokens Used</span>
                      <History className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-4xl font-bold text-purple-600">{balance.used}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {usagePercentage.toFixed(1)}% of total
                    </p>
                    <Progress value={usagePercentage} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Token Costs Reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Token Costs per Interview Type
                  </CardTitle>
                  <CardDescription>Different interview types require different token amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(TOKEN_COSTS).map(([type, cost]) => (
                      <div key={type} className="text-center p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold text-amber-600">{cost}</div>
                        <p className="text-sm font-medium mt-1">{type}</p>
                        <p className="text-xs text-muted-foreground">tokens</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Token Packages */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Purchase Token Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOKEN_PACKAGES.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className={`relative ${pkg.popular ? "border-2 border-primary shadow-lg" : ""}`}>
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-3 py-1">
                            <Crown className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{pkg.name}</span>
                          {pkg.id === "unlimited" && <Sparkles className="h-5 w-5 text-amber-500" />}
                        </CardTitle>
                        <div className="mt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">₹{pkg.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-lg font-bold">
                              <Coins className="h-4 w-4 mr-1" />
                              {pkg.tokens} tokens
                            </Badge>
                          </div>
                          {pkg.savings && (
                            <Badge variant="outline" className="mt-2 text-emerald-600 border-emerald-600">
                              {pkg.savings}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Separator />
                        <ul className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          variant={pkg.popular ? "default" : "outline"}
                          disabled={purchasing}
                          onClick={() => handlePurchase(pkg.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {purchasing ? "Processing..." : "Purchase Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>Recent token purchases and deductions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              txn.type === "purchase"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {txn.type === "purchase" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{txn.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(txn.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              txn.type === "purchase" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {txn.type === "purchase" ? "+" : ""}
                            {txn.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">Balance: {txn.balance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default TokensPage;
