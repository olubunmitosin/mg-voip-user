"use client";

import { CardProps } from "@/types";
import { Icon } from "@iconify/react";

export const Card: React.FC<CardProps>  = ({
  icon,
  title,
  value
}) => {
  return (
    <div className="card col-span-full md:col-span-6 xl:col-span-3 p-5 rounded-20 flex flex-col gap-8 bg-card-pattern dark:bg-card-pattern-dark bg-no-repeat bg-100% mb-0">
      <div className="flex-center-between">
          <h6 className="leading-none text-gray-500 dark:text-dark-text font-semibold">{title}</h6>
          <div className="size-11 rounded-lg text-primary-500 dark:text-white bg-primary-200 dark:bg-dark-icon flex-center">
              <Icon icon={icon} fontSize={18}/>
          </div>
      </div>
      <div className="mt-auto">
          <div className="card-title text-[32px]">
              <span className="counter-value">{value}</span>
          </div>
          <div className="leading-none text-gray-500 dark:text-dark-text mt-2">&nbsp;</div>
      </div>
  </div>
  );
};
