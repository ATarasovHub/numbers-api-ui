import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { NumberOverview } from '../../../../types/rangeAssignmentTypes';

const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

export const useExcelExport = () => {
    const generateExcel = useCallback((dataToExport: NumberOverview[], country: string) => {
        try {
            if (dataToExport.length === 0) {
                alert('No data available to generate Excel');
                return;
            }

            const workbook = XLSX.utils.book_new();
            const headers = ['Number', 'Start Date', 'End Date', 'Customer Name', 'Tech Account', 'Account Status', 'Service Detail', 'Comment', 'Assignment Status'];
            const data = dataToExport.map(row => [
                row.number,
                formatDate(row.startDate),
                formatDate(row.endDate),
                row.customerName,
                row.techAccountName,
                row.techAccountStatus,
                row.serviceDetail,
                row.comment || '',
                row.assignmentStatus || ''
            ]);
            const worksheetData = [headers, ...data];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            worksheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 25 }, { wch: 18 }];

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Range Assignment');

            const summaryData = [
                ['Range Assignment Report'],
                ['Generated:', new Date().toLocaleString()],
                ['Total Records:', dataToExport.length.toString()],
                ['Country:', country || 'All Countries'],
            ];
            const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
            summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }];
            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

            XLSX.writeFile(workbook, `range_assignment_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error generating Excel:', error);
            alert('Failed to generate Excel: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, []);

    return { generateExcel };
};