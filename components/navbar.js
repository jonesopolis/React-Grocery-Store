import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { userAuth } from '../src/user-auth';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { useGroceryServices } from '../components/grocery-service-context';


function MyNavbar() {
  const [cartCount, setCartCount] = useState(0);
  const [canManageInventory, setCanManageInventory] = useState(0);
  const [disableLogoutButton, setDisableLogoutButton] = useState(false);

  const { instance, accounts } = useMsal();  
  const account = useAccount(accounts[0]);
  const isAuthenticated = useIsAuthenticated();

  const { cartService } = useGroceryServices();

  useEffect(async () => {
    
    if (!isAuthenticated) {
      return;
    }

    setCanManageInventory(userAuth.userIsShopkeep(account));

    var cart = await cartService.getUserCart();
    let count = cart.map((x) => x.count).reduce((partialSum, a) => partialSum + a, 0);
    setCartCount(count);
      
  }, [isAuthenticated]);
  

  PubSub.subscribe("cart-count", (msg, count) => {
    setCartCount(count);
  });

  function logout() {
     instance.logoutRedirect();
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
          <AuthenticatedTemplate>
            <Navbar.Text>
              Welcome, <a href="/profile">{account?.username}</a>!{" "}
              <span className="mx-2"></span>
              <a className="btn btn-sm btn-outline-info" href="/cart">
                <Badge bg="info">{cartCount}</Badge> Items in Your Cart
              </a>
              <span className="mx-4">|</span>
              <Button
                variant='outline-danger'
                size='sm'
                onClick={logout}
                disabled={disableLogoutButton}
              >
                Logout
              </Button>
            </Navbar.Text>
          </AuthenticatedTemplate>

          <Navbar.Text>
            <UnauthenticatedTemplate>
              <Button variant='outline-info' onClick={() => instance.loginRedirect()}>
                Login
              </Button>
            </UnauthenticatedTemplate>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;