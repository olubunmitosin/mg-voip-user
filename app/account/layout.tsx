import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header/>
      <Sidebar/>
      <div className="main-content group-data-[sidebar-size=lg]:xl:ml-[calc(280px_+_16px)] group-data-[sidebar-size=sm]:xl:ml-[calc(56px_+_16px)] px-4 ac-transition">
        {children}
      </div>
    </>
  );
}
