import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false
}

export const filterSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setFilter } = filterSlice.actions

export default filterSlice.reducer