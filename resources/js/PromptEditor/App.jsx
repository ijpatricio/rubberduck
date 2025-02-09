import React, {useContext} from 'react'
import { MantineProvider, Button } from '@mantine/core'
import {WireContext} from "./PromptEditor.jsx"
import { Mention } from './Mention'

import {
    BlockNoteSchema,
    defaultBlockSpecs,
    defaultInlineContentSpecs,
    filterSuggestionItems,
    insertOrUpdateBlock,
} from "@blocknote/core"

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
    inlineContentSpecs: {
        // Adds all default inline content.
        ...defaultInlineContentSpecs,
        // Adds the mention tag.
        mention: Mention,
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

export default function App() {
    const { wire } = useContext(WireContext)

    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        schema,
        initialContent: [
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

    const getMentionMenuItems = async (editor, query) => {

        let files = await wire.call('findFiles', query, wire.get('basePath'))

        files = Array.from(files)

        return files.map((file) => ({
            title: file,
            onItemClick: () => {
                editor.insertInlineContent([
                    {
                        type: 'mention',
                        props: {
                            file,
                        },
                    },
                    ' ', // add a space after the mention
                ])
            },
        }))
    }

    const renderAsMarkdown = async () => {
        console.log(
            await editor.blocksToMarkdownLossy(editor.document)
        )
    }

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

                <SuggestionMenuController
                    triggerCharacter={'@'}
                    getItems={async (query) => filterSuggestionItems(await getMentionMenuItems(editor, query), query)}
                />
            </BlockNoteView>

            <ul className={'mt-2 text-xs text-gray-500'}>
                <li>Press the '/' key to open the Slash Menu.</li>
                <li>Press the '@' key to refer a file.</li>
            </ul>

            <div>
                <MantineProvider>
                    <Button variant="filled" onClick={renderAsMarkdown} >See MD Lossy</Button>
                    <Button variant="filled" onClick={renderOutputAsJSON} >See JSON</Button>
                    {/*<Button variant="filled" onClick={renderOutputAsHTML} >See HTML</Button>*/}
                    {/*<Button variant="filled" onClick={renderOutputAsHTMLLossy} >See HTML Lossy</Button>*/}
                </MantineProvider>
            </div>
        </>
    )
}
