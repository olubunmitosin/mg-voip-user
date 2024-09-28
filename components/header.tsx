"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import { useAuthStateStore } from "@/hooks/authStateStore";
import {  Dropdown, DropdownTrigger,  DropdownMenu,  DropdownItem} from "@nextui-org/dropdown";
import { User } from "@nextui-org/react";

export const Header = () => {
    const user = useAuthStateStore((state) => state.user);

    const toggleItem = useAuthStateStore((state) => state.toggleItem);

    const toggleMenu = () => {
        const header: HTMLElement = document.querySelector("html")!;
        const layoutSize = header.getAttribute("data-sidebar-size");
        let size;
        if (layoutSize == 'lg') {
            size = 'sm';
        } else {
            size = 'lg';
        }
        // Set layout size
        header.setAttribute("data-sidebar-size", size);
        // set state in case of refresh
        toggleItem(size);
    }

  return (
    <header className="header px-4 sm:px-6 h-[40px_-_10px)] sm:h-header bg-white dark:bg-dark-card rounded-none xl:rounded-15 flex items-center mb-4 xl:m-4 group-data-[sidebar-size=lg]:xl:ml-[calc(280px_+_32px)] group-data-[sidebar-size=sm]:xl:ml-[calc(56px_+_32px)] ac-transition">
      <div className="flex-center-between grow">
        <div className="flex items-center gap-4">
            <div className="menu-hamburger-container flex-center">
                <button type="button" onClick={toggleMenu} className="menu-hamburger hidden xl:block"></button>
                <button type="button" onClick={toggleMenu}  className="menu-hamburger block xl:hidden" data-drawer-target="app-menu-drawer" data-drawer-show="app-menu-drawer" aria-controls="app-menu-drawer"></button>
            </div>
            
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3">
            <ThemeSwitch />
            <div className="w-[1px] h-[calc(15px_-_10px)] sm:h-header bg-[#EEE] dark:bg-dark-border hidden sm:block"></div>

            <div className="relative">
                <Dropdown showArrow placement="bottom-start" classNames={{ 
                    base: "text-gray-500 dark:text-dark-text flex items-center gap-2 sm:pr-4 relative after:absolute after:right-0 after:font-remix after:content-['\ea4e'] after:text-[18px] after:hidden sm:after:block",
                    content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black"
                 }}>
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{
                            isBordered: true,
                            src: "/assets/images/user/profile-img.png",
                            }}
                            classNames={{
                                name: "font-semibold leading-none text-lg capitalize hidden sm:block transition-transform",
                                description: "hidden sm:block"
                            }}
                            description={'@' +user?.name}
                            name={user?.name}
                        />
                    </DropdownTrigger>

                    <DropdownMenu aria-label="User Actions" variant="faded">
                        <DropdownItem key="profile" textValue="profile" className="h-14 gap-2">
                            <p className="font-bold">Signed in as</p>
                            <p className="font-bold">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="settings" textValue="profile">My Profile</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
      </div>
    </header>
  );
};
