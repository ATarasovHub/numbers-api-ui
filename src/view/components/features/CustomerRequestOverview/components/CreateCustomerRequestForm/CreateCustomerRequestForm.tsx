import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import FormField from '../EditCountryStatsForm/FormField/FormField';
import { useCreateCustomerRequest } from '../../hooks/useCreateCustomerRequest';
import { CreateCustomerRequestFormProps } from './CreateCustomerRequestForm.types';
import { createCustomerRequestFormStyles } from './CreateCustomerRequestForm.styles';

const CreateCustomerRequestForm: React.FC<CreateCustomerRequestFormProps> = ({ providers, bps }) => {
    const { formData, isSubmitting, handleInputChange, resetForm, handleSubmit } = useCreateCustomerRequest();

    const providerOptions = providers.map(p => ({ value: p.providerId, label: p.providerName }));
    const bpOptions = bps.map(b => ({ value: b.id, label: b.name }));

    const handleCreate = async () => {
        try {
            const payload = {
                requestedNumbers: Number(formData.requestedNumbers),
                providerId: formData.provider,
                bp: formData.bp,
                comment: formData.comment,
                requestDate: formData.requestDate,
            };

            const data = await handleSubmit(payload);
            alert('Customer request created!\n' + JSON.stringify(data, null, 2));
            resetForm();
        } catch (error: any) {
            alert('Error: ' + (error.message || error));
        }
    };

    return (
        <Paper variant="outlined" sx={createCustomerRequestFormStyles.paper}>
            <Typography variant="subtitle1" sx={createCustomerRequestFormStyles.title}>
                Create New Customer Request
            </Typography>
            <Box sx={createCustomerRequestFormStyles.formContainer}>
                <FormField
                    label="Requested Numbers"
                    value={formData.requestedNumbers}
                    onChange={value => handleInputChange('requestedNumbers', value)}
                />
                <FormField
                    label="Provider"
                    type="select"
                    value={formData.provider}
                    onChange={value => handleInputChange('provider', value)}
                    options={providerOptions}
                    placeholder="click to select"
                />
                <FormField
                    label="BP"
                    type="select"
                    value={formData.bp}
                    onChange={value => handleInputChange('bp', value)}
                    options={bpOptions}
                    placeholder="start typing for select"
                />
                <FormField
                    label="Comment"
                    type="textarea"
                    value={formData.comment}
                    onChange={value => handleInputChange('comment', value)}
                    minRows={4}
                    multiline
                />
                <FormField
                    label="Request Date"
                    type="date"
                    value={formData.requestDate}
                    onChange={value => handleInputChange('requestDate', value)}
                />
                <Box sx={createCustomerRequestFormStyles.buttonContainer}>
                    <Button variant="contained" onClick={handleCreate} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default CreateCustomerRequestForm;