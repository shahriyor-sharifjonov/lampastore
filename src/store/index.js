import { configureStore } from "@reduxjs/toolkit"
import loadingSlice from "./slices/loadingSlice"
import categoriesSlice from "./slices/categoriesSlice"
import productsSlice from "./slices/productsSlice"
import filterSlice from "./slices/filterSlice"

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        categories: categoriesSlice,
        products: productsSlice,
        filter: filterSlice,
    },
})