/**
 * Navigation Module - Handles tab switching
 */

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

/**
 * Handle navigation link clicks
 */
function handleNavClick(event) {
    event.preventDefault();
    
    const category = event.target.getAttribute('data-category');
    
    if (!category) return;
    
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update active section
    document.querySelectorAll('.converter-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const activeSection = document.getElementById(category);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        handleNavClick
    };
}
