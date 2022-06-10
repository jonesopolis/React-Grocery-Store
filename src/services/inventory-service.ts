import { AxiosInstance } from "axios";
import InventoryItem from "../models/inventory-item";

class InventoryService {
    axiosInstance: AxiosInstance;
    
    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance; 
    }

    public async getInventory(): Promise<InventoryItem[]> {
        var response = await this.axiosInstance.get('/inventory');
        return response.data;
    }

    public async addInventory(inventoryItem: InventoryItem) {
        await this.axiosInstance.post('/inventory', inventoryItem);        
    }

    public async resetInventory() {
        await this.axiosInstance.delete('/inventory');
    }
}

export default InventoryService;