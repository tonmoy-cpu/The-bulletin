import NewsCard from './NewsCard';

const NewsGrid = ({ articles, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Curating the latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          {error.includes('Rate limit') || error.includes('429') ? '⏱️' : 
           error.includes('API key') || error.includes('403') ? '🔑' : '⚠️'}
        </div>
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-text">{error}</p>
        {(error.includes('Rate limit') || error.includes('API key')) && (
          <p className="error-subtext">
            Our system is automatically switching to backup servers. Please try again in a moment.
          </p>
        )}
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">📰</div>
        <h3 className="empty-title">No articles found</h3>
        <p className="empty-text">Try adjusting your search terms or filters to find more content</p>
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.map((article, index) => (
        <NewsCard key={`${article.article_id || article.link || index}`} article={article} />
      ))}
    </div>
  );
};

export default NewsGrid;