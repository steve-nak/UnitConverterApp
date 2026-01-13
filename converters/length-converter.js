/**
 * Length Converter Module
 */

// Conversion factors (all to meters)
const LENGTH_CONVERSION_FACTORS = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34
};

/**
 * Initialize length converter
 */
function initializeLengthConverter() {
    const fromValue = document.getElementById('lengthFromValue');
    const toValue = document.getElementById('lengthToValue');
    const fromUnit = document.getElementById('lengthFromUnit');
    const toUnit = document.getElementById('lengthToUnit');
    const swapBtn = document.getElementById('lengthSwapBtn');
    
    if (!fromValue || !toValue || !fromUnit || !toUnit || !swapBtn) {
        console.warn('Length converter elements not found');
        return;
    }
    
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
    const meters = value * LENGTH_CONVERSION_FACTORS[fromUnitValue];
    const result = meters / LENGTH_CONVERSION_FACTORS[toUnitValue];
    
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeLengthConverter,
        convertLength,
        swapLengthUnits,
        LENGTH_CONVERSION_FACTORS
    };
}
