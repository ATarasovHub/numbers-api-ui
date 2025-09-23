import React, { useState } from 'react';
import {
    Box,
    Typography,
    Alert,
    IconButton,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { CreateProviderFormProps, ProviderFormData, CountryStats } from './CreateProviderForm.types';
import { styles } from './CreateProviderForm.styles';

const CreateProviderForm: React.FC<CreateProviderFormProps> = ({ onProviderCreated }) => {
    const [formData, setFormData] = useState<ProviderFormData>({
        providerName: '',
        totalCountries: 0,
        totalNumbers: 0,
        totalAssignedNumbers: 0,
        totalMonthlyCost: 0,
        countryStats: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));

        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleCountryStatsChange = (index: number, field: keyof CountryStats, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            countryStats: prev.countryStats.map((stat, i) =>
                i === index ? { ...stat, [field]: value } : stat
            )
        }));
    };

    const addCountryStats = () => {
        setFormData(prev => ({
            ...prev,
            countryStats: [...prev.countryStats, {
                countryCode: '',
                countryName: '',
                totalNumbers: 0,
                assignedNumbers: 0,
                totalMonthlyCost: 0
            }]
        }));
    };

    const removeCountryStats = (index: number) => {
        setFormData(prev => ({
            ...prev,
            countryStats: prev.countryStats.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.providerName.trim()) {
            setError('Provider name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Sending provider creation request:', {
                endpoint: '/provider/createProvider',
                method: 'POST',
                body: formData
            });

            const response = await fetch('/provider/createProvider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.message || 'Failed to create provider');
            }

            const createdProvider = await response.json();
            console.log('Successfully created provider:', createdProvider);

            setSuccess(`Provider "${formData.providerName}" created successfully!`);
            setFormData({
                providerName: '',
                totalCountries: 0,
                totalNumbers: 0,
                totalAssignedNumbers: 0,
                totalMonthlyCost: 0,
                countryStats: []
            });

            if (onProviderCreated) {
                onProviderCreated(createdProvider);
            }
        } catch (err) {
            console.error('Error creating provider:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={styles.container}>
            <Typography sx={styles.title}>Create New Provider</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                {/* Basic Information */}
                <Box sx={styles.formSection}>
                    <Typography sx={styles.sectionTitle}>Basic Information</Typography>
                    <Box sx={styles.formGroup}>
                        <Typography component="label" sx={styles.label} htmlFor="providerName">
                            Provider Name *
                        </Typography>
                        <input
                            type="text"
                            id="providerName"
                            name="providerName"
                            value={formData.providerName}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            placeholder="Enter provider name"
                            maxLength={100}
                            style={{ ...styles.input as any }}
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Statistics */}
                <Box sx={styles.formSection}>
                    <Typography sx={styles.sectionTitle}>Statistics</Typography>
                    <Box sx={styles.formRow}>
                        <Box sx={styles.formGroup}>
                            <Typography component="label" sx={styles.label} htmlFor="totalCountries">
                                Total Countries
                            </Typography>
                            <input
                                type="number"
                                id="totalCountries"
                                name="totalCountries"
                                value={formData.totalCountries}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                style={{ ...styles.input as any }}
                            />
                        </Box>
                        <Box sx={styles.formGroup}>
                            <Typography component="label" sx={styles.label} htmlFor="totalNumbers">
                                Total Numbers
                            </Typography>
                            <input
                                type="number"
                                id="totalNumbers"
                                name="totalNumbers"
                                value={formData.totalNumbers}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                style={{ ...styles.input as any }}
                            />
                        </Box>
                    </Box>
                    <Box sx={styles.formRow}>
                        <Box sx={styles.formGroup}>
                            <Typography component="label" sx={styles.label} htmlFor="totalAssignedNumbers">
                                Total Assigned Numbers
                            </Typography>
                            <input
                                type="number"
                                id="totalAssignedNumbers"
                                name="totalAssignedNumbers"
                                value={formData.totalAssignedNumbers}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                style={{ ...styles.input as any }}
                            />
                        </Box>
                        <Box sx={styles.formGroup}>
                            <Typography component="label" sx={styles.label} htmlFor="totalMonthlyCost">
                                Total Monthly Cost ($)
                            </Typography>
                            <input
                                type="number"
                                id="totalMonthlyCost"
                                name="totalMonthlyCost"
                                value={formData.totalMonthlyCost}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                step="0.01"
                                style={{ ...styles.input as any }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <Box sx={styles.formSection}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography sx={styles.sectionTitle}>Country Statistics</Typography>
                        <button
                            type="button"
                            onClick={addCountryStats}
                            disabled={isSubmitting}
                            style={{ ...styles.addButton as any }}
                        >
                            <AddIcon fontSize="small" />
                            Add Country
                        </button>
                    </Box>

                    {formData.countryStats.map((countryStat, index) => (
                        <Accordion key={index} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>
                                    {countryStat.countryName || `Country ${index + 1}`}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={styles.countryStatsContainer}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle2">Country Details</Typography>
                                        <IconButton
                                            onClick={() => removeCountryStats(index)}
                                            disabled={isSubmitting}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={styles.formRow}>
                                        <Box sx={styles.formGroup}>
                                            <Typography component="label" sx={styles.label}>
                                                Country Code
                                            </Typography>
                                            <input
                                                type="text"
                                                value={countryStat.countryCode}
                                                onChange={(e) => handleCountryStatsChange(index, 'countryCode', e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder="e.g., US, DE, UK"
                                                maxLength={5}
                                                style={{ ...styles.input as any }}
                                            />
                                        </Box>
                                        <Box sx={styles.formGroup}>
                                            <Typography component="label" sx={styles.label}>
                                                Country Name
                                            </Typography>
                                            <input
                                                type="text"
                                                value={countryStat.countryName}
                                                onChange={(e) => handleCountryStatsChange(index, 'countryName', e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder="Country name"
                                                style={{ ...styles.input as any }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={styles.formRow}>
                                        <Box sx={styles.formGroup}>
                                            <Typography component="label" sx={styles.label}>
                                                Total Numbers
                                            </Typography>
                                            <input
                                                type="number"
                                                value={countryStat.totalNumbers}
                                                onChange={(e) => handleCountryStatsChange(index, 'totalNumbers', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                                style={{ ...styles.input as any }}
                                            />
                                        </Box>
                                        <Box sx={styles.formGroup}>
                                            <Typography component="label" sx={styles.label}>
                                                Assigned Numbers
                                            </Typography>
                                            <input
                                                type="number"
                                                value={countryStat.assignedNumbers}
                                                onChange={(e) => handleCountryStatsChange(index, 'assignedNumbers', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                                style={{ ...styles.input as any }}
                                            />
                                        </Box>
                                        <Box sx={styles.formGroup}>
                                            <Typography component="label" sx={styles.label}>
                                                Monthly Cost ($)
                                            </Typography>
                                            <input
                                                type="number"
                                                value={countryStat.totalMonthlyCost}
                                                onChange={(e) => handleCountryStatsChange(index, 'totalMonthlyCost', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                                style={{ ...styles.input as any }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ ...styles.submitButton as any }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Provider'}
                </button>
            </form>
        </Box>
    );
};

export default CreateProviderForm;