import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from 'react-admin';

import items from '../items';
import SubMenu from './SubMenu';

type MenuName = 'menuCatalog';

const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
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
            <DashboardMenuItem />
            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                name="pos.menu.catalog"
                icon={<items.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/items"
                    state={{_scrollToTop: true}}
                    primaryText={translate(`resources.items.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<items.icon/>}
                    dense={dense}
                    placeholder={undefined}
                />
            </SubMenu>
        </Box>
    );
};

export default Menu;
