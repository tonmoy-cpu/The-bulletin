import { useState } from 'react';

const FilterControls = ({ filters, onFilterChange, onClearFilters }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const availableCategories = [
    { value: '', label: 'All categories' },
    { value: 'business', label: 'Business' },
    { value: 'crime', label: 'Crime' },
    { value: 'domestic', label: 'Domestic' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'environment', label: 'Environment' },
    { value: 'food', label: 'Food' },
    { value: 'health', label: 'Health' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'other', label: 'Other' },
    { value: 'politics', label: 'Politics' },
    { value: 'science', label: 'Science' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'top', label: 'Top Stories' },
    { value: 'tourism', label: 'Tourism' },
    { value: 'world', label: 'World' }
  ];

  const filterOptions = {
    language: [
      { value: 'en', label: 'English' },
      { value: 'hi', label: 'Hindi' },
      { value: 'ar', label: 'Arabic' },
      { value: 'zh', label: 'Chinese' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'he', label: 'Hebrew' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ml', label: 'Malayalam' },
      { value: 'mr', label: 'Marathi' },
      { value: 'no', label: 'Norwegian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'te', label: 'Telugu' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    country: [
      { value: 'ae', label: 'United Arab Emirates' },
      { value: 'ar', label: 'Argentina' },
      { value: 'at', label: 'Austria' },
      { value: 'au', label: 'Australia' },
      { value: 'be', label: 'Belgium' },
      { value: 'bg', label: 'Bulgaria' },
      { value: 'br', label: 'Brazil' },
      { value: 'ca', label: 'Canada' },
      { value: 'ch', label: 'Switzerland' },
      { value: 'cn', label: 'China' },
      { value: 'co', label: 'Colombia' },
      { value: 'cu', label: 'Cuba' },
      { value: 'cz', label: 'Czech Republic' },
      { value: 'de', label: 'Germany' },
      { value: 'eg', label: 'Egypt' },
      { value: 'fr', label: 'France' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'gr', label: 'Greece' },
      { value: 'hk', label: 'Hong Kong' },
      { value: 'hu', label: 'Hungary' },
      { value: 'id', label: 'Indonesia' },
      { value: 'ie', label: 'Ireland' },
      { value: 'il', label: 'Israel' },
      { value: 'in', label: 'India' },
      { value: 'it', label: 'Italy' },
      { value: 'jp', label: 'Japan' },
      { value: 'kr', label: 'South Korea' },
      { value: 'lt', label: 'Lithuania' },
      { value: 'lv', label: 'Latvia' },
      { value: 'ma', label: 'Morocco' },
      { value: 'mx', label: 'Mexico' },
      { value: 'my', label: 'Malaysia' },
      { value: 'ng', label: 'Nigeria' },
      { value: 'nl', label: 'Netherlands' },
      { value: 'no', label: 'Norway' },
      { value: 'nz', label: 'New Zealand' },
      { value: 'ph', label: 'Philippines' },
      { value: 'pl', label: 'Poland' },
      { value: 'pt', label: 'Portugal' },
      { value: 'ro', label: 'Romania' },
      { value: 'rs', label: 'Serbia' },
      { value: 'ru', label: 'Russia' },
      { value: 'sa', label: 'Saudi Arabia' },
      { value: 'se', label: 'Sweden' },
      { value: 'sg', label: 'Singapore' },
      { value: 'si', label: 'Slovenia' },
      { value: 'sk', label: 'Slovakia' },
      { value: 'th', label: 'Thailand' },
      { value: 'tr', label: 'Turkey' },
      { value: 'tw', label: 'Taiwan' },
      { value: 'ua', label: 'Ukraine' },
      { value: 'us', label: 'United States' },
      { value: 've', label: 'Venezuela' },
      { value: 'za', label: 'South Africa' }
    ],
    timeframe: [
      { value: '24h', label: 'Last 24 hours' },
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' }
    ],
    sentiment: [
      // Sentiment analysis is typically a premium feature
      // Commenting out until confirmed it works with your API tier
      // { value: 'positive', label: 'Positive' },
      // { value: 'neutral', label: 'Neutral' },
      // { value: 'negative', label: 'Negative' }
    ]
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const handleCategoryChange = (category) => {
    onFilterChange('category', category);
    setShowCategoryDropdown(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;
  const selectedCategoryLabel = availableCategories.find(cat => cat.value === filters.category)?.label || 'All categories';

  return (
    <div className="filter-controls">
      <div className="filter-container">
        <div className="filter-left">
          <div className="dropdown-container">
            <button 
              className="dropdown-btn"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {selectedCategoryLabel}
              <svg className={`dropdown-arrow ${showCategoryDropdown ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showCategoryDropdown && (
              <div className="category-dropdown">
                {availableCategories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`category-dropdown-item ${filters.category === category.value ? 'active' : ''}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <button 
              className="dropdown-btn filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              Filter {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
              <svg className={`dropdown-arrow ${showFilterDropdown ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown">
                <div className="filter-section">
                  <label className="filter-label">Language</label>
                  <select 
                    value={filters.language || ''} 
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All languages</option>
                    {filterOptions.language.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-section">
                  <label className="filter-label">Country</label>
                  <select 
                    value={filters.country || ''} 
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All countries</option>
                    {filterOptions.country.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-section">
                  <label className="filter-label">Time</label>
                  <select 
                    value={filters.timeframe || ''} 
                    onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All time</option>
                    {filterOptions.timeframe.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sentiment filter temporarily disabled - likely premium feature */}
                {/* <div className="filter-section">
                  <label className="filter-label">Sentiment</label>
                  <select 
                    value={filters.sentiment || ''} 
                    onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All sentiments</option>
                    {filterOptions.sentiment.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div> */}

                {activeFiltersCount > 0 && (
                  <button className="clear-filters-btn" onClick={onClearFilters}>
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;