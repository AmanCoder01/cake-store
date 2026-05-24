import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  cartItems,
  shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
  paymentMethod: 'COD'
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const variantKey = item.selectedVariant || '';
      const cartItemId = `${item.product}-${variantKey}`;
      
      // Inject cartItemId into the item
      const newItem = { ...item, cartItemId };

      const existItem = state.cartItems.find((x) => x.cartItemId === cartItemId);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.cartItemId === cartItemId ? newItem : x
        );
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const payload = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => x.cartItemId !== payload && x.product !== payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, saveShippingAddress, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
