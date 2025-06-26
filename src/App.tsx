import React, { useState } from 'react';
import {ProviderTable} from "./view/ProviderTable";
import fakeApi from "./mocks/fakeApi/fakeApi";
import {CustomerTable} from "./view/CustomerTable";
import Header from "./view/components/Header";


function App() {
    const [page, setPage] = useState<'customers' | 'providers'>('providers');

    return (
        <div className="App">
            <Header page={page} setPage={setPage} />
            {page === 'providers' && <ProviderTable />}
            {page === 'customers' && <CustomerTable />}
        </div>
    );
}

if (process.env.NODE_ENV === "development") {
    fakeApi()
}

export default App;
