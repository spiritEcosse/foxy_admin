import {dataProvider} from "./dataProvider";
import {authProvider} from "./authProvider";
import items from './items';
import pages from './pages';
import users from './users';
import country from './country';
import shipping_profile from './shipping_profile';
import shipping_rate from './shipping_rate';
import {Admin, Resource, useStore, localStorageStore} from 'react-admin';
import { themes, ThemeName } from './themes/themes';
import { Layout } from './layout';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/en';
import * as Sentry from "@sentry/react";
import { useLocation } from 'react-router-dom';
import { useNavigationType } from 'react-router-dom';
import { createRoutesFromChildren } from 'react-router-dom';
import { matchRoutes } from 'react-router-dom';
import React from 'react';


if (import.meta.env.VITE_APP_SENTRY !== "null") {
    Sentry.init({
        dsn: import.meta.env.VITE_APP_SENTRY,
        integrations: [
            // See docs for support of different versions of variation of react router
            // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
            Sentry.reactRouterV6BrowserTracingIntegration({
                useEffect: React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            }),
            Sentry.replayIntegration()
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/api\.dev\.faithfishart\.comi/],

        // Capture Replay for 100% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
    });
}

const i18nProvider = polyglotI18nProvider(
    locale => {
        if (locale === 'fr') {
            return import('./i18n/fr').then(messages => messages.default);
        }

        // Always fallback on english
        return englishMessages;
    },
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);

const store = localStorageStore(undefined, 'ECommerce');

export const App = () => {
    const [themeName] = useStore<ThemeName>('themeName', 'house');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;

    return (
        <Admin
               store={store}
               dataProvider={dataProvider}
               authProvider={authProvider}
               disableTelemetry
               layout={Layout}
               i18nProvider={i18nProvider}
               lightTheme={lightTheme}
               darkTheme={darkTheme}
               defaultTheme="light"
        >
            <Resource name="api/v1/item/admin" {...items} />
            <Resource name="api/v1/page/admin" {...pages} />
            <Resource name="api/v1/user/admin" {...users} />
            <Resource name="api/v1/user/admin" {...users} />
            <Resource name="api/v1/country/admin" {...country} />
            <Resource name="api/v1/shippingprofile/admin" {...shipping_profile} />
            <Resource name="api/v1/shippingrate/admin" {...shipping_rate} />
        </Admin>
    );
};
