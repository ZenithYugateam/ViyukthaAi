// Razorpay Payment Integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Load Razorpay script dynamically
 */
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay script')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'razorpay-checkout-script';
    
    script.onload = () => {
      // Double check Razorpay is available
      if (window.Razorpay) {
        resolve();
      } else {
        reject(new Error('Razorpay SDK loaded but not available'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script. Please check your internet connection.'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Initialize Razorpay payment
 */
export async function initializeRazorpayPayment(
  options: Omit<RazorpayOptions, 'handler'>,
  onSuccess: (response: RazorpayResponse) => void,
  onError?: (error: any) => void
): Promise<void> {
  try {
    // Validate required options
    if (!options.key) {
      throw new Error('Razorpay Key ID is required');
    }
    if (!options.amount || options.amount <= 0) {
      throw new Error('Valid amount is required');
    }

    // Load Razorpay script if not already loaded
    await loadRazorpayScript();

    // Wait a bit for Razorpay to initialize
    let retries = 0;
    while (!window.Razorpay && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
    }

    const razorpayOptions: RazorpayOptions = {
      ...options,
      handler: (response: RazorpayResponse) => {
        // Validate response
        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
          console.error('Invalid payment response:', response);
          if (onError) {
            onError(new Error('Invalid payment response received'));
          }
          return;
        }
        // Verify payment signature (in production, verify on backend)
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          if (onError) {
            onError(new Error('Payment cancelled by user'));
          }
        },
      },
      // Add error handler
      notes: {
        source: 'Viyuktha AI Token Purchase',
      },
    };

    // Remove order_id if it's a mock/test order (for testing without backend)
    // In production, always use real order_id from backend
    // Razorpay order IDs follow pattern: order_<alphanumeric>
    // Mock orders from createRazorpayOrder() don't match this pattern
    if (razorpayOptions.order_id) {
      // Check if it's a valid Razorpay order ID format
      // Valid format: order_ followed by alphanumeric (e.g., order_M8q3kP2xYz9Ab)
      const isValidRazorpayOrderId = /^order_[A-Za-z0-9]{14,}$/.test(razorpayOptions.order_id);
      
      if (!isValidRazorpayOrderId) {
        // For testing: remove order_id to allow payment without backend
        // Razorpay will create order automatically when order_id is not provided
        console.warn('Mock order ID detected. Removing order_id for testing. For production, use real order from backend.');
        delete razorpayOptions.order_id;
      }
    }

    const razorpay = new window.Razorpay(razorpayOptions);
    
    // Add error handler
    razorpay.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response);
      if (onError) {
        onError(new Error(response.error?.description || 'Payment failed'));
      }
    });

    razorpay.open();
  } catch (error: any) {
    console.error('Razorpay initialization error:', error);
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
}

/**
 * Create Razorpay order (in production, this should be done on backend)
 * For now, we'll use a mock order ID
 * 
 * IMPORTANT: In production, you MUST create orders on your backend server
 * to keep your Razorpay secret key secure. Never expose secret keys in frontend code.
 */
export async function createRazorpayOrder(
  amount: number,
  currency: string = 'INR'
): Promise<{ orderId: string }> {
  // In production, make API call to your backend to create order
  // Example backend endpoint:
  // const response = await fetch('/api/razorpay/create-order', {
  //   method: 'POST',
  //   headers: { 
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${userToken}` // Add auth if needed
  //   },
  //   body: JSON.stringify({ amount, currency }),
  // });
  // const data = await response.json();
  // return { orderId: data.orderId };

  // For testing without backend, throw error to indicate no backend available
  // The payment flow will proceed without order_id (Razorpay creates order automatically)
  throw new Error('Backend order creation not available. Proceeding without order_id for testing.');
}

/**
 * Verify Razorpay payment signature (should be done on backend)
 * This is a placeholder - actual verification must happen on server
 */
export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> {
  // In production, verify payment signature on backend
  // const response = await fetch('/api/razorpay/verify-payment', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     razorpay_order_id: razorpayOrderId,
  //     razorpay_payment_id: razorpayPaymentId,
  //     razorpay_signature: razorpaySignature,
  //   }),
  // });
  // const data = await response.json();
  // return data.verified === true;

  // For development, assume payment is verified
  // In production, this MUST be verified on backend using Razorpay secret key
  return true;
}

