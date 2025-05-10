import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

/**
 * A component that displays a monetary value formatted according to the user's currency preference
 * @param {object} props - Component props
 * @param {number} props.amount - The monetary amount to display
 * @param {string} props.className - Optional CSS class names
 * @returns {JSX.Element} - Rendered component
 */
const CurrencyDisplay = ({ amount, className = '' }) => {
  const { formatAmount, currencySymbol, currency } = useCurrency();

  return (
    <span className={`currency-display ${className}`} title={`Amount in ${currency}`}>
      {formatAmount(amount)}
    </span>
  );
};

export default CurrencyDisplay; 