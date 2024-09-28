export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-4">
      {children}
    </div>
  );
}
