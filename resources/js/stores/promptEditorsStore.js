import { create } from 'zustand'

// Create the store
const usePromptEditorsStore = create((set) => ({

    systemPrompt: null,

    newMessage: null,

    setSystemPrompt: (data) => set({ systemPrompt: data }),

    setNewMessage: (data) => set({ newMessage: data }),

}))

// Export the store and the store accessor
export const storeAccessor = {
    get state() {
        return usePromptEditorsStore.getState()
    },
    setSystemPrompt(newData) {
        usePromptEditorsStore.getState().setSystemPrompt(newData)
    },
    setNewMessage(newData) {
        usePromptEditorsStore.getState().setNewMessage(newData)
    },
}

export default usePromptEditorsStore
