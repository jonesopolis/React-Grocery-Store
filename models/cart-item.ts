export default class CartItem {
    public constructor(init?:Partial<CartItem>) {
        Object.assign(this, init);
    }
    
    itemId: number;
    title: string;
    count: number;
    price: number;
}