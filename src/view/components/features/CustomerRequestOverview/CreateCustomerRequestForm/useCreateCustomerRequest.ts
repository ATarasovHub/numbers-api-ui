import { useState } from 'react';
import { customerRequestApi } from '../../../../lib/api/customerRequestApi';
import { CustomerRequestPayload } from './CreateCustomerRequestForm.types';

export const useCreateCustomerRequest = () => {
    const [formData, setFormData] = useState({
        requestedNumbers: '',
        provider: '',
        bp: '',
        comment: '',
        requestDate: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            requestedNumbers: '',
            provider: '',
            bp: '',
            comment: '',
            requestDate: new Date().toISOString().split('T')[0]
        });
    };

    const handleSubmit = async (payload: CustomerRequestPayload) => {
        setIsSubmitting(true);
        try {
            const data = await customerRequestApi.createCustomerRequest(payload);
            return data;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        handleInputChange,
        resetForm,
        handleSubmit
    };
};
