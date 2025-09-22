import { useState, useEffect } from 'react';
import { PhoneNumberData } from '../../../../../types/providerTypes';

export const usePhoneNumbers = (phoneNumbers: PhoneNumberData[], searchQuery: string) => {
    const [displayedPhoneNumbersCount, setDisplayedPhoneNumbersCount] = useState<number>(0);
    const ITEMS_PER_LOAD = 20;

    useEffect(() => {
        setDisplayedPhoneNumbersCount(Math.min(ITEMS_PER_LOAD, phoneNumbers.length));
    }, [phoneNumbers]);

    const loadMorePhoneNumbers = () => {
        setDisplayedPhoneNumbersCount(prev => Math.min(prev + ITEMS_PER_LOAD, phoneNumbers.length));
    };

    const filteredNumbers = searchQuery.trim() === ''
        ? phoneNumbers
        : phoneNumbers.filter(phone =>
            phone.number.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const displayedNumbers = filteredNumbers.slice(0, displayedPhoneNumbersCount);
    const hasMore = displayedPhoneNumbersCount < filteredNumbers.length;

    return {
        displayedNumbers,
        hasMore,
        loadMorePhoneNumbers,
        filteredNumbers
    };
};