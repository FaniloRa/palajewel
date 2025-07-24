
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Currency, CurrencyInfo } from '@/types';

interface UseCurrencyReturn {
    currency: CurrencyInfo;
    formatPrice: (priceInEur: number, options?: { style?: 'decimal' | 'currency' }) => string;
    convertPrice: (priceInEur: number) => number;
    isLoading: boolean;
}

const currencies: Record<Currency, CurrencyInfo> = {
    EUR: { code: 'EUR', symbol: '€' },
    MGA: { code: 'MGA', symbol: 'Ar' },
};

// This hook is now self-sufficient and fetches its own data on the client.
// It removes the need to pass down country and exchangeRate props everywhere.
export function useCurrency(): UseCurrencyReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(currencies.EUR);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCurrencyData() {
            try {
                // In a real app, these would be API calls.
                // We simulate this by accessing localStorage or having defaults.
                // For this project, we'll mimic fetching settings.
                const country = localStorage.getItem('userCountry') || 'FR'; // Default to FR
                const rateStr = localStorage.getItem('exchangeRate');

                const rate = rateStr ? parseFloat(rateStr) : null;
                setExchangeRate(rate);
                
                if (country === 'MG' && rate) {
                    setCurrencyInfo(currencies.MGA);
                } else {
                    setCurrencyInfo(currencies.EUR);
                }
            } catch (error) {
                console.error("Failed to determine currency data, defaulting to EUR.", error);
                setCurrencyInfo(currencies.EUR);
            } finally {
                setIsLoading(false);
            }
        }

        // A mock to simulate data being available from server components setting it
        // In a real complex app, this might come from a context provider at the root.
        const countryFromServer = sessionStorage.getItem('detectedCountry');
        const rateFromServer = sessionStorage.getItem('exchangeRate');

        if (countryFromServer && rateFromServer) {
             const rate = parseFloat(rateFromServer);
             setExchangeRate(rate);
             if (countryFromServer === 'MG') {
                 setCurrencyInfo(currencies.MGA);
             } else {
                 setCurrencyInfo(currencies.EUR);
             }
             setIsLoading(false);
        } else {
            // Fallback for components where data isn't pre-loaded, e.g., checkout
            fetchCurrencyData();
        }

    }, []);

    const convertPrice = useCallback((priceInEur: number): number => {
        if (isLoading || !exchangeRate) {
            return priceInEur;
        }
        if (currencyInfo.code === 'MGA') {
            return priceInEur * exchangeRate;
        }
        return priceInEur;
    }, [currencyInfo.code, exchangeRate, isLoading]);

    const formatPrice = useCallback((priceInEur: number, options: { style?: 'decimal' | 'currency' } = {}): string => {
        const { style = 'currency' } = options;

        if (isLoading) {
            return '...';
        }
        
        const convertedPrice = convertPrice(priceInEur);

        if (style === 'decimal') {
             return new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(convertedPrice);
        }
        
        // For currency formatting
        const formatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currencyInfo.code,
            currencyDisplay: 'symbol',
            minimumFractionDigits: currencyInfo.code === 'MGA' ? 0 : 2,
            maximumFractionDigits: currencyInfo.code === 'MGA' ? 0 : 2,
        });
        
        // Manual override for Ariary symbol placement
        if (currencyInfo.code === 'MGA') {
            return `${formatter.format(convertedPrice).replace('Ar', '').trim()} Ar`;
        }
        
        return formatter.format(convertedPrice);

    }, [isLoading, convertPrice, currencyInfo]);


    return { currency: currencyInfo, formatPrice, convertPrice, isLoading };
}
