import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import CartView from "../../pages/cart-view";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useGroceryServices } from "../../components/grocery-service-context";
import react, { useState } from "react";
import InventoryItem from "../../models/inventory-item";

jest.mock("next-auth/react");
jest.mock("../../components/grocery-service-context");
jest.spyOn(react, 'useState');

let inventoryItem = new InventoryItem();
    
describe('cart-view', () => {

    beforeEach(() => {

        (useSession as jest.Mock).mockReturnValueOnce({ data: {} });

        inventoryItem.id = 123;
        inventoryItem.title = "mock inventory item";
        inventoryItem.type = "mock type";
        inventoryItem.description = "mock description";
        inventoryItem.price = 123.45;
    });

    it(`loads inventory on page load`, async () => {
    
        var mockGetInventory = jest.fn(() => [ inventoryItem ]);

        (useGroceryServices as jest.Mock).mockReturnValue({ 
            inventoryService: {
                getInventory: mockGetInventory
            }, 
            cartService: jest.fn()
        });
        
        render(<CartView />);

        expect(mockGetInventory).toBeCalled();
        expect(mockGetInventory).toHaveReturnedWith([ inventoryItem ]);
    });
});