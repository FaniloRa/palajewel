
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

export function useCurrency(): UseCurrencyReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(currencies.EUR);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);

    useEffect(() => {
        // This effect runs only on the client side
        function determineCurrency() {
            try {
                // 1. Prioritize user's explicit choice from localStorage
                const userChoice = localStorage.getItem('userCurrency') as Currency | null;
                if (userChoice && currencies[userChoice]) {
                    setCurrencyInfo(currencies[userChoice]);
                    return; // Stop if we have a user choice
                }

                // 2. Fallback to automatic detection via sessionStorage (set by Header)
                const countryFromServer = sessionStorage.getItem('detectedCountry');
                if (countryFromServer === 'MG') {
                    setCurrencyInfo(currencies.MGA);
                    return;
                }
                
                // 3. Default to EUR
                setCurrencyInfo(currencies.EUR);

            } catch (error) {
                console.error("Failed to determine currency, defaulting to EUR.", error);
                setCurrencyInfo(currencies.EUR);
            }
        }
        
        const rateStr = sessionStorage.getItem('exchangeRate');
        if (rateStr) {
            setExchangeRate(parseFloat(rateStr));
        }

        determineCurrency();
        setIsLoading(false);

    }, []);

    const convertPrice = useCallback((priceInEur: number): number => {
        if (currencyInfo.code === 'MGA' && exchangeRate) {
            return priceInEur * exchangeRate;
        }
        return priceInEur;
    }, [currencyInfo.code, exchangeRate]);

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
        
        const formatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currencyInfo.code,
            currencyDisplay: 'symbol',
            minimumFractionDigits: currencyInfo.code === 'MGA' ? 0 : 2,
            maximumFractionDigits: currencyInfo.code === 'MGA' ? 0 : 2,
        });
        
        if (currencyInfo.code === 'MGA') {
            const formatted = formatter.format(convertedPrice);
            // Handle potential inconsistencies in symbol placement by browsers
            return `${formatted.replace(currencyInfo.symbol, '').trim()} ${currencyInfo.symbol}`;
        }
        
        return formatter.format(convertedPrice);

    }, [isLoading, convertPrice, currencyInfo]);


    return { currency: currencyInfo, formatPrice, convertPrice, isLoading };
}
