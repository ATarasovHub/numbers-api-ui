import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ProviderOverview } from "./view/pages/ProviderOverviewPage/ProviderOverviewPage";
import fakeApi from "./mocks/fakeApi/fakeApi";
import { CustomerOverviewPage } from "./view/pages/CustomerOverviewPage";
import { CustomerTable } from "./view/components/features/CustomerOverview/CustomerTable/CustomerTable";
import Header, { Page } from "./view/components/common/Header";
import ProviderAdminPage from "./view/pages/ProviderAdminPage";
import CustomerRequestOverview from "./view/pages/CustomerRequestOverview";
import RangeAssignmentPage from "./view/pages/RangeAssignmentPage";
import {calmTheme} from "./view/theme/customerTheme";

function App() {
    const [page, setPage] = useState<Page>('providers');

    const renderPage = () => {
        switch (page) {
            case 'providers':
                return <ProviderAdminPage />;
            case 'customers':
                return <CustomerOverviewPage />;
            case 'customer_request_overview':
                return <CustomerRequestOverview />;
            case 'range_assignment':
                return <RangeAssignmentPage />;
            case 'number_assignment':
            case 'number_reservation':
            case 'number_range_admin':
            case 'used_number_range_admin':
            case 'overview':
            case 'provider_overview':
                return <ProviderOverview />;
            case 'customer_overview':
                return <CustomerTable />;
            case 'provider_statistic':
            default:
                return <ProviderOverview />;
        }
    }

    return (
        <ThemeProvider theme={calmTheme}>
            <CssBaseline />
            <div className="App">
                <Header page={page} setPage={setPage} />
                {renderPage()}
            </div>
        </ThemeProvider>
    );
}

if (process.env.NODE_ENV === "development") {
    fakeApi();
}

export default App;