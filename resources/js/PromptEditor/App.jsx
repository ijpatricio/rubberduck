import React from 'react'
import { MantineProvider, Button } from '@mantine/core'
import { FormattingToolbar } from '@blocknote/react'

import {
    BlockNoteSchema,
    defaultBlockSpecs,
    filterSuggestionItems,
    insertOrUpdateBlock,
} from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import {
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
    useCreateBlockNote,
} from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"

import { RiAlertFill } from "react-icons/ri"
import { Alert } from "./Alert"

import "@blocknote/mantine/style.css"
import "./static-toolbar.css"

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
    blockSpecs: {
        // Adds all default blocks.
        ...defaultBlockSpecs,
        // Adds the Alert block.
        alert: Alert,
    },
})

// Slash menu item to insert an Alert block
const insertAlert = (editor) => ({
    title: "Alert",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "alert",
        })
    },
    aliases: [
        "alert",
        "notification",
        "emphasize",
        "warning",
        "error",
        "info",
        "success",
    ],
    group: "Other",
    icon: <RiAlertFill />,
})


export default function App(wire) {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        schema,
        initialContent: [
            {
                "id": "8cb32792-ef54-47a2-b86d-697c2bd02e25",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "Welcome to this demo!",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "4532dfe9-5c50-4886-a9f8-8b57589d1501",
                "type": "alert",
                "props": {
                    "textColor": "default",
                    "textAlignment": "left",
                    "type": "warning"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "This is an example alert",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "0581392c-3be9-44ea-9d6f-602203e6af63",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "Press the '/' key to open the Slash Menu and add another",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "f0149aad-cbc5-41bf-9791-d8181a6de1c4",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [],
                "children": []
            }
        ],
    })

    const renderOutputAsHTMLLossy = async () => {
        console.log(
            await editor.blocksToHTMLLossy(editor.document)
        )
    }

    const renderOutputAsHTML = async () => {
        console.log(
            await editor.blocksToFullHTML(editor.document)
        )
    }

    const renderOutputAsJSON = async () => {
        console.log(
            editor.document
        )
    }

    // Renders the editor instance.
    return (
        <>
            <BlockNoteView editor={editor} slashMenu={false} formattingToolbar={false}>

                <FormattingToolbar />

                {/* Replaces the default Slash Menu. */}
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
                        // Gets all default slash menu items and `insertAlert` item.
                        filterSuggestionItems(
                            [
                                ...getDefaultReactSlashMenuItems(editor),
                                insertAlert(editor),
                            ],
                            query
                        )
                    }
                />
            </BlockNoteView>
            <div>
                <MantineProvider>
                    <Button variant="filled" onClick={renderOutputAsHTML} >See HTML</Button>
                </MantineProvider>
                <MantineProvider>
                    <Button variant="filled" onClick={renderOutputAsHTMLLossy} >See HTML Lossy
                    </Button>
                </MantineProvider>
                <MantineProvider>
                    <Button variant="filled" onClick={renderOutputAsJSON} >See JSON</Button>
                </MantineProvider>
            </div>
        </>
    )
}

