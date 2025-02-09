import React from "react"
import {createReactInlineContentSpec} from "@blocknote/react"

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
    {
        type: "mention",
        propSchema: {
            file: {
                default: "Unknown",
            },
        },
        content: "none",
    },
    {
        render: (props) => (
            <span className={"bg-green-800"}>
                @{props.inlineContent.props.file}
            </span>
        ),
    }
)
