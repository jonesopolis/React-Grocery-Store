import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import PubSub from 'pubsub-js';
import UserAuthService from '../services/user-auth-service';
import { useGroceryServices } from './grocery-service-context';
import { Cart } from '../models/user-cart';
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const MyNavbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [canManageInventory, setCanManageInventory] = useState(false);
  const [disableLogoutButton, setDisableLogoutButton] = useState(false);

  const { cartService } = useGroceryServices();

  const { data: session } = useSession();

  useEffect(() => {

    const checkAuth = async () => {
      if (!session) {
        return;
      }
      
      setCanManageInventory(UserAuthService.userIsShopkeep(session.user.roles));

      var cart = await cartService.getUserCart();
      let count = cart.map((x: Cart) => x.count).reduce((partialSum: number, a: number) => partialSum + a, 0);
      setCartCount(count);
    };

    checkAuth();
  }, [session]);

  PubSub.subscribe("cart-count", (_, count) => {
    setCartCount(count);
  });

  function logout() {
     signOut();
     setDisableLogoutButton(true);
  }

  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Image
            rounded
            alt="Logo"
            src="/img/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          David's Grocery
        </Navbar.Brand>

        <Nav>
          <Nav.Link href="/inventory">Inventory</Nav.Link>
        </Nav>

        {canManageInventory && (
          <Nav>
            <Nav.Link href="/manage-inventory">Manage Inventory</Nav.Link>
          </Nav>
        )}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse className="justify-content-end">
          {session && ( 
              <Navbar.Text>
                Welcome, <a href="/profile">{session.user?.email}</a>!{" "}
                <span className="mx-2"></span>
                <a className="btn btn-sm btn-outline-info" href="/cart-view">
                  <Badge bg="info">{cartCount}</Badge> Items in Your Cart
                </a>
                <span className="mx-4">|</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={logout}
                  disabled={disableLogoutButton}
                >
                  Logout
                </Button>
              </Navbar.Text>
          )}

          <Navbar.Text>
            {!session && ( 
              <Button
                variant="outline-info"
                onClick={() => signIn("azure-ad")}
              >
                Login
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;