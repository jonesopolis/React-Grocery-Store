export default class InventoryItem {

    constructor() {
        this.id = 0;
        this.title = "";
        this.type = "";
        this.description = "";
        this.price = 0.0;
    }

    id: number;
    title: string;
    type: string;
    description: string;
    price: number;
}