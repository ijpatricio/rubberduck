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
                    props.inlineContent.props.type === "file" ? "bg-green-800" :
                        props.inlineContent.props.type === "rule" ? "bg-blue-800" :
                            "bg-purple-800"
                ].join(' ')}
            >
                    {props.inlineContent.props.type === "file" ? "@file:" :
                        props.inlineContent.props.type === "rule" ? "#rule:" :
                            "%scope:"}
                {props.inlineContent.props.title}
            </span>

        ),
    }
)
