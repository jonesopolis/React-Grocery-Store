import React, { Component, useEffect } from 'react';
import { AppProps } from 'next/app';
import { ApplicationInsights, IConfiguration, IConfig, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { SeverityLevel } from '@microsoft/applicationinsights-common';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

const IS_BROWSER = typeof window !== 'undefined';

declare global {
  interface Window {
    appInsights?: ApplicationInsights;
  }
}

export function loadAppInsights(appInsights: ApplicationInsights) {
  if (!appInsights) {
    return;
  }
  appInsights.loadAppInsights();
  const telemetryInitializer = (telemetry: ITelemetryItem) => {
    telemetry.tags && (telemetry.tags['ai.cloud.role'] = window.location.origin);
  };
  appInsights.addTelemetryInitializer(telemetryInitializer);
  window.appInsights = appInsights;
}

/**
 *  Initializes Application Insights, if not already initialized, with the specified app configuration, user and config.
 */
export function initializeAppInsights(props: AppProps, config?: IConfiguration & IConfig): void {
  
  // if running on the server or in dev mode, don't initialize appInsights
  if (!IS_BROWSER){
    return;
  }

  // if appInsights is already initialized, don't initialize again
  if (window.appInsights) {
    return;
  }

  if (config) {
    // If config is provided but yet an instrumentation key is provided in props, use it instead
    if (!config.instrumentationKey && props.pageProps.appInsightsInstrumentationKey) {
      config.instrumentationKey = props.pageProps.appInsightsInstrumentationKey;
    }

    const appInsights = new ApplicationInsights({ config });
    loadAppInsights(appInsights);
  }
  // if no config is provided, but an instrumentation key is, create a new config and use it.
  else if (!config && props.pageProps.appInsightsInstrumentationKey) {
    const appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: props.pageProps.appInsightsInstrumentationKey,
      },
    });
    loadAppInsights(appInsights);
  }
}

export function trackPageView(props: AppProps) {
  if (!IS_BROWSER || !window.appInsights) {
    return;
  }
  const name = props.Component.displayName || props.Component.name || location.pathname;
  const properties: any = {
    route: props.router.route,
  };
  if (props.router.query) {
    for (const key in props.router.query) {
      properties[`query.${key}`] = props.router.query[key];
    }
  }
  window.appInsights.trackPageView({ name, properties });
}

interface IAppInsightsErrorBoundaryProps {
  onError: React.ComponentType<any>;
}

interface IAppInsightsErrorBoundaryState {
  hasError: boolean;  
}

export const AppInsightsErrorBoundaryWithSession = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session && window.appInsights) {
      try {
        console.log('WE ARE AUTH')
        window.appInsights.setAuthenticatedUserContext(session?.user?.email, session?.user?.sub, true);
      } catch {
        // Do Nothing.
      }
    }
  }, [session])  

  const props = {
    onError: () => <h1>An error occurred</h1>
  }

  return (
    <AppInsightsErrorBoundary {...props}>
      {children}
    </AppInsightsErrorBoundary>
  )
}


class AppInsightsErrorBoundary extends React.Component<IAppInsightsErrorBoundaryProps, IAppInsightsErrorBoundaryState> {
  state = { hasError: false };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    if (!IS_BROWSER || !window.appInsights) {
      return;
    }

    window.appInsights.trackException({
      error: error,
      exception: error,
      severityLevel: SeverityLevel.Error,
      properties: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      const { onError } = this.props;
      return React.createElement(onError);
    }

    return (this.props as any).children;
  }
}