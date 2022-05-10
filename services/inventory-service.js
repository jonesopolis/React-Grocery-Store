export default function InventoryService(axiosInstance) {
    
    async function getInventory() {
        var response = await axiosInstance.get('/inventory');
        return response.data;
    }

    return {
        getInventory
    }
}