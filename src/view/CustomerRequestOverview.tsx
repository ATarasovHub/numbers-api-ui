import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import providerData from '../mocks/data/providers';
import provisioningTypesData from '../mocks/data/provisioningTypes';

const mockProvisioning = [
  {
    provider: '[AUS] Dialogue AU',
    bp: 'twilio',
    comment: '',
    requestedNumbers: 5,
    date: '2012-02-08',
  },
];

const mockProviders = [
  { id: 'twilio', name: 'Twilio' },
  { id: 'dialogue', name: '[AUS] Dialogue AU' },
];

const mockBps = [
  { id: 'twilio', name: 'twilio' },
  { id: 'bp2', name: 'bp2' },
];

const CustomerRequestOverview: React.FC = () => {
  // State for create form
  const [requestedNumbers, setRequestedNumbers] = useState('');
  const [provider, setProvider] = useState('');
  const [bp, setBp] = useState('');
  const [comment, setComment] = useState('');
  const [requestDate, setRequestDate] = useState('2025-07-14');

  // State for search form
  const [searchProvisioningType, setSearchProvisioningType] = useState('');
  const [searchProvider, setSearchProvider] = useState('');
  const [searchBp, setSearchBp] = useState('');

  // Provisioning table data
  const [provisioning, setProvisioning] = useState(mockProvisioning);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontSize: '1rem', color: '#888', mb: 1 }}>
        Administration &gt; Customer Request overview
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Create New Customer Request</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 170 }}>Requested Numbers</Typography>
            <TextField size="small" value={requestedNumbers} onChange={e => setRequestedNumbers(e.target.value)} sx={{ minWidth: 200 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 170 }}>Provider</Typography>
            <Select size="small" displayEmpty value={provider} onChange={e => setProvider(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value=""><em>click to select</em></MenuItem>
              {mockProviders.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 170 }}>BP</Typography>
            <Select size="small" displayEmpty value={bp} onChange={e => setBp(e.target.value)} sx={{ minWidth: 200 }}>
              <MenuItem value=""><em>start typing for select</em></MenuItem>
              {mockBps.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ minWidth: 170, mt: 1 }}>Comment</Typography>
            <TextField size="small" multiline minRows={4} value={comment} onChange={e => setComment(e.target.value)} sx={{ minWidth: 400 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 170 }}>Request Date</Typography>
            <TextField size="small" type="date" value={requestDate} onChange={e => setRequestDate(e.target.value)} sx={{ minWidth: 200 }} />
          </Box>
          <Box>
            <Button variant="contained">Create</Button>
          </Box>
        </Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>search</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography sx={{ minWidth: 170 }}>Provisioning Type</Typography>
          <Select size="small" displayEmpty value={searchProvisioningType} onChange={e => setSearchProvisioningType(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value=""><em>click to select</em></MenuItem>
            {provisioningTypesData.map((pt: any) => <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>)}
          </Select>
          <Typography sx={{ minWidth: 100 }}>Provider</Typography>
          <Select size="small" displayEmpty value={searchProvider} onChange={e => setSearchProvider(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value=""><em>click to select</em></MenuItem>
            {mockProviders.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
          <Typography sx={{ minWidth: 50 }}>BP</Typography>
          <Select size="small" displayEmpty value={searchBp} onChange={e => setSearchBp(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value=""><em>start typing for select</em></MenuItem>
            {mockBps.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
          </Select>
          <Button variant="contained" sx={{ ml: 2 }}>search</Button>
          <Button variant="outlined" color="error" sx={{ ml: 1 }}>delete with selected criteria</Button>
        </Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Provisioning</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell>BP</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Requested Numbers</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provisioning.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.provider}</TableCell>
                <TableCell>{row.bp}</TableCell>
                <TableCell>{row.comment}</TableCell>
                <TableCell>{row.requestedNumbers}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Button size="small" color="error">✗</Button>
                  <Button size="small">✎</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CustomerRequestOverview; 