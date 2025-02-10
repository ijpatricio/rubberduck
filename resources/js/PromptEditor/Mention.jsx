import React, {useContext} from "react"
import {createReactInlineContentSpec} from "@blocknote/react"
// import {WireContext} from "./PromptEditor.jsx"


// The Mention inline content.
export const Mention = createReactInlineContentSpec(
    {
        type: "mention",
        propSchema: {
            title: {
                default: "Unknown",
            },
            type: {
                default: "Unknown",
            },
            value: {
                default: "Unknown",
            },
        },
        content: "none",
    },
    {
        render: (props) => (
            <span
                className={[
                    'py-0.5 px-2 rounded text-white',
                    props.inlineContent.props.type === "file" ? "bg-green-800" : "bg-blue-800"
                ].join(' ')}
            >
                    {props.inlineContent.props.type === "file" ? "@file:" : "#rule:"}
                    {props.inlineContent.props.title}
                </span>

        ),
    }
)
