import React, { useState, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { useRangeAssignment } from '../hooks/useRangeAssignment';
import { useExcelExport } from '../hooks/useExcelExport';
import ExportDialog from '../components/ExportDialog/ExportDialog';
import FilterManager from '../components/FilterManager/FilterManager';
import RangeTable from '../components/RangeTable/RangeTable';

const RangeAssignmentPage: React.FC = () => {
    const {
        filter, country, tableData, loading, hasMore, isInitialSearch,
        customerOptions, techAccountOptions, customerLoading, techAccountLoading,
        handleFilterChange, setCountry, handleSearch, searchNumbers,
        fetchCustomerOptions, fetchTechAccountOptions,
        loadMoreCustomers, loadMoreTechAccounts,
        setCurrentCustomerSearch, setCurrentTechAccountSearch,
        loadAllDataForPrint
    } = useRangeAssignment();

    const { generateExcel } = useExcelExport();

    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.2 && !loading && hasMore) {
            searchNumbers(false);
        }
    }, [loading, hasMore, searchNumbers]);

    const handleExport = async () => {
        setExportDialogOpen(true);
        setExportProgress(0);

        try {
            setExportProgress(25);
            const allData = await loadAllDataForPrint();

            if (allData && allData.length > 0) {
                setExportProgress(50);
                // Генерируем Excel
                generateExcel(allData, country);
                setExportProgress(100);
                setTimeout(() => setExportDialogOpen(false), 1000);
            } else {
                setExportDialogOpen(false);
                alert('No data available to export');
            }
        } catch (error) {
            console.error('Export error:', error);
            setExportDialogOpen(false);
            alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <Box sx={{
            p: 3,
            maxWidth: 1400,
            m: '20px auto',
        }}>
            <Typography variant="h4" sx={{
                mb: 3,
                fontWeight: 600,
                color: 'primary.main',
            }}>
                Range Assignment
            </Typography>

            <FilterManager
                filter={filter}
                country={country}
                loading={loading}
                isInitialSearch={isInitialSearch}
                customerOptions={customerOptions}
                techAccountOptions={techAccountOptions}
                customerLoading={customerLoading}
                techAccountLoading={techAccountLoading}
                onFilterChange={handleFilterChange}
                onCountryChange={setCountry}
                onSearch={handleSearch}
                onExport={handleExport}
                fetchCustomerOptions={fetchCustomerOptions}
                fetchTechAccountOptions={fetchTechAccountOptions}
                loadMoreCustomers={loadMoreCustomers}
                loadMoreTechAccounts={loadMoreTechAccounts}
                setCurrentCustomerSearch={setCurrentCustomerSearch}
                setCurrentTechAccountSearch={setCurrentTechAccountSearch}
            />

            <RangeTable
                tableData={tableData}
                loading={loading}
                isInitialSearch={isInitialSearch}
                hasMore={hasMore}
                onScroll={handleScroll}
            />

            <ExportDialog
                open={exportDialogOpen}
                loading={exportProgress < 100}
                progress={exportProgress}
                onClose={() => setExportDialogOpen(false)}
            />
        </Box>
    );
};

export default RangeAssignmentPage;