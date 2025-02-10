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

    //const htmlContent = `<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="6053fab9-7b22-4247-b112-a2d81715e438"><div class="bn-block" data-node-type="blockContainer" data-id="6053fab9-7b22-4247-b112-a2d81715e438"><div class="bn-block-content" data-content-type="heading"><h1 class="bn-inline-content">O pente do careca</h1></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="e39a9318-dc8b-4e67-af94-263d2e8e89d7"><div class="bn-block" data-node-type="blockContainer" data-id="e39a9318-dc8b-4e67-af94-263d2e8e89d7"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">apples</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="5a63b19d-cce7-445e-8b46-0dc2fb72a0e1"><div class="bn-block" data-node-type="blockContainer" data-id="5a63b19d-cce7-445e-8b46-0dc2fb72a0e1"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">oranges</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="2f153c31-934d-4961-93d0-9f865fc62c30"><div class="bn-block" data-node-type="blockContainer" data-id="2f153c31-934d-4961-93d0-9f865fc62c30"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">bananas</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="29b33558-7478-4253-a11e-6b148727381b"><div class="bn-block" data-node-type="blockContainer" data-id="29b33558-7478-4253-a11e-6b148727381b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Hey hello</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="c19e742e-196a-49dc-bfde-4e06d6716dd5"><div class="bn-block" data-node-type="blockContainer" data-id="c19e742e-196a-49dc-bfde-4e06d6716dd5"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-blue-800" data-inline-content-type="mention" data-title="first-one.txt" data-type="rule" data-value="first-one.txt">#rule:first-one.txt</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="3f36360e-1294-4778-8bf1-0dad996ac647"><div class="bn-block" data-node-type="blockContainer" data-id="3f36360e-1294-4778-8bf1-0dad996ac647"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">File:</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="28e837a8-ab8b-42b6-821d-edda52a10c80"><div class="bn-block" data-node-type="blockContainer" data-id="28e837a8-ab8b-42b6-821d-edda52a10c80"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="README.md" data-type="file" data-value="README.md">@file:README.md</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="88bb4409-0089-45f9-ba5e-3d3c5e4b3d91"><div class="bn-block" data-node-type="blockContainer" data-id="88bb4409-0089-45f9-ba5e-3d3c5e4b3d91"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Bla bla</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="6bc70a77-cd78-4463-bec4-091f545b2a2b"><div class="bn-block" data-node-type="blockContainer" data-id="6bc70a77-cd78-4463-bec4-091f545b2a2b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="app/Casts/MoneyCast.php" data-type="file" data-value="app/Casts/MoneyCast.php">@file:app/Casts/MoneyCast.php</span> </p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="d79d8b86-22d7-48ed-abc0-23326d0355ea"><div class="bn-block" data-node-type="blockContainer" data-id="d79d8b86-22d7-48ed-abc0-23326d0355ea"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div></div>`
    const blocksContentJSON = `[{"id":"6053fab9-7b22-4247-b112-a2d81715e438","type":"heading","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left","level":1},"content":[{"type":"text","text":"O pente do careca","styles":{}}],"children":[]},{"id":"e39a9318-dc8b-4e67-af94-263d2e8e89d7","type":"bulletListItem","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"apples","styles":{}}],"children":[]},{"id":"5a63b19d-cce7-445e-8b46-0dc2fb72a0e1","type":"bulletListItem","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"oranges","styles":{}}],"children":[]},{"id":"2f153c31-934d-4961-93d0-9f865fc62c30","type":"bulletListItem","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"bananas","styles":{}}],"children":[]},{"id":"29b33558-7478-4253-a11e-6b148727381b","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Hey hello","styles":{}}],"children":[]},{"id":"c19e742e-196a-49dc-bfde-4e06d6716dd5","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"mention","props":{"title":"first-one.txt","type":"rule","value":"first-one.txt"}}],"children":[]},{"id":"3f36360e-1294-4778-8bf1-0dad996ac647","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"File:","styles":{}}],"children":[]},{"id":"28e837a8-ab8b-42b6-821d-edda52a10c80","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"mention","props":{"title":"README.md","type":"file","value":"README.md"}}],"children":[]},{"id":"88bb4409-0089-45f9-ba5e-3d3c5e4b3d91","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Bla bla","styles":{}}],"children":[]},{"id":"6bc70a77-cd78-4463-bec4-091f545b2a2b","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"mention","props":{"title":"app/Casts/MoneyCast.php","type":"file","value":"app/Casts/MoneyCast.php"}},{"type":"text","text":" ","styles":{}}],"children":[]},{"id":"d79d8b86-22d7-48ed-abc0-23326d0355ea","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]`
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
