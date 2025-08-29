import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import CreateCustomerRequestForm from '../components/CreateCustomerRequestForm';
import SearchCustomerRequestForm from '../components/SearchCustomerRequestForm';
import ProvisioningTable from '../components/ProvisioningTable';

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

const CustomerRequestOverview: React.FC = () => {
  const [provisioning, setProvisioning] = useState(mockProvisioning);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/provider')
        .then(res => res.json())
        .then(data => setProviders(data));
  }, []);

  const handleSearch = async (params: { provider: string, bp: string }) => {
    const searchParams = new URLSearchParams();
    if (params.provider) searchParams.append('providerId', params.provider);
    if (params.bp) searchParams.append('bp', params.bp);

    const res = await fetch('/customer-request?' + searchParams.toString());
    if (res.ok) {
      const data = await res.json();
      setProvisioning((data as any[]).map((r: any) => ({
        provider: providers.find(p => String(p.providerId) === String(r.providerId))?.providerName || r.providerId,
        bp: r.bp,
        comment: r.comment,
        requestedNumbers: r.requestedNumbers,
        date: r.requestDate,
      })));
    } else {
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

export default CustomerRequestOverview; 