import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const promoSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {
    setPromo: (state, action) => {
      return action.payload
    },
    addPromo: (state, action) => {
      state.push(action.payload)
    },
    deletePromo: (state, action) => {
      const productId = action.payload
      return state.filter(product => product._id !== productId)
    },
    updatePromo: (state, action) => {
      const updatedProduct = action.payload
      const index = state.findIndex((product) => product._id === updatedProduct._id)
      if (index !== -1) {
        state[index] = updatedProduct
      }
    },
  },
})

export const { setPromo, addPromo, deletePromo, updatePromo } = promoSlice.actions

export default promoSlice.reducer