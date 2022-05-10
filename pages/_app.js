import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import Layout from '../components/layout';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../services/msal';
import { GroceryServiceProvider } from '../components/grocery-service-context';

export default function App({ Component, pageProps }) {
  
    return (
      <MsalProvider instance={msalInstance}>
        <GroceryServiceProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GroceryServiceProvider>
      </MsalProvider>
    );
  }