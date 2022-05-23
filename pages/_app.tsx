import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import Layout from '../components/layout';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../services/msal';
import GroceryServiceProvider from '../components/grocery-service-context';
import SignalRListener from '../components/signal-r-listener';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  
    return (
      <MsalProvider instance={msalInstance}>
        <SignalRListener>
          <GroceryServiceProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GroceryServiceProvider>
        </SignalRListener>
      </MsalProvider>
    );
  }

  export default App;