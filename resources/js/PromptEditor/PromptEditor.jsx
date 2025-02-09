import React from 'react'

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import App from "./App";

console.log('foooo PromptEditor')

function PromptEditor({wire, ...props}) {

    const editor = useCreateBlockNote();

    return (
        <div>
            <div>
                {/*<BlockNoteView editor={editor}/>*/}
            </div>
            FOo bas

            <div>
                <App/>
            </div>
        </div>
    )
}

export default PromptEditor
