import { defineStore } from 'pinia'

export const usePromptStore = defineStore('prompt', {

    state: () => ({
        systemPromptDocument: {},
        newMessageDocument: {},

        systemPrompt: null,
        messages: [],

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
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "This is a great direction. \nWe have to make the content portable, and compatible with sqlite, mysql and postgres. \nSo I was thinking to have the possibility of dealinh with two approaches of storage: \nApproach 1: in tables, but all record attributes would be a json document, so the tables working like so would have just a primary key and a “document” text column. \nApproach 2: if the user wants an advanced, scalable way of storing content, he could deal with migrations, models etc, and provide a class that adheres to a contract, and that we can deal with as well. \n\nWhat are the advantages and disadvantages of a system like this?\nHow would you model it?"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "The approach you described, which offers two ways of storing content - using JSON documents in tables or using migrations and models - has its advantages and disadvantages. Let's explore them:\n\nAdvantages of Approach 1 (JSON documents in tables):\n1. Simplicity: Storing content as JSON documents in tables is straightforward and easy to implement. It requires minimal setup and configuration.\n2. Flexibility: JSON documents allow for flexible and dynamic content structures. You can easily add or modify fields without altering the database schema.\n3. Portability: Since the content is stored as JSON, it can be easily migrated or exported to other systems or databases that support JSON storage.\n4. Compatibility: JSON is widely supported across different databases, making it compatible with SQLite, MySQL, and PostgreSQL.\n\nDisadvantages of Approach 1:\n1. Limited querying capabilities: Querying and filtering content based on specific fields within the JSON document can be more complex and less efficient compared to structured tables.\n2. Lack of data integrity: JSON documents don't enforce strict data types or constraints, which can lead to inconsistencies or invalid data if not properly validated.\n3. Performance: Querying and indexing large JSON documents can be slower compared to querying structured tables, especially for complex queries.\n\nAdvantages of Approach 2 (migrations and models):\n1. Structured data: Using migrations and models allows for a structured and well-defined database schema, ensuring data integrity and consistency.\n2. Efficient querying: Querying and filtering content based on specific fields is more efficient and optimized when using structured tables.\n3. Scalability: Structured tables with proper indexing and optimization can handle large amounts of data and scale well.\n4. Advanced features: Models and migrations provide advanced features like data validation, relationships, and constraints, ensuring data integrity and consistency.\n\nDisadvantages of Approach 2:\n1. Complexity: Implementing migrations and models requires more setup, configuration, and maintenance compared to the JSON document approach.\n2. Learning curve: Users need to be familiar with the concepts of migrations, models, and database schemas, which may have a steeper learning curve.\n3. Portability: Migrating content stored in structured tables to a different database or system may require more effort and database-specific adjustments.\n\nModeling the System:\nTo model a system that supports both approaches, you can consider the following:\n\n1. Abstract Storage Interface:\n   - Define an abstract storage interface that outlines the common methods and operations for storing and retrieving content.\n   - This interface should be implemented by both the JSON document storage and the migrations/models storage.\n\n2. JSON Document Storage:\n   - Implement a storage class that adheres to the abstract storage interface and handles the storage of content as JSON documents in tables.\n   - This class should handle the creation of tables, insertion, retrieval, and querying of JSON documents.\n\n3. Migrations/Models Storage:\n   - Implement a storage class that adheres to the abstract storage interface and handles the storage of content using migrations and models.\n   - This class should provide methods for defining and executing migrations, creating models, and performing database operations.\n\n4. Storage Factory:\n   - Create a storage factory class that determines which storage approach to use based on the user's configuration or preference.\n   - The factory should return an instance of the appropriate storage class (JSON document storage or migrations/models storage) based on the user's choice.\n\n5. CMS Core:\n   - The CMS core should interact with the storage through the abstract storage interface, allowing it to work with either storage approach seamlessly.\n   - The CMS core should handle content management, retrieval, and other CMS-related operations, delegating the storage-specific tasks to the appropriate storage class.\n\nBy modeling the system in this way, you provide flexibility to the users, allowing them to choose between the simplicity of JSON document storage or the advanced features of migrations and models. The CMS core remains agnostic to the storage approach, making it easier to maintain and extend the system in the future."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "I agree, this is a great direction. \nWhat entities and attributes should we provide out of the box, to persist configuration and content?"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "When designing a CMS builder framework, it's important to provide a set of essential entities and attributes out of the box to persist configuration and content. Here are some key entities and attributes to consider:\n\n1. Site Configuration:\n   - Site Title: The title or name of the website.\n   - Site Description: A brief description of the website.\n   - Site URL: The main URL of the website.\n   - Site Language: The default language of the website.\n   - Site Timezone: The timezone used for the website.\n   - Site Logo: The logo image for the website.\n   - Site Favicon: The favicon image for the website.\n\n2. User:\n   - Username: The unique identifier for the user.\n   - Email: The user's email address.\n   - Password: The hashed password for user authentication.\n   - First Name: The user's first name.\n   - Last Name: The user's last name.\n   - Role: The user's role or permission level (e.g., admin, editor, author).\n   - Profile Picture: The user's profile picture.\n   - Bio: A brief biography or description of the user.\n\n3. Content Type:\n   - Name: The name of the content type (e.g., page, post, product).\n   - Slug: The unique slug or identifier for the content type.\n   - Description: A brief description of the content type.\n   - Fields: An array or collection of field definitions for the content type.\n\n4. Field:\n   - Name: The name of the field.\n   - Slug: The unique slug or identifier for the field.\n   - Type: The data type of the field (e.g., text, rich text, image, date).\n   - Required: Indicates whether the field is required or optional.\n   - Default Value: The default value for the field, if applicable.\n   - Validation Rules: Any validation rules or constraints for the field value.\n\n5. Content:\n   - Title: The title of the content item.\n   - Slug: The unique slug or identifier for the content item.\n   - Content Type: The associated content type for the content item.\n   - Fields: An object or collection of field values for the content item.\n   - Author: The user who created the content item.\n   - Created At: The timestamp when the content item was created.\n   - Updated At: The timestamp when the content item was last updated.\n   - Published At: The timestamp when the content item was published.\n   - Status: The status of the content item (e.g., draft, published, archived).\n\n6. Taxonomy:\n   - Name: The name of the taxonomy (e.g., category, tag).\n   - Slug: The unique slug or identifier for the taxonomy.\n   - Description: A brief description of the taxonomy.\n   - Hierarchical: Indicates whether the taxonomy is hierarchical or flat.\n\n7. Taxonomy Term:\n   - Name: The name of the taxonomy term.\n   - Slug: The unique slug or identifier for the taxonomy term.\n   - Taxonomy: The associated taxonomy for the term.\n   - Parent: The parent term, if applicable (for hierarchical taxonomies).\n   - Description: A brief description of the taxonomy term.\n\n8. Media:\n   - File Name: The name of the media file.\n   - File Path: The path or URL to the media file.\n   - File Type: The type of the media file (e.g., image, video, document).\n   - Alt Text: The alternative text for the media file.\n   - Caption: A caption or description for the media file.\n   - Uploaded By: The user who uploaded the media file.\n   - Uploaded At: The timestamp when the media file was uploaded.\n\nThese entities and attributes provide a solid foundation for persisting configuration and content in a CMS builder framework. They cover the essential aspects of a website, including site settings, user management, content types, fields, content items, taxonomies, and media management.\n\nAs you develop your CMS builder framework, you can extend or modify these entities and attributes based on your specific requirements and additional features you want to offer. Remember to keep the entities and attributes flexible and extensible to accommodate future enhancements and customization needs."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Ok, this needs some adjustments. \nWe need the websites to be multilingual by default. \nThe user may abide to defaults or have preferences like the language, timezone, currency, etc\nThe content had fields that may be translatable or not.\nThere may be pieces of content that are repeated in multiple places.\nThere are navigation menus, with navigation items, that may have configurable fields.\n\n"
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
    const startTime = Date.now();

    const tryAccessStore = () => {
        try {
            const promptStore = usePromptStore();

            return promptStore; // If successful, return the store
        } catch (error) {
            if (error.message.includes('no active Pinia')) {
                return null; // Store not ready yet
            }
            throw error; // Rethrow if it's a different error
        }
    };

    while (Date.now() - startTime < maxWaitTime) {
        const store = tryAccessStore();
        if (store) {
            return store; // Store is available
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Timeout: Pinia store not available after 10 seconds');
};
