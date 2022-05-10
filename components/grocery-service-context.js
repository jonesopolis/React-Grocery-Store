import React from 'react';
import { useContext } from "react";
import cartService from "../services/cart-service";
import inventoryService from '../services/inventory-service';
import axios from 'axios';
import { useMsal, useAccount } from "@azure/msal-react";

const GroceryServiceContext = React.createContext(null);

export const useGroceryServices = () => useContext(GroceryServiceContext);

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const GroceryServiceProvider = (props) => {
  
  const { instance, accounts } = useMsal();  
  const account = useAccount(accounts[0]); 

  async function getToken() {

    var response = await instance.acquireTokenSilent({ scopes: ["api://b4373faf-503c-4930-9661-cb93b74e3625/myapi"], account: account })
    return response.accessToken;
  }

  axiosInstance.interceptors.request.use(async request => {      

      if(!request.headers["Authorization"] && account) {
        request.headers['Authorization'] = `Bearer ${await getToken()}`;
      }

      return request;
  });



  const cartServiceInstance = new cartService(axiosInstance);
  const inventoryServiceInstance = new inventoryService(axiosInstance);

  const groceryServices = {
    cartService: cartServiceInstance,
    inventoryService: inventoryServiceInstance,
  };

  return <GroceryServiceContext.Provider value={groceryServices} {...props} />;
}
