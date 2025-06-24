import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
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

const Container = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: theme.shadows[4],
}));

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: '2rem',
    fontSize: '1.8rem',
    fontWeight: 600,
    textAlign: 'center',
}));

const Form = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
});

const FormSection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

const FormRow = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
});

const FormGroup = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

const Label = styled('label')(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
}));

const Input = styled('input')(({ theme }) => ({
    padding: '0.75rem',
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,

    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
    },

    '&:disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        cursor: 'not-allowed',
    },
}));

const CountryStatsContainer = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: theme.palette.background.default,
    marginBottom: '1rem',
}));

const CountryStatsRow = styled(Box)({
    display: 'flex',
    alignItems: 'end',
    gap: '1rem',
    marginBottom: '0.5rem',
});

const AddButton = styled('button')(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease',

    '&:hover:not(:disabled)': {
        backgroundColor: theme.palette.secondary.dark,
    },

    '&:disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        cursor: 'not-allowed',
    },
}));

const SubmitButton = styled('button')(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',

    '&:hover:not(:disabled)': {
        backgroundColor: theme.palette.primary.dark,
    },

    '&:disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        cursor: 'not-allowed',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
}));

interface CountryStats {
    countryCode: string;
    countryName: string;
    totalNumbers: number;
    assignedNumbers: number;
    monthlyCost: number;
}

interface ProviderFormData {
    providerName: string;
    totalCountries: number;
    totalNumbers: number;
    totalAssignedNumbers: number;
    totalMonthlyCost: number;
    countryStats: CountryStats[];
}

interface CreateProviderFormProps {
    onProviderCreated?: (provider: any) => void;
}

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
                monthlyCost: 0
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
        <Container>
            <Title>Create New Provider</Title>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <FormSection>
                    <SectionTitle>Basic Information</SectionTitle>
                    <FormGroup>
                        <Label htmlFor="providerName">Provider Name *</Label>
                        <Input
                            type="text"
                            id="providerName"
                            name="providerName"
                            value={formData.providerName}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            placeholder="Enter provider name"
                            maxLength={100}
                        />
                    </FormGroup>
                </FormSection>

                <Divider />

                {/* Statistics */}
                <FormSection>
                    <SectionTitle>Statistics</SectionTitle>
                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="totalCountries">Total Countries</Label>
                            <Input
                                type="number"
                                id="totalCountries"
                                name="totalCountries"
                                value={formData.totalCountries}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="totalNumbers">Total Numbers</Label>
                            <Input
                                type="number"
                                id="totalNumbers"
                                name="totalNumbers"
                                value={formData.totalNumbers}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                            />
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="totalAssignedNumbers">Total Assigned Numbers</Label>
                            <Input
                                type="number"
                                id="totalAssignedNumbers"
                                name="totalAssignedNumbers"
                                value={formData.totalAssignedNumbers}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="totalMonthlyCost">Total Monthly Cost ($)</Label>
                            <Input
                                type="number"
                                id="totalMonthlyCost"
                                name="totalMonthlyCost"
                                value={formData.totalMonthlyCost}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                step="0.01"
                            />
                        </FormGroup>
                    </FormRow>
                </FormSection>

                <Divider />

                {/* Country Statistics */}
                <FormSection>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <SectionTitle>Country Statistics</SectionTitle>
                        <AddButton type="button" onClick={addCountryStats} disabled={isSubmitting}>
                            <AddIcon fontSize="small" />
                            Add Country
                        </AddButton>
                    </Box>

                    {formData.countryStats.map((countryStat, index) => (
                        <Accordion key={index} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>
                                    {countryStat.countryName || `Country ${index + 1}`}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CountryStatsContainer>
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

                                    <FormRow>
                                        <FormGroup>
                                            <Label>Country Code</Label>
                                            <Input
                                                type="text"
                                                value={countryStat.countryCode}
                                                onChange={(e) => handleCountryStatsChange(index, 'countryCode', e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder="e.g., US, DE, UK"
                                                maxLength={5}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Country Name</Label>
                                            <Input
                                                type="text"
                                                value={countryStat.countryName}
                                                onChange={(e) => handleCountryStatsChange(index, 'countryName', e.target.value)}
                                                disabled={isSubmitting}
                                                placeholder="Country name"
                                            />
                                        </FormGroup>
                                    </FormRow>

                                    <FormRow>
                                        <FormGroup>
                                            <Label>Total Numbers</Label>
                                            <Input
                                                type="number"
                                                value={countryStat.totalNumbers}
                                                onChange={(e) => handleCountryStatsChange(index, 'totalNumbers', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Assigned Numbers</Label>
                                            <Input
                                                type="number"
                                                value={countryStat.assignedNumbers}
                                                onChange={(e) => handleCountryStatsChange(index, 'assignedNumbers', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Monthly Cost ($)</Label>
                                            <Input
                                                type="number"
                                                value={countryStat.monthlyCost}
                                                onChange={(e) => handleCountryStatsChange(index, 'monthlyCost', Number(e.target.value))}
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                            />
                                        </FormGroup>
                                    </FormRow>
                                </CountryStatsContainer>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </FormSection>

                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Provider'}
                </SubmitButton>
            </Form>
        </Container>
    );
};

export default CreateProviderForm;
