import React from 'react';
import { Card, Paper, ThemeProvider, Box, Typography } from '@mui/material';
import { useProviders } from '../../components/features/ProviderOverview/ProviderTableOverview/ProviderTable/useProviders';
import ProviderFilters from '../../components/features/ProviderOverview/ProviderTableOverview/ProviderFilters/ProviderFilters';
import ProviderTable from '../../components/features/ProviderOverview/ProviderTableOverview/ProviderTable/ProviderTable';
import { calmTheme } from '../../theme/providerTheme';
import { providerOverviewPageStyles } from './ProviderOverviewPage.styles';

export const ProviderOverview: React.FC = () => {
    const { providers, filters, loading, handleFilterChange } = useProviders();

    return (
        <ThemeProvider theme={calmTheme}>
            <Card sx={providerOverviewPageStyles.card}>
                <Box sx={providerOverviewPageStyles.headerBox}>
                    <Typography variant="h4" component="h1" sx={providerOverviewPageStyles.headerTitle}>
                        Provider Overview
                    </Typography>
                </Box>

                <Paper elevation={3} sx={providerOverviewPageStyles.filtersPaper}>
                    <ProviderFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </Paper>

                <Paper elevation={4} sx={providerOverviewPageStyles.tablePaper}>
                    <ProviderTable providers={providers} loading={loading} />
                </Paper>
            </Card>
        </ThemeProvider>
    );
};

export default ProviderOverview;