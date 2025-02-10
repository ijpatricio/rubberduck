import { create } from 'zustand'

// Create the store
const useStore = create((set) => ({

    systemPrompt: null,

    newMessage: null,

    setSystemPrompt: (data) => set({ systemPrompt: data }),

    setNewMessage: (data) => set({ newMessage: data }),

}))

// Export the store and the store accessor
export const storeAccessor = {
    get state() {
        return useStore.getState()
    },
    setSystemPrompt(newData) {
        useStore.getState().setSystemPrompt(newData)
    },
    setNewMessage(newData) {
        useStore.getState().setNewMessage(newData)
    },
}

export default useStore
