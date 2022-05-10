export default function CartService(axiosInstance) {     

  async function getUserCart() {
    var response = await axiosInstance.get('/cart')
    return response.data;
  }

  async function addToCart(itemId) {
    var response = await axiosInstance.post('/cart', { itemId });
    return response.data;
  }

  async function removeFromCart(itemId) {
    var response = await axiosInstance.put('/cart', { itemId });
    return response.data;
  }

  async function checkout() {
    await axiosInstance.delete('/cart');
  }

  return {
    getUserCart,
    addToCart,
    removeFromCart,
    checkout
  };
}

