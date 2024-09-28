"use client";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { NavItemProps } from "@/types";


export const NavItem: React.FC<NavItemProps>  = ({
  icon,
  title,
  path,
  isActive
}) => {
  return (
    <li className="relative group/sm w-full group-data-[sidebar-size=sm]:hover:w-[calc(10_*_3.4)] group-data-[sidebar-size=sm]:flex-center">
        <a href={path} className={clsx(
                  isActive ? 'active' : '',
                  "relative text-gray-500 dark:text-dark-text-two font-medium leading-none px-3.5 py-3 h-[42px] flex items-center group/menu-link ac-transition group-data-[sidebar-size=sm]:bg-gray-100 dark:group-data-[sidebar-size=sm]:bg-dark-icon group-data-[sidebar-size=sm]:hover:bg-primary-500/95 group-data-[sidebar-size=sm]:[&.active]:bg-primary-500/95 hover:text-white [&.active]:text-white hover:!bg-primary-500/95 [&.active]:bg-primary-500/95 group-data-[sidebar-size=sm]:rounded-lg group-data-[sidebar-size=sm]:group-hover/sm:!rounded-br-none group-data-[sidebar-size=lg]:rounded-l-full group-data-[sidebar-size=sm]:p-3 group-data-[sidebar-size=sm]:w-full",
                )}>
            <span className="shrink-0 group-data-[sidebar-size=sm]:w-[calc(10_*_0.43)] group-data-[sidebar-size=sm]:flex-center">
                <Icon icon={icon} fontSize={16}/>
            </span>
            <span className="group-data-[sidebar-size=sm]:hidden group-data-[sidebar-size=sm]:ml-6 group-data-[sidebar-size=sm]:group-hover/sm:block ml-3 shrink-0">
                {title}
            </span>
        </a>
    </li>
  );
};
