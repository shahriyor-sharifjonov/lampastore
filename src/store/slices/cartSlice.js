import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      return action.payload
    },
    addCart: (state, action) => {
      state.push(action.payload)
    },
    deleteCart: (state, action) => {
      const index = state.findIndex((cart) => cart._id === action.payload._id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    updateCart: (state, action) => {
      const updatedCart = action.payload
      const index = state.findIndex((cart) => cart._id === updatedCart._id)
      if (index !== -1) {
        state[index] = updatedCart
      }
    },
  },
})

export const { setCart, addCart, deleteCart, updateCart } = cartSlice.actions

export default cartSlice.reducer