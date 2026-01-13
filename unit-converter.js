// Unit Converter App - JavaScript

// Conversion factors (all to meters)
const CONVERSION_FACTORS = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34
};

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLengthConverter();
    initializeTemperatureConverter();
});

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

/**
 * Initialize length converter
 */
function initializeLengthConverter() {
    const fromValue = document.getElementById('lengthFromValue');
    const toValue = document.getElementById('lengthToValue');
    const fromUnit = document.getElementById('lengthFromUnit');
    const toUnit = document.getElementById('lengthToUnit');
    const swapBtn = document.getElementById('lengthSwapBtn');
    
    // Add event listeners
    fromValue.addEventListener('input', () => convertLength(fromValue, toValue, fromUnit, toUnit));
    fromUnit.addEventListener('change', () => convertLength(fromValue, toValue, fromUnit, toUnit));
    toUnit.addEventListener('change', () => convertLength(fromValue, toValue, fromUnit, toUnit));
    swapBtn.addEventListener('click', () => swapLengthUnits(fromValue, toValue, fromUnit, toUnit));
    
    // Initial conversion
    convertLength(fromValue, toValue, fromUnit, toUnit);
}

/**
 * Convert length from one unit to another
 */
function convertLength(fromValue, toValue, fromUnit, toUnit) {
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value) || value < 0) {
        toValue.value = '';
        return;
    }
    
    const fromUnitValue = fromUnit.value;
    const toUnitValue = toUnit.value;
    
    // Convert to meters first, then to target unit
    const meters = value * CONVERSION_FACTORS[fromUnitValue];
    const result = meters / CONVERSION_FACTORS[toUnitValue];
    
    // Round to 10 decimal places to avoid floating-point errors
    toValue.value = Math.round(result * 10000000000) / 10000000000;
}

/**
 * Swap length units and values
 */
function swapLengthUnits(fromValue, toValue, fromUnit, toUnit) {
    // Swap unit selects
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    // Swap values
    const tempValue = fromValue.value;
    fromValue.value = toValue.value || 1;
    toValue.value = tempValue;
    
    // Trigger conversion
    convertLength(fromValue, toValue, fromUnit, toUnit);
}

/**
 * Initialize converter sections (placeholder for future converters)
 */
function initializeConverters() {
    // This function will be expanded to initialize specific converters
    console.log('Converters initialized');
}

/**
 * Initialize temperature converter
 */
function initializeTemperatureConverter() {
    const fromValue = document.getElementById('temperatureFromValue');
    const toValue = document.getElementById('temperatureToValue');
    const fromUnit = document.getElementById('temperatureFromUnit');
    const toUnit = document.getElementById('temperatureToUnit');
    const swapBtn = document.getElementById('temperatureSwapBtn');
    
    // Add event listeners
    fromValue.addEventListener('input', () => convertTemperature(fromValue, toValue, fromUnit, toUnit));
    fromUnit.addEventListener('change', () => convertTemperature(fromValue, toValue, fromUnit, toUnit));
    toUnit.addEventListener('change', () => convertTemperature(fromValue, toValue, fromUnit, toUnit));
    swapBtn.addEventListener('click', () => swapTemperatureUnits(fromValue, toValue, fromUnit, toUnit));
    
    // Initial conversion
    convertTemperature(fromValue, toValue, fromUnit, toUnit);
}

/**
 * Convert temperature from one unit to another
 */
function convertTemperature(fromValue, toValue, fromUnit, toUnit) {
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value)) {
        toValue.value = '';
        return;
    }
    
    const fromUnitValue = fromUnit.value;
    const toUnitValue = toUnit.value;
    
    // If same unit, just copy the value
    if (fromUnitValue === toUnitValue) {
        toValue.value = value;
        return;
    }
    
    let kelvin;
    
    // Convert input to Kelvin first
    switch (fromUnitValue) {
        case 'celsius':
            kelvin = value + 273.15;
            break;
        case 'fahrenheit':
            kelvin = (value - 32) * 5/9 + 273.15;
            break;
        case 'kelvin':
            kelvin = value;
            break;
        default:
            kelvin = value;
    }
    
    // Check for invalid Kelvin (below absolute zero)
    if (kelvin < 0) {
        toValue.value = 'Invalid';
        return;
    }
    
    // Convert from Kelvin to target unit
    let result;
    switch (toUnitValue) {
        case 'celsius':
            result = kelvin - 273.15;
            break;
        case 'fahrenheit':
            result = (kelvin - 273.15) * 9/5 + 32;
            break;
        case 'kelvin':
            result = kelvin;
            break;
        default:
            result = kelvin;
    }
    
    // Round to 10 decimal places
    toValue.value = Math.round(result * 10000000000) / 10000000000;
}

/**
 * Swap temperature units and values
 */
function swapTemperatureUnits(fromValue, toValue, fromUnit, toUnit) {
    // Swap unit selects
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    // Swap values
    const tempValue = fromValue.value;
    fromValue.value = toValue.value || 0;
    toValue.value = tempValue;
    
    // Trigger conversion
    convertTemperature(fromValue, toValue, fromUnit, toUnit);
}

// Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        handleNavClick,
        initializeConverters,
        initializeLengthConverter,
        convertLength,
        swapLengthUnits,
        initializeTemperatureConverter,
        convertTemperature,
        swapTemperatureUnits,
        CONVERSION_FACTORS
    };
}
