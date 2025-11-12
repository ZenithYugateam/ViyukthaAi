// Groq API Key Rotation System
// Automatically rotates keys when rate limits are exceeded

// Get API keys from environment variables
// Format: VITE_GROQ_API_KEY_1, VITE_GROQ_API_KEY_2, VITE_GROQ_API_KEY_3, etc.
// Or use VITE_GROQ_API_KEY for single key, or VITE_GROQ_API_KEYS (comma-separated) for multiple
function getGroqApiKeysFromEnv(): string[] {
  const keys: string[] = [];
  
  // Check for single key
  const singleKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROK_API_KEY;
  if (singleKey) {
    keys.push(singleKey);
  }
  
  // Check for comma-separated keys
  const multipleKeys = import.meta.env.VITE_GROQ_API_KEYS;
  if (multipleKeys) {
    const parsedKeys = multipleKeys.split(',').map(k => k.trim()).filter(k => k);
    keys.push(...parsedKeys);
  }
  
  // Check for numbered keys (VITE_GROQ_API_KEY_1, VITE_GROQ_API_KEY_2, etc.)
  for (let i = 1; i <= 10; i++) {
    const key = import.meta.env[`VITE_GROQ_API_KEY_${i}`];
    if (key && !keys.includes(key)) {
      keys.push(key);
    }
  }
  
  return keys;
}

const GROQ_API_KEYS = getGroqApiKeysFromEnv();

// Track which keys are currently rate-limited
const rateLimitedKeys = new Set<string>();
const keyUsageCount = new Map<string, number>();
let currentKeyIndex = 0;

// Get the next available API key
export function getGroqApiKey(): string {
  // Refresh keys from environment (in case they changed)
  const envKeys = getGroqApiKeysFromEnv();
  
  // If no keys configured, throw error
  if (envKeys.length === 0) {
    throw new Error('No Groq API keys configured. Please set VITE_GROQ_API_KEY or VITE_GROQ_API_KEYS in your .env file.');
  }

  // Find next available key from rotation pool
  let attempts = 0;
  const keysToUse = envKeys.length > 0 ? envKeys : GROQ_API_KEYS;
  
  while (attempts < keysToUse.length) {
    const key = keysToUse[currentKeyIndex];
    
    if (!rateLimitedKeys.has(key)) {
      // Increment usage count
      keyUsageCount.set(key, (keyUsageCount.get(key) || 0) + 1);
      return key;
    }
    
    // Move to next key
    currentKeyIndex = (currentKeyIndex + 1) % keysToUse.length;
    attempts++;
  }

  // If all keys are rate-limited, reset and use first key
  console.warn('All API keys are rate-limited, resetting and using first key');
  rateLimitedKeys.clear();
  currentKeyIndex = 0;
  return keysToUse[0];
}

// Mark a key as rate-limited
export function markKeyAsRateLimited(key: string): void {
  rateLimitedKeys.add(key);
  console.log(`Key marked as rate-limited: ${key.substring(0, 20)}...`);
  
  // Auto-reset after 1 hour (3600000 ms)
  setTimeout(() => {
    rateLimitedKeys.delete(key);
    console.log(`Key reset after rate limit: ${key.substring(0, 20)}...`);
  }, 3600000);
}

// Check if error is a rate limit error (429)
export function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  const status = error.status || error.statusCode || error.response?.status;
  const message = error.message || error.response?.data?.message || '';
  
  return status === 429 || 
         message.includes('429') || 
         message.toLowerCase().includes('rate limit') ||
         message.toLowerCase().includes('too many requests') ||
         message.toLowerCase().includes('quota exceeded');
}

// Execute Groq API call with automatic retry and key rotation
export async function executeWithKeyRotation<T>(
  apiCall: (apiKey: string) => Promise<T>,
  maxRetries?: number
): Promise<T> {
  const envKeys = getGroqApiKeysFromEnv();
  const keysToUse = envKeys.length > 0 ? envKeys : GROQ_API_KEYS;
  const retries = maxRetries ?? Math.max(keysToUse.length, 1);
  let lastError: any = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const apiKey = getGroqApiKey();
      const result = await apiCall(apiKey);
      
      // Success - reset current key index for next round-robin
      const currentKeys = getGroqApiKeysFromEnv();
      const keys = currentKeys.length > 0 ? currentKeys : GROQ_API_KEYS;
      currentKeyIndex = (currentKeyIndex + 1) % keys.length;
      return result;
    } catch (error: any) {
      lastError = error;
      
      if (isRateLimitError(error)) {
        // Mark current key as rate-limited
        const currentKeys = getGroqApiKeysFromEnv();
        const keys = currentKeys.length > 0 ? currentKeys : GROQ_API_KEYS;
        const currentKey = keys[currentKeyIndex];
        markKeyAsRateLimited(currentKey);
        
        // Move to next key
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        
        console.log(`Rate limit hit, rotating to next API key (attempt ${attempt + 1}/${retries})`);
        
        // Wait a bit before retrying with next key
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // For non-rate-limit errors, throw immediately
      throw error;
    }
  }
  
  // All retries exhausted
  throw new Error(`All API keys exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
}

