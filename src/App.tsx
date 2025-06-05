import React from 'react';
import {ProviderTable} from "./view/ProviderTable";
import fakeApi from "./mocks/fakeApi/fakeApi";


function App() {
    return (
        <div className="App">
            <ProviderTable/>
        </div>
    );
}

if (process.env.NODE_ENV === "development") {
    fakeApi()
}

export default App;
