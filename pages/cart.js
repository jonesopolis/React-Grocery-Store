import Table from 'react-bootstrap/Table';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getInventory } from '../src/inventory-repo';
import { cartRepo } from '../src/cart-repo';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import PubSub from 'pubsub-js';
import NumberFormat from 'react-number-format';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    var inventory = getInventory();

    let session = getSession(ctx.req, ctx.res);
    let cart = await cartRepo.getUserCart(session.user.email);

    let cartItems = cart.map(({ itemId, count }) => {
      var item = inventory.find((x) => x.id === itemId);

      return {
        itemId: itemId,
        title: item.title,
        count: count,
        price: item.price
      };
    });

    return {
      props: {
        inventory: inventory,
        cartItems: cartItems,
      },
    };
  }
});



export default function Profile({ cartItems }) {

  var intialCartCount = cartItems.map(x => x.count).reduce((partialSum, a) => partialSum + a, 0);
  var initialCartPrice = cartItems.map(x => x.count * x.price).reduce((partialSum, a) => partialSum + a, 0);

  const router = useRouter();
  const [cartCount, setCartCount] = useState(intialCartCount);
  const [cartPrice, setCartPrice] = useState(initialCartPrice);
  const [showModal, setShowModal] = useState(false);

  async function removeFromCart(itemId) {
    await fetch("/api/cart", {
      method: "PUT",
      body: itemId,
    })
      .then((res) => res.json())
      .then((count) => {
        setCartCount(count);
        PubSub.publish('cart-count', count);

        cartItems = cartItems.filter(x => x.itemId !== itemId);
        let newPrice = cartItems.map(x => x.count * x.price).reduce((partialSum, a) => partialSum + a, 0)
        setCartPrice(newPrice);
      });
  }

  async function checkout() {
    await fetch("/api/cart", {
      method: "DELETE",
    }).then(() => {
      PubSub.publish('cart-count', 0);
      router.push("/");
    });
  }

  return (
    <>
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
          <Button 
            variant='info'
            onClick={checkout}
          >
            I'm all done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
