import {useState} from 'react';
import Box from '@mui/material/Box';

import {DashboardMenuItem, MenuItemLink, MenuProps, useSidebarState, useTranslate,} from 'react-admin';

import orders from '../orders';
import items from '../items';
import pages from '../pages';
import users from '../users';
import financial_details from '../financial_details';
import country from '../country';
import shipping_profile from '../shipping_profile';
import shipping_rate from '../shipping_rate';
import SubMenu from './SubMenu';

type MenuName = 'menuCatalog' | 'menuSales' | 'menuPages' | 'menuUsers' | 'menuShipping';

const Menu = ({dense = false}: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuPages: true,
        menuUsers: true,
        menuShipping: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({...state, [menu]: !state[menu]}));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem/>
            <SubMenu
                handleToggle={() => handleToggle('menuSales')}
                isOpen={state.menuSales}
                name="pos.menu.sales"
                icon={<orders.icon/>}
                dense={dense}
            >
                <MenuItemLink
                    to="/api/v1/order/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.sales.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<orders.icon/>}
                    dense={dense}
                />
                <MenuItemLink
                    to="/api/v1/financialdetails/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.financial_details.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<financial_details.icon/>}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu dense={dense}
                     handleToggle={() => handleToggle('menuPages')}
                     icon={<pages.icon/>}
                     isOpen={state.menuPages}
                     name="pos.menu.pages"
            >
                <MenuItemLink
                    to="api/v1/page/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.pages.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<pages.icon/>}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu dense={dense}
                     handleToggle={() => handleToggle('menuShipping')}
                     icon={<country.icon/>}
                     isOpen={state.menuShipping}
                     name="pos.menu.shipping"
            >
                <MenuItemLink
                    to="api/v1/country/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.country.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<country.icon/>}
                    dense={dense}
                />
                <MenuItemLink
                    to="api/v1/shippingprofile/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.shipping_profile.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<shipping_profile.icon/>}
                    dense={dense}
                />
                <MenuItemLink
                    to="api/v1/shippingrate/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.shipping_rate.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<shipping_rate.icon/>}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu dense={dense}
                     handleToggle={() => handleToggle('menuUsers')}
                     icon={<users.icon/>}
                     isOpen={state.menuUsers}
                     name="pos.menu.users"
            >
                <MenuItemLink
                    to="api/v1/user/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.users.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<users.icon/>}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                name="pos.menu.catalog"
                icon={<items.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="api/v1/item/admin"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.items.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<items.icon/>}
                    dense={dense}
                />
            </SubMenu>
        </Box>
    );
};

export default Menu;
