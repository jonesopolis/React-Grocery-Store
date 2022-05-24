import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import NumberFormat from 'react-number-format';
import { useRouter } from 'next/router';
import { useGroceryServices } from '../components/grocery-service-context';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import InventoryItem from '../models/inventory-item';
import CartItem from '../models/cart-item';

const CartView = () => {
  let { inventoryService, cartService } = useGroceryServices();

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [cartPrice, setCartPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const doWork = async () => setInventory(await inventoryService.getInventory());
    doWork();
  }, []);

  useEffect(() => {
    const doWork = async () => {
      if(!inventory.length) {
        return;
      }

      let cart = await cartService.getUserCart();

      let items = cart.map(x => {
        var inventoryItem = inventory.find((xx: InventoryItem) => xx.id === x.itemId) ?? new InventoryItem();

        return new CartItem({
          itemId: x.itemId,
          title: inventoryItem?.title,
          count: x.count,
          price: inventoryItem?.price,
        });
      });

      setCartItems(items);
      setLoading(false);
    }

    doWork();
  }, [inventory]);

  useEffect(() => {
    setCartCount(cartItems.map(x => x.count).reduce((partialSum, a) => partialSum + a, 0));
    setCartPrice(cartItems.map(x => x.count * x.price).reduce((partialSum, a) => partialSum + a, 0));  

  }, [cartItems]);


  async function removeFromCart(itemId: number) {
    var totalCount = await cartService.removeFromCart(itemId);

    setCartCount(totalCount);
    PubSub.publish("cart-count", totalCount);
    setCartItems(cartItems.filter((x) => x.itemId !== itemId));
  }

  async function checkout() {
    await cartService.checkout();
    PubSub.publish('cart-count', 0);
    router.push("/");
  }

  if(loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="grow" variant="info"/>
      </div>
    );
  }

  return (
    <>
      <UnauthenticatedTemplate>
        <Alert variant="warning">You are not logged in!</Alert>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        {cartCount > 0 && (
          <>
            <h2 className="display-4">
              You have {cartCount} {cartCount === 1 ? "item" : "items"} in your
              cart totalling{" "}
              <NumberFormat
                value={cartPrice}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                fixedDecimalScale={true}
                decimalScale={2}
              ></NumberFormat>
            </h2>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price (Each)</th>
                  <th>Count</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(({ itemId, title, count, price }) => (
                  <tr key={itemId}>
                    <td className="w-25">{title}</td>
                    <td className="w-25">
                      <NumberFormat
                        value={price}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        fixedDecimalScale={true}
                        decimalScale={2}
                      ></NumberFormat>
                    </td>
                    <td className="w-25">{count}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger btn btn-sm"
                        onClick={() => removeFromCart(itemId)}
                      >
                        Remove from Cart
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-center">
              <div className=" w-50 d-grid mt-4">
                <Button variant="info" onClick={() => setShowModal(true)}>
                  I'm ready to check out!
                </Button>
              </div>
            </div>
          </>
        )}

        {cartCount == 0 && (
          <>
            <h2 className="display-4">Your cart is empty!</h2>

            <div className="d-flex justify-content-center">
              <div className=" w-50 d-grid mt-4">
                <a className="btn btn-info" href="/inventory">
                  Go Shopping!
                </a>
              </div>
            </div>
          </>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Checking out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Thanks for using David's Grocery!</Modal.Body>
          <Modal.Footer className="d-grid justify-content-center">
            <Button variant="info" onClick={checkout}>
              I'm all done
            </Button>
          </Modal.Footer>
        </Modal>
      </AuthenticatedTemplate>
    </>
  );
}

export default CartView;