import React, { useState } from 'react';
import { ProviderTable } from "./view/ProviderTable";
import fakeApi from "./mocks/fakeApi/fakeApi";
import { CustomerTable } from "./view/CustomerTable";
import Header, { Page } from "./view/components/Header";
import ProviderAdminPage from "./view/ProviderAdminPage";
import CustomerRequestOverview from "./view/CustomerRequestOverview";

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
            case 'number_assignment':
            case 'number_reservation':
            case 'number_range_admin':
            case 'used_number_range_admin':
            case 'overview':
                return <CustomerTable />;
            case 'provider_statistic':
            case 'history_account':
            case 'history_numberassignment':
            case 'info':
                return <div>Page: {page}</div>;
            default:
                return <ProviderTable />;
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
