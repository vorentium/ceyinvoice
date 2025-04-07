/**
 * Handles smooth scrolling to a section on the page when clicking anchor links
 * @param {string} id - The ID of the element to scroll to
 */
export const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    // Scroll to the element with smooth behavior
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

/**
 * Sets up scroll handling for all anchor links pointing to sections on the current page
 */
export const setupSmoothScrolling = () => {
  document.addEventListener('click', (e) => {
    // Check if the clicked element is an anchor link pointing to an ID on the same page
    const target = e.target.closest('a');
    if (target && target.href && target.href.includes('#')) {
      const url = new URL(target.href);
      
      // Only handle links to sections on the current page
      if (url.pathname === window.location.pathname || url.pathname === '/') {
        const id = url.hash.substring(1); // Remove the # character
        if (id) {
          e.preventDefault();
          scrollToSection(id);
          
          // Update URL without causing a page reload
          window.history.pushState(null, '', url.hash);
        }
      }
    }
  });
}; 