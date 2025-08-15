const NewsCard = ({ article }) => {
  const {
    title,
    description,
    link,
    image_url,
    pubDate,
    source_id,
    source_name,
    source_url,
    sentiment
  } = article;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return '#10b981'; // green
      case 'negative':
        return '#ef4444'; // red
      case 'neutral':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '😐';
    }
  };
  return (
    <article className="news-card">
      <div className="news-card-image-container">
        <img
          src={image_url || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={title || 'News article'}
          className="news-card-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="news-card-overlay"></div>
      </div>
      
      <div className="news-card-content">
        <h2 className="news-card-title">
          {truncateText(title || 'Untitled Article', 80)}
        </h2>
        
        <div className="news-card-meta">
          <span className="news-card-source">
            {source_name || source_id || 'Unknown Source'}
          </span>
          {pubDate && (
            <>
              <span className="news-card-separator">•</span>
              <span className="news-card-date">
                {formatDate(pubDate)}
              </span>
            </>
          )}
        </div>
        
        {description && (
          <p className="news-card-description">
            {truncateText(description, 120)}
          </p>
        )}
        
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="news-card-link"
        >
          Read more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  );
};

export default NewsCard;