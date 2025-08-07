"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { usePathname } from "next/navigation"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // If on login page, don't wrap with AdminLayout to avoid auth redirect loop
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  return <AdminLayout>{children}</AdminLayout>
}