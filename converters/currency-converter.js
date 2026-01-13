/**
 * Currency Converter Module
 * Uses Open Exchange Rates API or Fixer API for real-time exchange rates
 */

// Cache for exchange rates with timestamp
let exchangeRatesCache = {
    rates: {},
    timestamp: 0,
    CACHE_DURATION: 3600000 // 1 hour in milliseconds
};

/**
 * Initialize currency converter
 */
function initializeCurrencyConverter() {
    const fromValue = document.getElementById('currencyFromValue');
    const toValue = document.getElementById('currencyToValue');
    const fromUnit = document.getElementById('currencyFromUnit');
    const toUnit = document.getElementById('currencyToUnit');
    const swapBtn = document.getElementById('currencySwapBtn');
    
    if (!fromValue || !toValue || !fromUnit || !toUnit || !swapBtn) {
        console.warn('Currency converter elements not found');
        return;
    }
    
    // Add event listeners
    fromValue.addEventListener('input', () => convertCurrency(fromValue, toValue, fromUnit, toUnit));
    fromUnit.addEventListener('change', () => convertCurrency(fromValue, toValue, fromUnit, toUnit));
    toUnit.addEventListener('change', () => convertCurrency(fromValue, toValue, fromUnit, toUnit));
    swapBtn.addEventListener('click', () => swapCurrencyUnits(fromValue, toValue, fromUnit, toUnit));
    
    // Initial conversion
    convertCurrency(fromValue, toValue, fromUnit, toUnit);
}

/**
 * Fetch real-time exchange rates from API
 * Always uses USD as base currency for consistency
 */
async function getExchangeRates() {
    const now = Date.now();
    const baseCurrency = 'USD';
    
    // Check if cache is still valid
    if (exchangeRatesCache.rates[baseCurrency] && 
        (now - exchangeRatesCache.timestamp) < exchangeRatesCache.CACHE_DURATION) {
        return exchangeRatesCache.rates[baseCurrency];
    }
    
    try {
        // Using exchangerate-api.com (free tier - no API key required)
        // Always fetch USD as base for consistency
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        
        // Cache the rates
        exchangeRatesCache.rates[baseCurrency] = data.rates;
        exchangeRatesCache.timestamp = now;
        
        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        
        // If cache exists (even if expired), use it as fallback
        if (exchangeRatesCache.rates['USD']) {
            return exchangeRatesCache.rates['USD'];
        }
        
        // Last resort fallback rates
        return getFallbackRates();
    }
}

/**
 * Fallback exchange rates (approximate, when API is unavailable)
 */
function getFallbackRates() {
    // All rates relative to USD (1 USD = ...)
    return {
        'USD': 1.0,
        'EUR': 0.92,
        'GBP': 0.79,
        'CHF': 0.88
    };
}

/**
 * Convert currency using real-time rates
 */
async function convertCurrency(fromValue, toValue, fromUnit, toUnit) {
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value) || value < 0) {
        toValue.value = '';
        return;
    }
    
    const fromCurrency = fromUnit.value.toUpperCase();
    const toCurrency = toUnit.value.toUpperCase();
    
    // If same currency, just copy the value
    if (fromCurrency === toCurrency) {
        toValue.value = value;
        return;
    }
    
    try {
        // Show loading state
        toValue.value = 'Loading...';
        
        // Always fetch with USD as base for consistency
        const ratesFromUSD = await getExchangeRates();
        
        // Get rates for both currencies relative to USD
        const fromCurrencyRate = ratesFromUSD[fromCurrency];
        const toCurrencyRate = ratesFromUSD[toCurrency];
        
        if (!fromCurrencyRate || !toCurrencyRate) {
            toValue.value = 'N/A';
            return;
        }
        
        // Convert: fromCurrency -> USD -> toCurrency
        // 1 fromCurrency = fromCurrencyRate USD
        // 1 USD = 1/toCurrencyRate toCurrency
        // So: 1 fromCurrency = (fromCurrencyRate / toCurrencyRate) toCurrency
        const result = value * (fromCurrencyRate / toCurrencyRate);
        
        // Round to 2 decimal places for currency
        toValue.value = Math.round(result * 100) / 100;
    } catch (error) {
        console.error('Conversion error:', error);
        toValue.value = 'Error';
    }
}

/**
 * Swap currency units and values
 */
function swapCurrencyUnits(fromValue, toValue, fromUnit, toUnit) {
    // Swap select values
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    // Swap input values
    const tempValue = fromValue.value;
    fromValue.value = toValue.value;
    toValue.value = tempValue;
    
    // Trigger conversion
    convertCurrency(fromValue, toValue, fromUnit, toUnit);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCurrencyConverter,
        convertCurrency,
        getExchangeRates,
        swapCurrencyUnits
    };
}
