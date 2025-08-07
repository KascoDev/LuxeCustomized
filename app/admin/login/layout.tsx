export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page should not use AdminLayout to avoid auth redirect loop
  return children
}