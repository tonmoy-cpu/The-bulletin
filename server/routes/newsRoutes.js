// routes/newsRoutes.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import ApiKeyManager from "../utils/apiKeyManager.js";

dotenv.config();

const router = express.Router();

// Initialize API keys from environment variables
const API_KEYS = [
  process.env.NEWS_API_KEY,
  process.env.NEWS_API_KEY_2,
  process.env.NEWS_API_KEY_3,
  process.env.NEWS_API_KEY_4,
  process.env.NEWS_API_KEY_5
].filter(key => key && key.trim() !== '');

if (API_KEYS.length === 0) {
  console.error('❌ No valid API keys found in environment variables');
  process.exit(1);
}

const apiKeyManager = new ApiKeyManager(API_KEYS);
const BASE_URL = "https://newsdata.io/api/1";

// Enhanced fetch function with retry logic and key rotation
const fetchWithRetry = async (url, maxRetries = API_KEYS.length) => {
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const currentKey = apiKeyManager.getCurrentKey();
      const urlWithKey = new URL(url);
      urlWithKey.searchParams.set('apikey', currentKey);
      
      console.log(`🌐 Attempt ${attempt + 1}/${maxRetries} - Fetching: ${urlWithKey.pathname}${urlWithKey.search}`);
      
      const response = await fetch(urlWithKey.toString());
      
      if (response.status === 429) {
        // Rate limit exceeded
        console.warn(`⚠️ Rate limit exceeded for key: ${apiKeyManager.maskKey(currentKey)}`);
        apiKeyManager.markKeyAsBlocked(currentKey, 60); // Block for 60 minutes
        lastError = new Error(`Rate limit exceeded (429)`);
        continue; // Try next key
      }
      
      if (response.status === 403) {
        // API key invalid or expired
        console.warn(`⚠️ API key invalid or expired: ${apiKeyManager.maskKey(currentKey)}`);
        apiKeyManager.markKeyAsBlocked(currentKey, 1440); // Block for 24 hours
        lastError = new Error(`API key invalid or expired (403)`);
        continue; // Try next key
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`API request failed: ${response.status} - ${errorText}`);
        
        // For other errors, still rotate to next key but don't block current one
        if (attempt < maxRetries - 1) {
          apiKeyManager.rotateToNextKey();
          continue;
        }
        throw lastError;
      }
      
      // Success!
      console.log(`✅ Request successful with key: ${apiKeyManager.maskKey(currentKey)}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      lastError = error;
      
      // If it's a network error and we have more attempts, try next key
      if (attempt < maxRetries - 1) {
        apiKeyManager.rotateToNextKey();
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // All attempts failed
  throw lastError || new Error('All API keys exhausted');
};

// Helper function to build API URL with filters
const buildApiUrl = (endpoint, params = {}, includeApiKey = false) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  
  // Only add API key if requested (for logging purposes)
  if (includeApiKey) {
    url.searchParams.append('apikey', 'API_KEY_PLACEHOLDER');
  }
  
  // Add filters
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Helper function to handle timeframe filter
const getTimeframeDate = (timeframe) => {
  if (!timeframe) return null;
  
  const now = new Date();
  switch (timeframe) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    default:
      return null;
  }
};

// Add API status endpoint for monitoring
router.get("/api-status", (req, res) => {
  const status = apiKeyManager.getStatus();
  res.json({
    ...status,
    timestamp: new Date().toISOString()
  });
});

// Add manual reset endpoint (for development/testing)
router.post("/reset-keys", (req, res) => {
  apiKeyManager.resetAllKeys();
  res.json({ message: "All API keys reset successfully" });
});

// Search news articles
router.get("/search", async (req, res) => {
  const { q, language, country, timeframe, sentiment } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  
  try {
    const params = {
      q
    };
    
    // Only add language if specified and not empty
    if (language && language.trim() !== '') {
      params.language = language;
    }
    
    // Only add country if specified and not empty
    if (country && country.trim() !== '') {
      params.country = country;
    }
    
    // Add timeframe if specified
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate;
    }
    
    // Note: Sentiment is likely a premium feature - commenting out for now
    // if (sentiment && sentiment.trim() !== '') {
    //   params.sentiment = sentiment;
    // }
    
    const url = buildApiUrl('news', params);
    console.log('🔍 Search API URL:', url);
    
    const response = await fetchWithRetry(url);
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("❌ Error searching news:", error);
    res.status(500).json({ error: `Failed to search news: ${error.message}` });
  }
});

// Fetch news by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const { language, country, timeframe, sentiment } = req.query;
  
  try {
    const params = {
      category: category.toLowerCase()
    };
    
    // Only add language if specified and not empty
    if (language && language.trim() !== '') {
      params.language = language;
    }
    
    // Only add country if specified and not empty
    if (country && country.trim() !== '') {
      params.country = country;
    }
    
    // Add timeframe if specified
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate;
    }
    
    // Note: Sentiment is likely a premium feature - commenting out for now
    // if (sentiment && sentiment.trim() !== '') {
    //   params.sentiment = sentiment;
    // }
    
    const url = buildApiUrl('news', params);
    console.log('📂 Category API URL:', url);
    
    const response = await fetchWithRetry(url);
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("❌ Error fetching news by category:", error);
    res.status(500).json({ error: `Failed to fetch news by category: ${error.message}` });
  }
});

// Fetch top headlines
router.get("/top-headlines", async (req, res) => {
  const { language, country, timeframe, sentiment } = req.query;
  
  try {
    const params = {
      prioritydomain: 'top'
    };
    
    // Only add language if specified and not empty
    if (language && language.trim() !== '') {
      params.language = language;
    }
    
    // Only add country if specified and not empty
    if (country && country.trim() !== '') {
      params.country = country;
    }
    
    // Add timeframe if specified
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate;
    }
    
    // Note: Sentiment is likely a premium feature - commenting out for now
    // if (sentiment && sentiment.trim() !== '') {
    //   params.sentiment = sentiment;
    // }
    
    const url = buildApiUrl('news', params);
    console.log('📰 Headlines API URL:', url);
    
    const response = await fetchWithRetry(url);
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("❌ Error fetching top headlines:", error);
    res.status(500).json({ error: `Failed to fetch top headlines: ${error.message}` });
  }
});

export default router;