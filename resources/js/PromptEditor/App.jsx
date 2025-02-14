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

    const {systemPrompt, newMessage, setSystemPrompt, setNewMessage} = usePromptEditorsStore()

    const localstorageKey = wire['promptType']

    let blocks = null
    try {
        blocks = JSON.parse(
            localStorage.getItem(localstorageKey)
        )
    } catch (e) {
        console.log(e)
    }

    // Create editor
    const editor = useCreateBlockNote({
        schema,
        sideMenuDetection: "editor",
        initialContent: blocks,
    })

    window.Livewire.on('clearNewMessage', () => {
        if (wire.get('promptType') === 'new_message') {
            editor.removeBlocks(editor.document)
        }
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
            case '%':
                items = await wire.call('findScopes', query, wire.get('basePath'))

                items = Array.from(items).map((item) => ({
                    type: 'scope',
                    title: item.key,
                    value: item.key,
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

                <SuggestionMenuController
                    triggerCharacter={'%'}
                    getItems={async (query) => filterSuggestionItems(await getMentionMenuItems(editor, query, '%'), query)}
                />
            </BlockNoteView>

            <div className={'flex items-center gap-4'}>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-xs btn-link mt-2">Options</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li>
                            <a onClick={() => {
                                localStorage.setItem(localstorageKey, JSON.stringify(editor.document))
                                console.log('Saved to localstorage')
                            }}>
                                Save to localstorage
                            </a>
                        </li>
                        <li>
                            <a onClick={() => console.log(editor.document)}>
                                See JSON in console
                            </a>
                        </li>
                        <li>
                            <a onClick={async () => console.log(await editor.blocksToFullHTML(editor.document))}>
                                See HTML in console
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <div><span className="py-0.5 px-0.5 ounded font-extrabold">/</span> Slash Menu</div>
                    <div><span className="py-0.5 px-0.5 ounded font-extrabold">@</span> to refer a File</div>
                    <div><span className="py-0.5 px-0.5 ounded font-extrabold">#</span> to refer a Rule</div>
                </div>
            </div>

            {(wire.get('promptType') === 'system_prompt') && <div className={'flex justify-end mt-4'}>
                <button
                    className={'btn btn-sm btn-primary'}
                    onClick={() => window.Livewire.dispatch('setSystemPrompt')}
                >
                    Set system prompt
                </button>
            </div>}

            {(wire.get('promptType') === 'new_message') && <div className={'flex justify-end mt-4'}>
                <button
                    className={'btn btn-sm btn-primary'}
                    onClick={() => window.Livewire.dispatch('sendMessage')}
                >
                    Send Message
                </button>
            </div>}
        </div>
    )
}

// Main App component
export default function App() {

    return (
        <Editor/>
    )
}
