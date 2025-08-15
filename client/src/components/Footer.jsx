const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Side - Logo + Description */}
        <div className="footer-left">
          <div className="footer-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 8h6M7 12h8M7 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="footer-logo-text">News Curator</span>
          </div>
          <p className="footer-description">
            Curated news from around the world — tailored to your interests, updated in real time.
          </p>
          <div className="footer-contact">
            <p><a href="mailto:support@newscurator.com">Email: support@newscurator.com</a></p>
            <p><a href="tel:+1 (555) 123-4567">Phone: +1 (555) 123-4567</a></p>
          </div>
        </div>

        {/* Right Side - Links */}
        <div className="footer-right">
          <ul className="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="footer-bottom">
        <p>© 2025 News Curator. All rights reserved.</p>
        <p>Powered by NewsData.io</p>
      </div>
    </footer>
  );
};

export default Footer;
