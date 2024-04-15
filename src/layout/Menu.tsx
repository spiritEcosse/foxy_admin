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
import pages from '../pages';
import users from '../users';
import SubMenu from './SubMenu';

type MenuName = 'menuCatalog' | 'menuPages' | 'menuUsers';

const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuPages: true,
        menuUsers: true,
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
            <SubMenu dense={dense}
                     handleToggle={() => handleToggle('menuPages')}
                     icon={<pages.icon />}
                     isOpen={state.menuPages}
                     name="pos.menu.pages"
            >
                <MenuItemLink
                    to="api/v1/page/admin"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.pages.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<pages.icon />}
                    dense={dense}
                    placeholder={undefined}
                />
            </SubMenu>
            <SubMenu dense={dense}
                     handleToggle={() => handleToggle('menuUsers')}
                     icon={<users.icon />}
                     isOpen={state.menuUsers}
                     name="pos.menu.users"
            >
                <MenuItemLink
                    to="api/v1/user/admin"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.users.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<users.icon />}
                    dense={dense}
                    placeholder={undefined}
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
                    placeholder={undefined}
                />
            </SubMenu>
        </Box>
    );
};

export default Menu;
