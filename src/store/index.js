import { configureStore } from "@reduxjs/toolkit"
import loadingSlice from "./slices/loadingSlice"
import categoriesSlice from "./slices/categoriesSlice"
import productsSlice from "./slices/productsSlice"
import filterSlice from "./slices/filterSlice"
import filtersSlice from "./slices/filtersSlice"
import cartSlice from "./slices/cartSlice"
import promoSlice from "./slices/promoSlice"
import promocodeSlice from "./slices/promocodeSlice"

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        categories: categoriesSlice,
        products: productsSlice,
        filter: filterSlice,
        filters: filtersSlice,
        cart: cartSlice,
        promo: promoSlice,
        promocode: promocodeSlice,
    },
})