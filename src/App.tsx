import React, { useState } from 'react';
import { ProviderOverview } from "./view/pages/ProviderOverview";
import fakeApi from "./mocks/fakeApi/fakeApi";
import { CustomerTable } from "./view/pages/CustomerTable/CustomerTable";
import Header, { Page } from "./view/components/Header";
import ProviderAdminPage from "./view/pages/ProviderAdminPage";
import CustomerRequestOverview from "./view/pages/CustomerRequestOverview";
import {RangeAssignment} from "./view/pages/RangeAssignment";

function App() {
    const [page, setPage] = useState<Page>('providers');

    const renderPage = () => {
        switch (page) {
            case 'providers':
                return <ProviderAdminPage />;
            case 'customers':
                return <CustomerRequestOverview />;
            case 'customer_request_overview':
                return <CustomerRequestOverview />;
            case 'range_assignment':
                return <RangeAssignment />;
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
        <div className="App">
            <Header page={page} setPage={setPage} />
            {renderPage()}
        </div>
    );
}

if (process.env.NODE_ENV === "development") {
    fakeApi();
}

export default App;