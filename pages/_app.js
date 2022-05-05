import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import Layout from '../components/layout';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function App({ Component, pageProps }) {
    return (
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    );
  }