import {dataProvider} from './dataProvider'
import items from './items'
import pages from './pages'
import users from './users'
import country from './country'
import orders from './orders'
import shipping_profile from './shipping_profile'
import shipping_rate from './shipping_rate'
import reviews from './reviews'
import social_media from './social_media'
import financial_details from './financial_details'
import {Admin, localStorageStore, Resource, useStore} from 'react-admin'
import {ThemeName, themes} from './themes/themes'
import {Layout} from './layout'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import englishMessages from './i18n/en'
import * as Sentry from '@sentry/react'
import {createRoutesFromChildren, matchRoutes, useLocation, useNavigationType,} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import GoogleLoginComponent from "./google/GoogleLoginComponent";

if (import.meta.env.VITE_APP_SENTRY !== 'null') {
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
                matchRoutes,
            }),
            Sentry.replayIntegration(),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
            'localhost',
            /^https:\/\/api\.dev\.faithfishart\.comi/,
        ],

        // Capture Replay for 100% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
    })
}

const i18nProvider = polyglotI18nProvider(
    (locale) => {
        if (locale === 'fr') {
            return import('./i18n/fr').then((messages) => messages.default)
        }

        // Always fallback on english
        return englishMessages
    },
    'en',
    [
        {locale: 'en', name: 'English'},
        {locale: 'fr', name: 'Français'},
    ],
)

const store = localStorageStore(undefined, 'ECommerce')

export const App = () => {
    const [themeName] = useStore<ThemeName>('themeName', 'house')
    const lightTheme = themes.find((theme) => theme.name === themeName)?.light
    const darkTheme = themes.find((theme) => theme.name === themeName)?.dark
    const [auth, setAuth] = useState(localStorage.getItem('auth'));

    useEffect(() => {
        const handleStorageChange = () => {
            setAuth(localStorage.getItem('auth'));
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [auth]);

    if (auth === null) {
        console.log("Not authenticated. Redirecting to login page.");
        return <GoogleLoginComponent/>;
    }
    console.log("Authenticated. Loading admin panel.");

    return (
        <Admin
            store={store}
            dataProvider={dataProvider}
            disableTelemetry
            layout={Layout}
            i18nProvider={i18nProvider}
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            loginPage={GoogleLoginComponent}
            defaultTheme="light"
        >
            <Resource
                name="api/v1/order/admin"
                {...orders}
                options={{label: 'Orders'}}
            />
            <Resource name="api/v1/socialmedia/admin" {...social_media} />
            <Resource name="api/v1/item/admin" {...items} />
            <Resource name="api/v1/page/admin" {...pages} />
            <Resource name="api/v1/financialdetails/admin" {...financial_details} />
            <Resource name="api/v1/user/admin" {...users} />
            <Resource name="api/v1/user/admin" {...users} />
            <Resource name="api/v1/country/admin" {...country} />
            <Resource name="api/v1/shippingprofile/admin" {...shipping_profile} />
            <Resource name="api/v1/shippingrate/admin" {...shipping_rate} />
            <Resource name="api/v1/review/admin" {...reviews} />
        </Admin>
    )
}
