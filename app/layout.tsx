import "@/styles/globals.css";
import "@/styles/app.css";
import "react-toastify/dist/ReactToastify.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html suppressHydrationWarning lang="en" className="group" data-sidebar-size="lg" data-theme-mode="light">
      <head />
      <body className="bg-body-light dark:bg-dark-body">
      <ToastContainer
          closeOnClick
          pauseOnFocusLoss
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          position="top-right"
          rtl={false}
          theme="light"
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
        <Script type="text/javascript" src="/assets/js/africastalking.js" />
      </body>
    </html>
  );
}
