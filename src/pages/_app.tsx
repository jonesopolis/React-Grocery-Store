import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import Layout from '../components/layout';
import GroceryServiceProvider from '../components/grocery-service-context';
import SignalRListener from '../components/signal-r-listener';
import { AppProps } from 'next/app';
import { SessionProvider, useSession } from "next-auth/react"
import { AppInsightsErrorBoundaryWithSession, initializeAppInsights, trackPageView } from '../components/app-insights';

const App = ({ Component, pageProps, router }: AppProps) => {

  initializeAppInsights({ Component, pageProps, router }, {
    autoTrackPageVisitTime: true,
    disableFetchTracking: false,
    enableAjaxErrorStatusText: true,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true,
    autoExceptionInstrumented: true,
    enableAjaxPerfTracking: true,
    isBrowserLinkTrackingEnabled: true,
    connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
    appId: "ReactApp"
  });

  trackPageView({Component, pageProps, router });

  return (
    <SessionProvider session={pageProps.session}>
      <AppInsightsErrorBoundaryWithSession>
        <SignalRListener>
          <GroceryServiceProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GroceryServiceProvider>
        </SignalRListener>
      </AppInsightsErrorBoundaryWithSession>
    </SessionProvider>
  );
}

  export default App;