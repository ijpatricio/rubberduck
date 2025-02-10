import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {

    state: () => ({

        // This is the payload that we setup and increment over time
        payload: {
            model: null,
            max_tokens: null,
            temperature: null,
            system: null,
            messages: [],
        },



        example: {
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            temperature: 0,
            system: "Act as a successful developer that has over 20 years of experience, at designing web applications, using all CMS in the world, and a lot of publishing experience across many generalist and niche topics.",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "if you have to start a cms builder framework from scratch,on top of an existing framework that deals with the architecture in terms of database, web requests, etc, what entities would you have to start with?"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "When starting a CMS builder framework from scratch, on top of an existing framework that handles the architecture, database, and web requests, you would need to consider several key entities to begin with. Here are some essential entities to consider:\n\n1. Content Types:\n   - Define the different types of content your CMS will support, such as pages, posts, articles, products, or custom content types.\n   - Determine the structure and fields for each content type, including title, body, metadata, and any additional custom fields.\n\n2. Content Fields:\n   - Identify the various field types that can be associated with content types, such as text, rich text, images, files, dates, numbers, etc.\n   - Define the properties and validation rules for each field type.\n\n3. Templates:\n   - Create a templating system that allows users to define the layout and presentation of content.\n   - Provide a way to associate templates with specific content types or individual pieces of content.\n\n4. Users and Roles:\n   - Implement a user management system to handle user authentication and authorization.\n   - Define different user roles and permissions, such as administrators, editors, authors, and subscribers.\n\n5. Media Management:\n   - Develop a media management system to handle uploading, storing, and retrieving media files, such as images, videos, and documents.\n   - Provide an interface for users to manage and organize media files.\n\n6. Taxonomy and Categorization:\n   - Implement a taxonomy system to categorize and organize content, such as categories, tags, or custom taxonomies.\n   - Allow users to define and manage taxonomies and associate them with content types.\n\n7. URL Routing and Permalinks:\n   - Define a URL routing system to map URLs to specific content or templates.\n   - Provide options for customizing permalinks and generating SEO-friendly URLs.\n\n8. Settings and Configuration:\n   - Create a settings management system to store and manage CMS-wide configuration options.\n   - Allow users to customize settings related to the CMS, such as site title, theme, and other global preferences.\n\n9. Plugins and Extensions:\n   - Design a plugin or extension system that allows developers to extend the functionality of the CMS.\n   - Provide hooks, filters, or events that plugins can use to modify or enhance the CMS behavior.\n\n10. Database Schema:\n    - Define the database schema to store and retrieve content, users, settings, and other CMS-related data.\n    - Ensure the schema is optimized for performance and scalability.\n\nThese entities form the foundation of a CMS builder framework. As you develop the framework, you may identify additional entities or refine the existing ones based on your specific requirements and the features you want to offer.\n\nRemember to leverage the existing framework's capabilities, such as database management, web request handling, and architecture, to build upon and integrate your CMS builder framework seamlessly."
                        }
                    ]
                }
            ]
        }
    }),

    getters: {
        //
    },

    actions: {
        //
    },
})


export const waitForPiniaStore = async (maxWaitTime = 7000, interval = 100) => {
    const startTime = Date.now()

    const tryAccessStore = () => {
        try {
            return useChatStore()
        } catch (error) {
            if (error.message.includes('no active Pinia')) {
                return null // Store not ready yet
            }
            throw error // Rethrow if it's a different error
        }
    }

    while (Date.now() - startTime < maxWaitTime) {
        const store = tryAccessStore()
        if (store) {
            return store // Store is available
        }
        await new Promise(resolve => setTimeout(resolve, interval))
    }

    throw new Error('Timeout: Pinia store not available after 10 seconds')
}
