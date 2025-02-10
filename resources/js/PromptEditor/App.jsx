import React, {useContext, useEffect, useState, useMemo} from 'react'
import {MantineProvider, Button} from '@mantine/core'
import {WireContext} from "./PromptEditor.jsx"
import {Mention} from './Mention'
import {waitForPiniaStore} from "../stores/useChatStore.js"
import usePromptEditorsStore from '../stores/promptEditorsStore.js'

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

    const { systemPrompt, newMessage, setSystemPrompt, setNewMessage } = usePromptEditorsStore()

    //const htmlContent = `<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="2674fb2d-30e3-4e88-afcb-ba0337e49dd4"><div class="bn-block" data-node-type="blockContainer" data-id="2674fb2d-30e3-4e88-afcb-ba0337e49dd4"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Hey hello</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="599c09c0-091c-4945-bf96-16ecb608063f"><div class="bn-block" data-node-type="blockContainer" data-id="599c09c0-091c-4945-bf96-16ecb608063f"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-blue-800" data-inline-content-type="mention" data-title="first-one.txt" data-type="rule" data-value="first-one.txt">#rule:first-one.txt</span> </p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="2d72b930-96f3-49c1-9748-5b8b455d30cf"><div class="bn-block" data-node-type="blockContainer" data-id="2d72b930-96f3-49c1-9748-5b8b455d30cf"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">File: </p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="80850d1d-203e-4f81-9efc-86157450df3d"><div class="bn-block" data-node-type="blockContainer" data-id="80850d1d-203e-4f81-9efc-86157450df3d"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="README.md" data-type="file" data-value="README.md">@file:README.md</span> </p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="1d225898-bac0-4561-a441-eea0e5e4b954"><div class="bn-block" data-node-type="blockContainer" data-id="1d225898-bac0-4561-a441-eea0e5e4b954"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Bla bla</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="8d1451d7-42af-4de0-8ba3-0b2a0d952cf0"><div class="bn-block" data-node-type="blockContainer" data-id="8d1451d7-42af-4de0-8ba3-0b2a0d952cf0"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div></div>`
    const blocksContentJSON = `[{"id":"2674fb2d-30e3-4e88-afcb-ba0337e49dd4","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Hey hello","styles":{}}],"children":[]},{"id":"599c09c0-091c-4945-bf96-16ecb608063f","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"mention","props":{"title":"first-one.txt","type":"rule","value":"first-one.txt"}}],"children":[]},{"id":"2d72b930-96f3-49c1-9748-5b8b455d30cf","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"File:","styles":{}}],"children":[]},{"id":"80850d1d-203e-4f81-9efc-86157450df3d","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"mention","props":{"title":"README.md","type":"file","value":"README.md"}}],"children":[]},{"id":"1d225898-bac0-4561-a441-eea0e5e4b954","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Bla bla","styles":{}}],"children":[]},{"id":"8d1451d7-42af-4de0-8ba3-0b2a0d952cf0","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]`
    const blocks = JSON.parse(blocksContentJSON)

    // Create editor
    const editor = useCreateBlockNote({
        schema,
        sideMenuDetection: "editor",
        initialContent: blocks,
    })

    const getMentionMenuItems = async (editor, query, type) => {

        let items

        switch (type) {
            case '@':
                items = await wire.call('findFiles', query, wire.get('basePath'))

                items = Array.from(items).map((item) => ({
                    type: 'file',
                    title: item,
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

    const propagateContentToStore = async () => {
        const documentHTML = await editor.blocksToFullHTML(editor.document)
        if (wire.get('promptType') === 'system_prompt') {
            setSystemPrompt(documentHTML)
        } else {
            setNewMessage(documentHTML)
        }
    }

    // After loading the Initial content, propagate it to the store
    useEffect(() => {
        if (editor) {
            // Wrap in Promise to defer execution
            Promise.resolve().then(() => {
                propagateContentToStore()
            })
        }
    }, [editor])

    // When the editor content changes, propagate it to the store
    const onEditorChange = async () => {
        await propagateContentToStore()
    }

    // Renders the editor instance.
    return (
        <div className={'w-full'}>
            <BlockNoteView
                editor={editor}
                formattingToolbar={false}
                onChange={onEditorChange}
            >
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

            <MantineProvider>
                <Button variant="filled" onClick={() => console.log(editor.document)}>
                    See JSON
                </Button>
                <Button variant="filled" onClick={async () => console.log(await editor.blocksToFullHTML(editor.document))}>
                    See HTML
                </Button>
            </MantineProvider>
        </div>
    )
}

// Main App component
export default function App() {

    return (
        <Editor />
    )
}
