
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

export function useCurrency(country: string | null, exchangeRate: number | null): UseCurrencyReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(currencies.EUR);

    useEffect(() => {
        // Default to EUR if anything is missing
        if (country === 'MG' && exchangeRate) {
            setCurrencyInfo(currencies.MGA);
        } else {
            setCurrencyInfo(currencies.EUR);
        }
        setIsLoading(false);
    }, [country, exchangeRate]);

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
