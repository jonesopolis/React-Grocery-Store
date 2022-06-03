export default class UserCart {
    userId: string;
    cart: Cart[];
}

export class Cart {
    itemId: number;
    count: number;
}