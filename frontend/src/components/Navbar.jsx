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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => scrollToSection('header')}>
          🌱 Agri-Architect
        </div>

        <div className="navbar-links">
          {resultsVisible ? (
            <>
              <button onClick={() => scrollToSection('results-simulation')}>Simulation</button>
              <button onClick={() => scrollToSection('results-recipe')}>Recipe</button>
              <button onClick={() => scrollToSection('results-roi')}>ROI</button>
              <button onClick={() => scrollToSection('results-watering')}>Watering</button>
              <button onClick={() => scrollToSection('results-export')}>Export/Share</button>
            </>
          ) : (
            <>
              <button onClick={() => scrollToSection('form')}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;