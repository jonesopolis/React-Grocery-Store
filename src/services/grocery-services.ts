import CartService from "./cart-service"
import InventoryService from "./inventory-service";

interface IGroceryServices {
    cartService: CartService;
    inventoryService: InventoryService;
}

export default IGroceryServices