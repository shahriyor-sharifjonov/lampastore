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
      const cartId = action.payload
      return state.filter(cart => cart._id !== cartId)
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