import { useState, useEffect } from 'react';

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -80; // Offset for fixed navbar
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

function Navbar({ resultsVisible }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    scrollToSection(id);
    setMobileMenuOpen(false); // Close mobile menu on link click
  };

  const renderLinks = () => {
    if (resultsVisible) {
      return (
        <>
          <button onClick={() => handleLinkClick('results-simulation')}>Simulation</button>
          <button onClick={() => handleLinkClick('results-recipe')}>Recipe</button>
          <button onClick={() => handleLinkClick('results-roi')}>ROI</button>
          <button onClick={() => handleLinkClick('results-watering')}>Watering</button>
          <button onClick={() => handleLinkClick('results-export')}>Export/Share</button>
        </>
      );
    } else {
      return <button onClick={() => handleLinkClick('form')}>Get Started</button>;
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => handleLinkClick('header')}>
          🌱 Agri-Architect
        </div>

        {/* Desktop Links */}
        <div className="navbar-links desktop-links">
          {renderLinks()}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${mobileMenuOpen ? 'open' : ''}`}></div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - now has the 'open' class applied conditionally */}
      <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {renderLinks()}
      </div>
    </nav>
  );
}

export default Navbar;