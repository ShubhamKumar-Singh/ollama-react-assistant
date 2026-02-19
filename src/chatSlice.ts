import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    sender: string;
    text: string;
}

interface ChatState {
    messages: Message[];
    input: string;
    loading: boolean;
}

const initialState: ChatState = {
    messages: [],
    input: '',
    loading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setInput(state, action: PayloadAction<string>) {
            state.input = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        resetInput(state) {
            state.input = '';
        },
    },
});

export const { setInput, addMessage, setLoading, resetInput } = chatSlice.actions;
export default chatSlice.reducer;
