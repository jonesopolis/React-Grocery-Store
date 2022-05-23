import Container from 'react-bootstrap/Container';
import MyNavbar from './navbar'
import Head from 'next/head'
import Image from 'next/image';
import groceryImg from '../public/img/grocery.png'
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Head>
      <title>David's Grocery</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <MyNavbar></MyNavbar>
    <Container className="main-container">{children}</Container>
    <footer className="bg-dark py-3 fixed-bottom">
      <Container>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Image
            src={groceryImg}
            layout={"fill"}
            objectFit={"contain"}
            alt="David's Grocery"
            className="mt-2"
          />
        </a>
      </Container>
    </footer>
  </>
);

export default Layout;
