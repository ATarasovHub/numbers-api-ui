import { useState, useEffect } from 'react';
import { CountryStats } from '../../../../../utils/domain';
import { EditCountryStatsFormData, Range } from './EditCountryStatsForm.types';

export const useEditCountryStats = (countryStat: CountryStats | null) => {
    const [editData, setEditData] = useState<EditCountryStatsFormData>({});
    const [isSaving, setIsSaving] = useState(false);

    const [fromNumber, setFromNumber] = useState('');
    const [toNumber, setToNumber] = useState('');
    const [size, setSize] = useState(0);
    const [numberType, setNumberType] = useState('');
    const [serviceSms, setServiceSms] = useState(false);
    const [serviceVoice, setServiceVoice] = useState(false);
    const [ranges, setRanges] = useState<Range[]>([]);

    useEffect(() => {
        if (countryStat) {
            setEditData({
                countryName: countryStat.countryName,
                countryCode: countryStat.countryCode,
                totalNumbers: countryStat.totalNumbers,
                assignedNumbers: countryStat.assignedNumbers,
                totalMonthlyCost: countryStat.totalMonthlyCost,
            });
        }
    }, [countryStat]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleAddRange = () => {
        if (fromNumber && toNumber) {
            setRanges(prev => [
                ...prev,
                {
                    fromNumber,
                    toNumber,
                    size,
                    numberType,
                    serviceSms,
                    serviceVoice
                }
            ]);

            setFromNumber('');
            setToNumber('');
            setSize(0);
            setNumberType('');
            setServiceSms(false);
            setServiceVoice(false);
        }
    };

    const handleSave = (onSave: (updatedStat: CountryStats) => void, countryStat: CountryStats | null) => {
        if (!countryStat) return;

        setIsSaving(true);
        try {
            onSave({ ...countryStat, ...editData } as CountryStats);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        editData,
        isSaving,
        fromNumber,
        toNumber,
        size,
        numberType,
        serviceSms,
        serviceVoice,
        ranges,
        setFromNumber,
        setToNumber,
        setSize,
        setNumberType,
        setServiceSms,
        setServiceVoice,
        handleEditChange,
        handleAddRange,
        handleSave
    };
};