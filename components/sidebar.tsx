"use client";

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStateStore } from '@/hooks/authStateStore';
import { Button } from '@nextui-org/button';
import { Scrollbar } from 'smooth-scrollbar-react';
import { NavItem } from './navItem';

export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const removeToken = useAuthStateStore((state) => state.removeToken);

    const logout = () => {
        removeToken();
        // redirect to login
        setTimeout(() => {
            router.replace('/auth/login');
        }, 200);
    }

    const checkRole = (requiredRole: string, roleSlug?: string) => {
        if (requiredRole === "*") {
            return true;
        }
        if (requiredRole.indexOf("|") > -1) {
            const split = requiredRole.split("|");
            return split.includes(roleSlug!);
        } else {
            return requiredRole === roleSlug;
        }
    }

    const navbarItemData = [
        {title: "Home", icon: "streamline:dashboard-circle", path: "/account/home"},
        // {title: "Call Sessions", icon: "streamline:user-add-plus", path: "/dashboard/users"},
        // {title: "Voice Provider", icon: "streamline:bullet-list", path: "/dashboard/voice-provider"},
    ];

  return (
    <div id="app-menu-drawer" className="app-menu flex flex-col gap-y-2.5 bg-white dark:bg-dark-card w-app-menu fixed top-0 left-0 bottom-0 -translate-x-full group-data-[sidebar-size=sm]:min-h-screen group-data-[sidebar-size=sm]:h-max xl:translate-x-0 rounded-r-10 xl:rounded-15 xl:group-data-[sidebar-size=lg]:w-app-menu xl:group-data-[sidebar-size=sm]:w-app-menu-sm xl:group-data-[sidebar-size=sm]:absolute xl:group-data-[sidebar-size=lg]:fixed xl:top-4 xl:left-4 xl:group-data-[sidebar-size=lg]:bottom-4 z-backdrop ac-transition">
        <div className="px-4 h-header flex items-center shrink-0 group-data-[sidebar-size=sm]:px-2 group-data-[sidebar-size=sm]:justify-center">
            <a href="/dashboard/home" className="group-data-[sidebar-size=lg]:block hidden">
                <span className="flex flex-row justify-center items-center group-data-[theme-mode=dark]:hidden"><img src="/assets/images/logo/logo-icon.svg" alt="logo" className="size-7"/> <span className="font-semibold mx-2">MG VoIP</span></span>
                <span className="flex flex-row justify-center items-center group-data-[theme-mode=light]:hidden"><img src="/assets/images/logo/logo-icon.svg" alt="logo" className="size-7"/> <span className="font-semibold mx-2">MG VoIP</span></span>
            </a>
            <a href="/dashboard/home" className="group-data-[sidebar-size=lg]:hidden block">
                <img src="/assets/images/logo/logo-icon.svg" alt="logo"/>
            </a>
        </div>
        <div className="pl-4 group-data-[sidebar-size=sm]:pl-0 group-data-[sidebar-size=sm]:!overflow-visible !overflow-x-hidden smooth-scrollbar">
            <Scrollbar continuousScrolling={false} alwaysShowTracks={true}>
                <div className="group-data-[sidebar-size=lg]:max-h-full">
                    <ul id="navbar-nav" className="text-[14px] !leading-none space-y-1 group-data-[sidebar-size=sm]:space-y-2.5 group-data-[sidebar-size=sm]:flex group-data-[sidebar-size=sm]:flex-col group-data-[sidebar-size=sm]:items-start group-data-[sidebar-size=sm]:mx-2 group-data-[sidebar-size=sm]:overflow-visible">
                        {navbarItemData.map( (item, index) => (
                            <NavItem key={index} title={item.title} icon={item.icon} path={item.path} isActive={pathname === item.path}/>
                        ))}
                    </ul>
                </div>
            </Scrollbar>
        </div>
        
        <div className="mt-auto px-7 py-6 group-data-[sidebar-size=sm]:px-2">
            <Button type="button" fullWidth={true} onClick={logout} className="flex-center-between text-gray-500 dark:text-dark-text font-semibold leading-none bg-gray-200 dark:bg-[#090927] dark:group-data-[sidebar-size=sm]:bg-dark-card-shade rounded-[10px] px-6 py-4 group-data-[sidebar-size=sm]:p-[12px_8px] group-data-[sidebar-size=sm]:justify-center">
                <span className="group-data-[sidebar-size=sm]:hidden block">Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.66645 15.3328C6.66645 15.5096 6.59621 15.6792 6.47119 15.8042C6.34617 15.9292 6.17661 15.9995 5.9998 15.9995H1.33329C0.979679 15.9995 0.640552 15.859 0.390511 15.609C0.140471 15.3589 0 15.0198 0 14.6662V1.33329C0 0.979679 0.140471 0.640552 0.390511 0.390511C0.640552 0.140471 0.979679 0 1.33329 0H5.9998C6.17661 0 6.34617 0.0702357 6.47119 0.195256C6.59621 0.320276 6.66645 0.48984 6.66645 0.666645C6.66645 0.84345 6.59621 1.01301 6.47119 1.13803C6.34617 1.26305 6.17661 1.33329 5.9998 1.33329H1.33329V14.6662H5.9998C6.17661 14.6662 6.34617 14.7364 6.47119 14.8614C6.59621 14.9865 6.66645 15.156 6.66645 15.3328ZM15.8045 8.47139L12.4713 11.8046C12.378 11.898 12.2592 11.9615 12.1298 11.9873C12.0004 12.0131 11.8663 11.9999 11.7444 11.9494C11.6225 11.8989 11.5184 11.8133 11.4451 11.7036C11.3719 11.5939 11.3329 11.4649 11.333 11.333V8.66638H5.9998C5.823 8.66638 5.65343 8.59615 5.52841 8.47113C5.40339 8.34611 5.33316 8.17654 5.33316 7.99974C5.33316 7.82293 5.40339 7.65337 5.52841 7.52835C5.65343 7.40333 5.823 7.33309 5.9998 7.33309H11.333V4.66651C11.3329 4.53459 11.3719 4.4056 11.4451 4.29587C11.5184 4.18615 11.6225 4.10062 11.7444 4.05012C11.8663 3.99962 12.0004 3.98642 12.1298 4.01218C12.2592 4.03795 12.378 4.10152 12.4713 4.19486L15.8045 7.52809C15.8665 7.59 15.9156 7.66352 15.9492 7.74445C15.9827 7.82538 16 7.91213 16 7.99974C16 8.08735 15.9827 8.17409 15.9492 8.25502C15.9156 8.33595 15.8665 8.40948 15.8045 8.47139ZM14.3879 7.99974L12.6663 6.27563V9.72385L14.3879 7.99974Z" fill="currentColor"/>
                </svg>
            </Button>
        </div>
    </div>
  );
};
