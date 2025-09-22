import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CreateCustomerRequestForm from '../components/features/CustomerRequestOverview/CreateCustomerRequestForm/CreateCustomerRequestForm';
import SearchCustomerRequestForm from '../components/features/CustomerRequestOverview/SearchCustomerRequestForm/SearchCustomerRequestForm';
import ProvisioningTable from '../components/features/CustomerRequestOverview/ProvisioningTable/ProvisioningTable';
import { ProviderService } from '../lib/api/providerService';
import { customerRequestApi } from '../lib/api/CustomerRequestApi/customerRequestApi';

const mockBps = [
  { id: 'twilio', name: 'twilio' },
  { id: 'bp2', name: 'bp2' },
];

const mockProvisioning = [
  {
    provider: '[AUS] Dialogue AU',
    bp: 'twilio',
    comment: '',
    requestedNumbers: 5,
    date: '2012-02-08',
  },
];

const CustomerRequestOverviewPage: React.FC = () => {
  const [provisioning, setProvisioning] = useState(mockProvisioning);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await ProviderService.fetchProviders();
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      }
    };

    fetchProviders();
  }, []);

  const handleSearch = async (params: { provider: string, bp: string }) => {
    try {
      const searchParams: Record<string, string> = {};
      if (params.provider) searchParams.providerId = params.provider;
      if (params.bp) searchParams.bp = params.bp;

      const data = await customerRequestApi.getCustomerRequests(searchParams);

      const formattedData = data.map((r: any) => ({
        provider: providers.find(p => String(p.providerId) === String(r.providerId))?.providerName || r.providerId,
        bp: r.bp,
        comment: r.comment,
        requestedNumbers: r.requestedNumbers,
        date: r.requestDate,
      }));

      setProvisioning(formattedData);
    } catch (error) {
      console.error('Failed to search customer requests:', error);
      setProvisioning([]);
    }
  };

  return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: '#888', mb: 1 }}>
          Administration &gt; Customer Request overview
        </Typography>


        <CreateCustomerRequestForm providers={providers} bps={mockBps} />

        <SearchCustomerRequestForm providers={providers} onSearch={handleSearch} />

        <ProvisioningTable provisioning={provisioning} />
      </Box>
  );
};

export default CustomerRequestOverviewPage;