"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStateStore } from "@/hooks/authStateStore";
import {CircularProgress} from "@nextui-org/progress";

export default function Landing() {
  const router = useRouter();
  const accessToken = useAuthStateStore((state) => state.access_token);

  // check that this access token is still valid and use, then redirect to dashboard. else, logout and redirect to login page.
  const checkAndSetRedirect = () => {
    if (accessToken === "") {
      setTimeout(() => {
        router.replace('/auth/login');
      }, 2000);
    } else {
      setTimeout(() => {
        router.replace('/account/home');
      }, 2000);
    }
  }

  // Call once
  useEffect(() => {
    checkAndSetRedirect();
  }, [accessToken, router]);

  return (
    <div className="grid grid-cols-12 gap-y-7 sm:gap-7 card px-4 sm:px-10 2xl:px-[70px] py-15 lg:items-center lg:min-h-[calc(100vh_-_32px)]">
      <div className="col-span-full lg:col-span-12">
        <div className="flex flex-col items-center justify-center gap-10 text-center">
          <CircularProgress color="primary" aria-label="Loading..." label="Please wait.."/>
        </div>
      </div>
    </div>
  );
}
