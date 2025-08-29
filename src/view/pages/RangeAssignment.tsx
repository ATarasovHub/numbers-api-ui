import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styles } from './RangeAssignment/styles';
import { useRangeAssignmentApi } from './RangeAssignment/useRangeAssignmentApi';
import { useExcelExport } from './RangeAssignment/useExcelExport';
import FilterManager from './RangeAssignment/FilterManager';
import RangeTable from './RangeAssignment/RangeTable';
import ExportDialog from './RangeAssignment/ExportDialog';

export function RangeAssignment() {
    const {
        filter, country, tableData, loading, hasMore, isInitialSearch,
        customerOptions, techAccountOptions, customerLoading, techAccountLoading,
        customerPage, techAccountPage,
        handleFilterChange, setCountry, handleSearch, searchNumbers,
        fetchCustomerOptions, fetchTechAccountOptions,
        loadMoreCustomers, loadMoreTechAccounts,
        setCurrentCustomerSearch, setCurrentTechAccountSearch,
        loadAllDataForPrint
    } = useRangeAssignmentApi();

    const { generateExcel } = useExcelExport();

    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);
    const [printProgress, setPrintProgress] = useState(0);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (!loading && hasMore && !isInitialSearch) {
                searchNumbers(false);
            }
        }
    }, [loading, hasMore, isInitialSearch, searchNumbers]);

    const handleExport = async () => {
        setPrintDialogOpen(true);
        setPrintLoading(true);
        setPrintProgress(0);

        const progressInterval = setInterval(() => {
            setPrintProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const data = await loadAllDataForPrint();

        clearInterval(progressInterval);

        if (data) {
            setPrintProgress(100);
            setTimeout(() => {
                generateExcel(data, country);
                setPrintDialogOpen(false);
                setPrintLoading(false);
            }, 500);
        } else {
            alert('Failed to load data for export.');
            setPrintDialogOpen(false);
            setPrintLoading(false);
        }
    };

    const handleDebugExport = () => {
        console.log({
            tableData,
            filter,
            country
        });
        alert('Debug data logged to console.');
    }

    return (
        <Paper sx={styles.mainContainer}>
            <Typography variant="h5" sx={styles.title}>Range Assignment</Typography>
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
                onDebugExport={handleDebugExport}
                fetchCustomerOptions={fetchCustomerOptions}
                fetchTechAccountOptions={fetchTechAccountOptions}
                loadMoreCustomers={loadMoreCustomers}
                loadMoreTechAccounts={loadMoreTechAccounts}
                customerPage={customerPage}
                techAccountPage={techAccountPage}
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
                open={printDialogOpen}
                loading={printLoading}
                progress={printProgress}
                onClose={() => setPrintDialogOpen(false)}
            />
        </Paper>
    );
}