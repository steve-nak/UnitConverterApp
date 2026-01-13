/**
 * Main Application Initialization
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLengthConverter();
    initializeTemperatureConverter();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
