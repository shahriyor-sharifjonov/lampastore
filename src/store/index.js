import { configureStore } from "@reduxjs/toolkit"
import loadingSlice from "./slices/loadingSlice"
import categoriesSlice from "./slices/categoriesSlice"
import filterSlice from "./slices/filterSlice"

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        categories: categoriesSlice,
        filter: filterSlice,
    },
})