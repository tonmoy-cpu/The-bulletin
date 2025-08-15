import { useEffect, useState } from "react";
import Header from "../components/Header";
import CategoryNav from "../components/CategoryNav";
import FilterControls from "../components/FilterControls";
import NewsGrid from "../components/NewsGrid";
import Footer from "../components/Footer";
import { fetchNewsByCategory, searchNews } from "../api/newsApi";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    country: '',
    category: '',
    timeframe: '',
    sentiment: ''
  });

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setIsSearchMode(true);

    try {
      const news = await searchNews(query, filters);
      setArticles(news);
    } catch (err) {
      setError("Failed to search news. Please try again later.");
      setArticles([]);
    }

    setLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSearchMode(false);
    setSearchQuery("");
    // Clear category filter when selecting from nav
    setFilters(prev => ({ ...prev, category: '' }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // If category filter is changed, switch to filter mode
    if (filterType === 'category' && value) {
      setIsSearchMode(false);
      setSearchQuery("");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      language: '',
      country: '',
      category: '',
      timeframe: '',
      sentiment: ''
    });
  };

  useEffect(() => {
    if (isSearchMode && searchQuery) {
      handleSearch(searchQuery);
      return;
    }

    const getNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // If category filter is set, use that instead of selected category
        const categoryToUse = filters.category || selectedCategory;
        const news = await fetchNewsByCategory(categoryToUse, filters);
        setArticles(news);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
        setArticles([]);
      }

      setLoading(false);
    };

    getNews();
  }, [selectedCategory, filters, isSearchMode]);

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <FilterControls 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <main className="main-content">
        <NewsGrid 
          articles={articles}
          loading={loading}
          error={error}
        />
      </main>
      
      <Footer />
    </div>
  );
}

export default Home;