import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    canvasReferences: null,
    videoReferences: null,
};

const canvasSlice = createSlice({
    name: "canvas",
    initialState,
    reducers: {
        setCanvasRef(state, action) {
            console.log(action)
            state.canvasReferences = action.payload.canvasRef1;
            state.videoReferences = action.payload.videoRef1;
        },
    },
});

export const { setCanvasRef } = canvasSlice.actions;

export default canvasSlice.reducer;