import { useMemo } from 'react';
import { tokenize, normalizeNumber, isValidE164 } from '../../../../../utils/numberUtils';

interface ParsedResult {
    total: number;
    normalized: string[];
    valid: string[];
    invalidFormat: string[];
    duplicatesInRequest: string[];
    toSend: string[];
}

export const useParsedNumbers = (numbersText: string, postValidOnly: boolean): ParsedResult => {
    return useMemo(() => {
        const raw = tokenize(numbersText);
        const normalized = raw.map(normalizeNumber).filter(Boolean);
        const seen = new Set<string>();
        const valid: string[] = [];
        const invalidFormat: string[] = [];
        const duplicatesInRequest: string[] = [];

        normalized.forEach(n => {
            if (!seen.has(n)) {
                seen.add(n);
                if (isValidE164(n)) valid.push(n);
                else invalidFormat.push(n);
            } else {
                duplicatesInRequest.push(n);
            }
        });

        const uniqueDuplicates = Array.from(new Set(duplicatesInRequest));
        const uniqueInvalid = Array.from(new Set(invalidFormat));

        return {
            total: raw.length,
            normalized,
            valid,
            invalidFormat: uniqueInvalid,
            duplicatesInRequest: uniqueDuplicates,
            toSend: postValidOnly ? valid : normalized
        };
    }, [numbersText, postValidOnly]);
};