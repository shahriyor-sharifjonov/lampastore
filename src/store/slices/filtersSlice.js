import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  minPrice: "",
  maxPrice: "",
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMinPrice: (state, action) => {
      state.minPrice = action.payload
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload
    },
  },
})

export const { setMinPrice, setMaxPrice } = filtersSlice.actions

export default filtersSlice.reducer 