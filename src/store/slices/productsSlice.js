import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      return action.payload
    },
    addProducts: (state, action) => {
      state.push(action.payload)
    },
    deleteProducts: (state, action) => {
      const productId = action.payload
      return state.filter(product => product._id !== productId)
    },
    updateProducts: (state, action) => {
      const updatedProduct = action.payload
      const index = state.findIndex((product) => product._id === updatedProduct._id)
      if (index !== -1) {
        state[index] = updatedProduct
      }
    },
  },
})

export const { setProducts, addProducts, deleteProducts, updateProducts } = productsSlice.actions

export default productsSlice.reducer