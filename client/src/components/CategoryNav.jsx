import categories from "../data/categories";

const CategoryNav = ({ selectedCategory, onCategorySelect }) => {
  return (
    <nav className="category-nav">
      <div className="category-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;