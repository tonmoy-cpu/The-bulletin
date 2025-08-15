// routes/newsRoutes.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsdata.io/api/1";

// Helper function to build API URL with filters
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('apikey', API_KEY);
  
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
    console.log('Search API URL:', url); // Debug log
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("Error searching news:", error);
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
    console.log('Category API URL:', url); // Debug log
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("Error fetching news by category:", error);
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
    console.log('Headlines API URL:', url); // Debug log
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    res.status(500).json({ error: `Failed to fetch top headlines: ${error.message}` });
  }
});

export default router;