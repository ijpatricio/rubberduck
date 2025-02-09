import React from 'react'

import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import App from "./App";

function PromptEditor({wire, mingleData}) {

    return (
        <App wire={wire} />
    )
}

export default PromptEditor
