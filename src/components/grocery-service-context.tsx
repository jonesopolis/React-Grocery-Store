import React from 'react';
import { useContext } from "react";
import CartService from "../services/cart-service";
import InventoryService from '../services/inventory-service';
import axios from 'axios';
import IGroceryServices from '../services/grocery-services';
import { useSession, signIn } from "next-auth/react";

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
  
  const { data: session } = useSession();

  async function getToken() {
    if(session && session.account) {      
      return session.account.access_token;
    }

    signIn();
  }

  axiosInstance.interceptors.request.use(async request => {      
      if(!request?.headers?.Authorization && session) {        
        request.headers!.Authorization = `Bearer ${await getToken()}`;
      }

      return request;
  });

  axiosInstance.interceptors.response.use(response => response, 
                                          async error => {
                                            if (error.response.status === 401) {
                                              console.error('bad token');
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