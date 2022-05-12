export default function InventoryService(axiosInstance) {
    
    async function getInventory() {
        var response = await axiosInstance.get('/inventory');
        return response.data;
    }

    async function addInventory(inventoryItem) {
        await axiosInstance.post('/inventory', inventoryItem);        
    }

    async function resetInventory() {
        await axiosInstance.delete('/inventory');
    }

    return {
      getInventory,
      addInventory,
      resetInventory
    };
}