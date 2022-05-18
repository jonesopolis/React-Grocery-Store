import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from "react";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import NumberFormat from 'react-number-format';

export default function SignalRListener({ children }) {

    const [connection, setConnection] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [inventoryItem, setInventoryItem] = useState({});

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/inventory`)
        .withAutomaticReconnect()
        .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (!connection) {
            return;
        }

        connection
          .start({ withCredentials: false })
          .then(() => {
            connection.on("inventory-added", (newInventory) => {
              setInventoryItem(newInventory);
              setShowToast(true);
            });
          })
          .catch((e) => console.log("Connection failed: ", e));
    }, [connection]);

    return (
      <>
        <ToastContainer className="p-3 top-nav-fixer" position="top-center">
          <Toast show={showToast} animation="true" delay={10000} autohide bg='info' onClose={() => setShowToast(false)}>
            <Toast.Header closeButton={true}>
              <strong className="me-auto">New Inventory Added!</strong>
            </Toast.Header>
            <Toast.Body>
              You can now purchase <b>{inventoryItem.title}</b> for {' '}
              <b>
              <NumberFormat
                value={inventoryItem.price}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                fixedDecimalScale={true}
                decimalScale={2}
              ></NumberFormat>
              </b>
            </Toast.Body>
          </Toast>
        </ToastContainer>

        {children}
      </>
    );
}