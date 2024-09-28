export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-y-7 sm:gap-7 card px-4 sm:px-10 2xl:px-[70px] py-15 lg:items-center lg:min-h-[calc(100vh_-_32px)]">
      {children}
    </div>
  );
}
