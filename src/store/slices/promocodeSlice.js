import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const promocodeSlice = createSlice({
  name: 'promocode',
  initialState,
  reducers: {
    setPromocode: (state, action) => {
      return action.payload
    },
    addPromocode: (state, action) => {
      state.push(action.payload)
    },
    deletePromocode: (state, action) => {
      const promocodeId = action.payload
      return state.filter(promocode => promocode._id !== promocodeId)
    },
    updatePromocode: (state, action) => {
      const updatedPromocode = action.payload
      const index = state.findIndex((promocode) => promocode._id === updatedPromocode._id)
      if (index !== -1) {
        state[index] = updatedPromocode
      }
    },
  },
})

export const { setPromocode, addPromocode, deletePromocode, updatePromocode } = promocodeSlice.actions

export default promocodeSlice.reducer