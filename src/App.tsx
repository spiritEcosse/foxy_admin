import {dataProvider} from "./dataProvider";
import {authProvider} from "./authProvider";
import items from './items';
import {Admin, Resource, useStore, localStorageStore} from 'react-admin';
import { themes, ThemeName } from './themes/themes';
import { Layout, Login } from './layout';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/en';


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
        <Admin loginPage={Login}
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
        </Admin>
    );
};
