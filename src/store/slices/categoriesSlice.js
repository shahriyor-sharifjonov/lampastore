import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      return action.payload
    },
    addCategory: (state, action) => {
      state.push(action.payload)
    },
    deleteCategory: (state, action) => {
      const categoryId = action.payload
      return state.filter(category => category._id !== categoryId)
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload
      const index = state.findIndex((category) => category._id === updatedCategory._id)
      if (index !== -1) {
        state[index] = updatedCategory
      }
    },
  },
})

export const { setCategories, addCategory, deleteCategory, updateCategory } = categoriesSlice.actions

export default categoriesSlice.reducer