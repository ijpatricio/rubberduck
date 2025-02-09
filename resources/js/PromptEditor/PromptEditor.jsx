import React, { createContext } from 'react'
export const WireContext = createContext(null);

import App from "./App";

function PromptEditor({wire, mingleData}) {

    return (
        <WireContext.Provider value={{wire, mingleData}}>
            <App />
        </WireContext.Provider>
    )
}

export default PromptEditor
