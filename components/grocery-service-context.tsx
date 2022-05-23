import React from 'react';
import { useContext } from "react";
import CartService from "../services/cart-service";
import InventoryService from '../services/inventory-service';
import axios from 'axios';
import { useMsal, useAccount } from "@azure/msal-react";
import IGroceryServices from '../services/grocery-services';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

const groceryServices: IGroceryServices = {
  cartService: new CartService(axiosInstance),
  inventoryService:  new InventoryService(axiosInstance),
};

const GroceryServiceContext = React.createContext<IGroceryServices>(groceryServices);
export const useGroceryServices = () => useContext(GroceryServiceContext);

const GroceryServiceProvider = ({ children }: { children: React.ReactNode }) => {
  
  const { instance, accounts } = useMsal();  
  const account = useAccount(accounts[0]); 

  async function getToken() {
    if(account) {
      var response = await instance.acquireTokenSilent({ scopes: ["api://b4373faf-503c-4930-9661-cb93b74e3625/myapi"], account: account })
      return response.accessToken;
    }

    return null;
  }

  axiosInstance.interceptors.request.use(async request => {      
      if(!request?.headers?.Authorization && account) {        
        request.headers!.Authorization = `Bearer ${await getToken()}`;
      }

      return request;
  });

  axiosInstance.interceptors.response.use(response => response, 
                                          async error => {
                                            if (error.response.status === 401) {
                                              await instance.handleRedirectPromise();
                                              await instance.loginRedirect();
                                            }

                                            return Promise.reject(error)
                                          });

  return (
    <GroceryServiceContext.Provider value={groceryServices}>
      {children}
    </GroceryServiceContext.Provider>
  );
}

export default GroceryServiceProvider;