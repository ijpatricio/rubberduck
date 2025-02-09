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
                className={props.inlineContent.props.type === "file" ? "bg-green-800" : "bg-blue-800"}>
                {props.inlineContent.props.type === "file" ? "@" : "#"}
                {props.inlineContent.props.title}
            </span>
        ),
    }
)
