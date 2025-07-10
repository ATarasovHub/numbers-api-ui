const providerDetails = {
    '1': {
        providerName: 'Provider One',
        stockLimitWarning: 100,
        thresholdLimitWarning: 10,
        provisioningTypeId: 'prov1',
        countryId: 'c1',
        connectionTypeId: 'conn1',
        countryStats: [
            { countryId: 'c1', countryCode: '+1', countryName: 'USA', totalNumbers: 500 },
        ],
    },
    '2': {
        providerName: 'Provider Two',
        stockLimitWarning: 200,
        thresholdLimitWarning: 20,
        provisioningTypeId: 'prov2',
        countryId: 'c2',
        connectionTypeId: 'conn2',
        countryStats: [
            { countryId: 'c2', countryCode: '+49', countryName: 'Germany', totalNumbers: 300 },
        ],
    },
};

export default providerDetails; 