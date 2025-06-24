import React, {useState} from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Alert } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
    maxWidth: '600px',
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

const ErrorMessage = styled(Alert)(({ theme }) => ({
    marginBottom: '1rem',
}));

const SuccessMessage = styled(Alert)(({ theme }) => ({
    marginBottom: '1rem',
}));

interface CreateProviderFormProps {
    onProviderCreated?: (provider: any) => void;
}

interface ProviderFormData {
    numberProviderName: string;
}

const CreateProviderForm: React.FC<CreateProviderFormProps> = ({ onProviderCreated }) => {
    const [formData, setFormData] = useState<ProviderFormData>({
        numberProviderName: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.numberProviderName.trim()) {
            setError('Provider name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/provider/createProvider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create provider');
            }

            const createdProvider = await response.json();

            setSuccess(`Provider "${formData.numberProviderName}" created successfully!`);
            setFormData({ numberProviderName: '' });

            if (onProviderCreated) {
                onProviderCreated(createdProvider);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Container>
            <Title>Create New Provider</Title>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="numberProviderName">Provider Name *</Label>
                    <Input
                        type="text"
                        id="numberProviderName"
                        name="numberProviderName"
                        value={formData.numberProviderName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Enter provider name"
                        maxLength={100}
                    />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Provider'}
                </SubmitButton>
            </Form>
        </Container>
    );
};

export default CreateProviderForm;
