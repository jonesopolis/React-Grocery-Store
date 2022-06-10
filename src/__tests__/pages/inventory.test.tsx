import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Inventory from "../../pages/inventory";
import "@testing-library/jest-dom";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { useGroceryServices } from "../../components/grocery-service-context";
import react, { useState } from "react";
import InventoryItem from "../../models/inventory-item";

jest.mock("next-auth/react");
jest.mock("../../components/grocery-service-context");

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

    afterEach(cleanup);

    it(`loads inventory on page load`, async () => {
    
        var mockGetInventory = jest.fn(() => [ inventoryItem ]);

        (useGroceryServices as jest.Mock).mockReturnValue({ 
            inventoryService: {
                getInventory: mockGetInventory
            }, 
            cartService: jest.fn()
        });

        render(<Inventory />);

        expect(mockGetInventory).toBeCalled();
        expect(mockGetInventory).toHaveReturnedWith([ inventoryItem ]);
    });

    it(`clears filter text on pressing clear`, async () => {
    
        (useGroceryServices as jest.Mock).mockReturnValue({ 
            inventoryService: {
                getInventory: jest.fn(() => [ inventoryItem ])
            }, 
            cartService: jest.fn()
        });

        render(<Inventory />);

        var input = screen.getByPlaceholderText('...');
        fireEvent.change(input, {target: {value: 'dummy text'}});

        var clearButton = screen.getByText("Clear Filters");
        fireEvent.click(clearButton);

        expect(input.innerText).toBeFalsy();
    });

});