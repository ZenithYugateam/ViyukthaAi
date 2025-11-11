export type TokenPackage = {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
  features: string[];
  savings?: string;
};

export type TokenTransaction = {
  id: string;
  type: "purchase" | "deduction";
  amount: number;
  description: string;
  timestamp: string;
  balance: number;
};

export type TokenBalance = {
  current: number;
  total: number;
  used: number;
};

// Token costs per interview type
export const TOKEN_COSTS = {
  AI: 10,
  Technical: 15,
  HR: 8,
  "Voice/Video": 20,
} as const;

// Token packages
export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    tokens: 100,
    price: 999,
    features: [
      "100 Interview Tokens",
      "10 AI Interviews",
      "6 Technical Interviews",
      "12 HR Interviews",
      "5 Voice/Video Interviews",
      "Valid for 3 months",
    ],
  },
  {
    id: "professional",
    name: "Professional Pack",
    tokens: 500,
    price: 4499,
    popular: true,
    savings: "Save ₹500",
    features: [
      "500 Interview Tokens",
      "50 AI Interviews",
      "33 Technical Interviews",
      "62 HR Interviews",
      "25 Voice/Video Interviews",
      "Valid for 6 months",
      "Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    tokens: 1500,
    price: 11999,
    savings: "Save ₹2000",
    features: [
      "1500 Interview Tokens",
      "150 AI Interviews",
      "100 Technical Interviews",
      "187 HR Interviews",
      "75 Voice/Video Interviews",
      "Valid for 12 months",
      "Priority Support",
      "Dedicated Account Manager",
      "Custom Integration",
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited Pack",
    tokens: 5000,
    price: 29999,
    savings: "Best Value",
    features: [
      "5000 Interview Tokens",
      "500 AI Interviews",
      "333 Technical Interviews",
      "625 HR Interviews",
      "250 Voice/Video Interviews",
      "Valid for 12 months",
      "24/7 Premium Support",
      "Dedicated Account Manager",
      "Custom Integration",
      "White Label Option",
      "API Access",
    ],
  },
];

const STORAGE_KEY = "companyDashboard.tokens.v1";
const TRANSACTIONS_KEY = "companyDashboard.tokenTransactions.v1";

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

const initialBalance: TokenBalance = {
  current: 50, // Free starter tokens
  total: 50,
  used: 0,
};

const initialTransactions: TokenTransaction[] = [
  {
    id: "TXN-001",
    type: "purchase",
    amount: 50,
    description: "Welcome bonus - Free starter tokens",
    timestamp: new Date().toISOString(),
    balance: 50,
  },
];

export const tokenSystem = {
  // Get current balance
  getBalance: (): TokenBalance => {
    return loadFromStorage(STORAGE_KEY, initialBalance);
  },

  // Get transaction history
  getTransactions: (): TokenTransaction[] => {
    return loadFromStorage(TRANSACTIONS_KEY, initialTransactions);
  },

  // Purchase tokens
  purchaseTokens: (packageId: string): boolean => {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return false;

    const balance = tokenSystem.getBalance();
    const transactions = tokenSystem.getTransactions();

    const newBalance: TokenBalance = {
      current: balance.current + pkg.tokens,
      total: balance.total + pkg.tokens,
      used: balance.used,
    };

    const transaction: TokenTransaction = {
      id: `TXN-${Date.now()}`,
      type: "purchase",
      amount: pkg.tokens,
      description: `Purchased ${pkg.name}`,
      timestamp: new Date().toISOString(),
      balance: newBalance.current,
    };

    saveToStorage(STORAGE_KEY, newBalance);
    saveToStorage(TRANSACTIONS_KEY, [transaction, ...transactions]);

    return true;
  },

  // Deduct tokens for interview
  deductTokens: (interviewTypes: string[]): { success: boolean; message: string } => {
    const balance = tokenSystem.getBalance();
    
    // Calculate total cost
    let totalCost = 0;
    interviewTypes.forEach((type) => {
      const cost = TOKEN_COSTS[type as keyof typeof TOKEN_COSTS] || 0;
      totalCost += cost;
    });

    // Check if enough tokens
    if (balance.current < totalCost) {
      return {
        success: false,
        message: `Insufficient tokens. Need ${totalCost} tokens, but only have ${balance.current}.`,
      };
    }

    // Deduct tokens
    const newBalance: TokenBalance = {
      current: balance.current - totalCost,
      total: balance.total,
      used: balance.used + totalCost,
    };

    const transactions = tokenSystem.getTransactions();
    const transaction: TokenTransaction = {
      id: `TXN-${Date.now()}`,
      type: "deduction",
      amount: -totalCost,
      description: `Interview created: ${interviewTypes.join(", ")} (${totalCost} tokens)`,
      timestamp: new Date().toISOString(),
      balance: newBalance.current,
    };

    saveToStorage(STORAGE_KEY, newBalance);
    saveToStorage(TRANSACTIONS_KEY, [transaction, ...transactions]);

    return {
      success: true,
      message: `${totalCost} tokens deducted. Remaining balance: ${newBalance.current}`,
    };
  },

  // Calculate cost for interview types
  calculateCost: (interviewTypes: string[]): number => {
    if (!interviewTypes || !Array.isArray(interviewTypes)) {
      return 0;
    }
    let total = 0;
    interviewTypes.forEach((type) => {
      const cost = TOKEN_COSTS[type as keyof typeof TOKEN_COSTS] || 0;
      total += cost;
    });
    return total;
  },

  // Reset tokens (for testing)
  resetTokens: (): void => {
    saveToStorage(STORAGE_KEY, initialBalance);
    saveToStorage(TRANSACTIONS_KEY, initialTransactions);
  },
};
