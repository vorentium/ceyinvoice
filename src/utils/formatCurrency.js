/**
 * Formats a number as currency based on the provided currency code
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR', 'LKR')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === null || amount === undefined) {
    return '';
  }

  try {
    // Format the number as currency using the Intl.NumberFormat API
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error(`Error formatting currency (${currencyCode}):`, error);
    // Fallback to a simple format if the currency code is invalid
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

/**
 * Get the currency symbol for a given currency code
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (currencyCode = 'USD') => {
  try {
    // Get the currency symbol using the Intl.NumberFormat API
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      .format(0)
      .replace(/[0-9]/g, '')
      .trim();
  } catch (error) {
    console.error(`Error getting currency symbol (${currencyCode}):`, error);
    // Return the currency code as fallback
    return currencyCode;
  }
};

/**
 * Creates a context-aware currency formatter function that uses the user's currency preference
 * @param {string} userCurrency - The user's preferred currency code
 * @returns {Function} - A formatter function that takes an amount and returns a formatted string
 */
export const createCurrencyFormatter = (userCurrency = 'USD') => {
  return (amount) => formatCurrency(amount, userCurrency);
};

export default formatCurrency; 