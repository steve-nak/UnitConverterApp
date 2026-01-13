/**
 * Temperature Converter Module
 */

/**
 * Initialize temperature converter
 */
function initializeTemperatureConverter() {
    const fromValue = document.getElementById('temperatureFromValue');
    const toValue = document.getElementById('temperatureToValue');
    const fromUnit = document.getElementById('temperatureFromUnit');
    const toUnit = document.getElementById('temperatureToUnit');
    const swapBtn = document.getElementById('temperatureSwapBtn');
    
    if (!fromValue || !toValue || !fromUnit || !toUnit || !swapBtn) {
        console.warn('Temperature converter elements not found');
        return;
    }
    
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTemperatureConverter,
        convertTemperature,
        swapTemperatureUnits
    };
}
