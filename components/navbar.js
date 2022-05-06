import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { useUser } from '@auth0/nextjs-auth0';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { userAuth } from '../src/user-auth';

export default function MyNavbar() {
  const { user, isLoading } = useUser();
  const [cartCount, setCartCount] = useState(0);
  const [canManageInventory, setCanManageInventory] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    setCanManageInventory(userAuth.userIsShopkeep(user));

    fetch("/api/cart")
      .then((res) => res.json())
      .then((cart) => {
        let count = cart
          .map((x) => x.count)
          .reduce((partialSum, a) => partialSum + a, 0);
        setCartCount(count);
      });
  }, [isLoading]);
  

  PubSub.subscribe("cart-count", (msg, count) => {
    setCartCount(count);
  });

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
          {user && (
            <Navbar.Text>
              Welcome, <a href="/profile">{user.nickname}</a>!{" "}
              <span className="mx-2"></span>
              <a className="btn btn-sm btn-outline-info" href="/cart">
                <Badge bg="info">{cartCount}</Badge> Items in Your Cart
              </a>
              <span className="mx-4">|</span>
              <a
                className="btn btn-sm btn-outline-danger"
                href="/api/auth/logout"
                role="button"
              >
                Logout
              </a>
            </Navbar.Text>
          )}

          <Navbar.Text>
            {!user && !isLoading && (
              <a className="btn btn-outline-info" href="/api/auth/login">
                Login
              </a>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}