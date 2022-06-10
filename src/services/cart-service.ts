import { AxiosInstance } from "axios";
import { Cart } from "../models/user-cart";

class CartService {     
  axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  public async getUserCart(): Promise<Cart[]> {
    var response = await this.axiosInstance.get('/cart')
    return response.data;
  }

  public async addToCart(itemId: number): Promise<number> {
    var response = await this.axiosInstance.post('/cart', { itemId });
    return response.data;
  }

  public async removeFromCart(itemId: number): Promise<number> {
    var response = await this.axiosInstance.put('/cart', { itemId });
    return response.data;
  }

  public async checkout() {
    await this.axiosInstance.delete('/cart');
  }
}

export default CartService;