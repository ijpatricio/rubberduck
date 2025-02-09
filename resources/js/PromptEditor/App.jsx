import React, {useContext} from 'react'
import {MantineProvider, Button} from '@mantine/core'
import {WireContext} from "./PromptEditor.jsx"
import {Mention} from './Mention'

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
import {BlockNoteView} from "@blocknote/mantine"

import {RiAlertFill} from "react-icons/ri"
import {Alert} from "./Alert"

import "@blocknote/core/fonts/inter.css"
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
    icon: <RiAlertFill/>,
})

// Create an Editor component for reusability
function Editor({initialContent}) {
    const {wire} = useContext(WireContext)

    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        schema,
        initialContent,
        sideMenuDetection: "editor"
    })

    const getMentionMenuItems = async (editor, query, type) => {

        let items

        switch (type) {
            case '@':
                items = await wire.call('findFiles', query, wire.get('basePath'))

                items = Array.from(items).map((item) => ({
                    title: item,
                    type: 'file',
                    value: item,
                }))
                break
            case '#':
                items = await wire.call('findRules', query, wire.get('basePath'))

                items = Array.from(items).map((item) => ({
                    type: 'rule',
                    title: item,
                    value: item,
                }))
                break
            default:
                alert('Unknown mention type')
        }

        return items.map((item) => ({
            title: item.title,
            onItemClick: () => {
                editor.insertInlineContent([
                    {
                        type: 'mention',
                        props: {
                            title: item.title,
                            type: item.type,
                            value: item.value,
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
        <div className={'w-full'}>
            <BlockNoteView editor={editor} slashMenu={false} formattingToolbar={false}>

                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
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
                    getItems={async (query) => filterSuggestionItems(await getMentionMenuItems(editor, query, '@'), query)}
                />

                <SuggestionMenuController
                    triggerCharacter={'#'}
                    getItems={async (query) => filterSuggestionItems(await getMentionMenuItems(editor, query, '#'), query)}
                />
            </BlockNoteView>

            <ul className={'mt-2 text-xs text-gray-500'}>
                <li>Press the '/' key to open the Slash Menu.</li>
                <li>Press the '@' key to refer a File.</li>
                <li>Press the '#' key to refer a Rule.</li>
            </ul>

            <MantineProvider>
                <Button variant="filled" onClick={renderAsMarkdown}>See MD Lossy</Button>
                <Button variant="filled" onClick={renderOutputAsJSON}>See JSON</Button>
                {/*<Button variant="filled" onClick={renderOutputAsHTML} >See HTML</Button>*/}
                {/*<Button variant="filled" onClick={renderOutputAsHTMLLossy} >See HTML Lossy</Button>*/}
            </MantineProvider>
        </div>
    )
}

// Main App component
export default function App() {
    return (
        <Editor
            initialContent={[
                {
                    type: "paragraph",
                    content: "Welcome to this demo!",
                },
                {
                    type: "paragraph",
                    content: "This is a block in the first editor",
                },
                {
                    type: "paragraph",
                },
            ]}
        />
    )
}
