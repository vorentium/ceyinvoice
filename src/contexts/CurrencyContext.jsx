import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { formatCurrency, getCurrencySymbol, createCurrencyFormatter } from '../utils/formatCurrency';

// Create a context for currency
const CurrencyContext = createContext({
  currency: 'USD',
  currencySymbol: '$',
  formatAmount: (amount) => formatCurrency(amount, 'USD'),
  setCurrency: () => {},
});

// Custom hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);

// Provider component to wrap the application with
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [formatAmount, setFormatAmount] = useState(() => createCurrencyFormatter('USD'));

  // Update the formatter and symbol when currency changes
  useEffect(() => {
    setCurrencySymbol(getCurrencySymbol(currency));
    setFormatAmount(() => createCurrencyFormatter(currency));
  }, [currency]);

  // Update the currency when the user profile changes or is loaded
  useEffect(() => {
    const fetchUserCurrency = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          return;
        }
        
        if (data?.currency) {
          setCurrency(data.currency);
        }
      } catch (error) {
      }
    };
    
    fetchUserCurrency();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUserCurrency();
        } else if (event === 'SIGNED_OUT') {
          // Reset to default when signed out
          setCurrency('USD');
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Values provided to consumers of this context
  const contextValue = {
    currency,
    currencySymbol,
    formatAmount,
    setCurrency: (newCurrency) => {
      setCurrency(newCurrency);
      
      // If the user is authenticated, update their preference in the database
      const updateUserCurrency = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;
        
        try {
          await supabase
            .from('profiles')
            .update({ currency: newCurrency })
            .eq('id', session.user.id);
        } catch (error) {
        }
      };
      
      updateUserCurrency();
    },
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext; 