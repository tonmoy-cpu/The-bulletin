const API_BASE_URL = "/api/news";

// Fetch news by category with filters
export async function fetchNewsByCategory(category, filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.language) params.append('language', filters.language);
    if (filters.country) params.append('country', filters.country);
    if (filters.timeframe) params.append('timeframe', filters.timeframe);
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/category/${category}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch news for category ${category}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    throw error;
  }
}

// Search news articles
export async function searchNews(query, filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters.language) params.append('language', filters.language);
    if (filters.country) params.append('country', filters.country);
    if (filters.timeframe) params.append('timeframe', filters.timeframe);
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/search?${queryString}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to search news: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
}

// Fetch top headlines with filters
export async function fetchTopHeadlines(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.language) params.append('language', filters.language);
    if (filters.country) params.append('country', filters.country);
    if (filters.timeframe) params.append('timeframe', filters.timeframe);
    if (filters.sentiment) params.append('sentiment', filters.sentiment);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/top-headlines${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch top headlines: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    throw error;
  }
}