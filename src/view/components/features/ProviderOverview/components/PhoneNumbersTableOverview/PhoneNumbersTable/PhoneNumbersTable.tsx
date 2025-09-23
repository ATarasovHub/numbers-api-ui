import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhoneNumberData } from '../../../../../../types/providerTypes';
import { usePhoneNumbers } from '../../../hooks/usePhoneNumbers';
import PhoneNumbersSearch from '../PhoneNumbersSearch/PhoneNumbersSearch';
import PhoneNumbersHeader from '../PhoneNumbersHeader/PhoneNumbersHeader';
import PhoneNumbersRow from '../PhoneNumbersRow/PhoneNumbersRow';
import PhoneNumbersLoading from '../PhoneNumbersLoading/PhoneNumbersLoading';
import { phoneNumbersTableStyles } from './PhoneNumbersTable.styles';

interface PhoneNumbersTableProps {
    countryId: string;
    phoneNumbers: PhoneNumberData[];
    loading: boolean;
}

const PhoneNumbersTable: React.FC<PhoneNumbersTableProps> = ({ countryId, phoneNumbers, loading }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { displayedNumbers, hasMore, loadMorePhoneNumbers } = usePhoneNumbers(phoneNumbers, searchQuery);

    if (loading) {
        return <PhoneNumbersLoading />;
    }

    return (
        <Paper elevation={1} sx={phoneNumbersTableStyles.paper}>
            <PhoneNumbersSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <Box sx={phoneNumbersTableStyles.tableHeaderBox}>
                <Table size="small" sx={phoneNumbersTableStyles.table}>
                    <PhoneNumbersHeader />
                </Table>
            </Box>
            <Box id={`scrollable-phone-numbers-${countryId}`} sx={phoneNumbersTableStyles.scrollBox}>
                <InfiniteScroll
                    dataLength={displayedNumbers.length}
                    next={loadMorePhoneNumbers}
                    hasMore={hasMore}
                    loader={<Box display="flex" justifyContent="center" my={1}><CircularProgress size={20} /></Box>}
                    scrollableTarget={`scrollable-phone-numbers-${countryId}`}
                    style={{ overflow: 'hidden' }}
                >
                    <Table size="small" sx={phoneNumbersTableStyles.table}>
                        <TableBody>
                            {displayedNumbers.map((phone, idx) => (
                                <PhoneNumbersRow key={idx} phone={phone} />
                            ))}
                        </TableBody>
                    </Table>
                </InfiniteScroll>
            </Box>
        </Paper>
    );
};

export default PhoneNumbersTable;