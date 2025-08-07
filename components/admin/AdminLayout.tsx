"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  FileText
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAdminAuth } from "@/hooks/useAdminAuth"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    name: "Orders",
    href: "/admin/orders", 
    icon: ShoppingCart,
    description: "Manage customer orders"
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Manage digital templates"
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
    description: "Organize product categories"
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    description: "Customer management"
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Sales & performance"
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Store configuration"
  }
]

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const Icon = item.icon

  const handleClick = () => {
    // Auto-minimize sidebar on mobile when navigating
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px] ${
        isActive
          ? "bg-stone-700 text-white"
          : "text-stone-300 hover:text-white hover:bg-stone-700"
      }`}
    >
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
      <div className="flex flex-col">
        <span>{item.name}</span>
        <span className="text-xs text-stone-400 group-hover:text-stone-300">
          {item.description}
        </span>
      </div>
    </Link>
  )
}

function SidebarContent({ user, handleSignOut, onNavigate }: { user: any, handleSignOut: () => void, onNavigate?: () => void }) {
  const handleLogoClick = () => {
    // Auto-minimize sidebar on mobile when clicking logo
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="flex flex-col h-full bg-stone-800 text-white">
      {/* Logo */}
      <div className="flex items-center px-4 sm:px-6 py-4 sm:py-6 border-b border-stone-700">
        <Link href="/admin" onClick={handleLogoClick} className="flex items-center">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-stone-900 font-bold text-sm">L</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-white truncate">LuxeCustomized</h1>
            <p className="text-xs text-stone-400">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink key={item.name} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 sm:p-6 border-t border-stone-700 flex-shrink-0">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-stone-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
            <p className="text-stone-400 text-xs">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-stone-300 hover:text-white hover:bg-stone-700"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, signOut } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [loading, user, router, pathname])

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
        <div>Loading authentication...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-stone-900 dark" data-admin-layout>
      {/* Mobile header with menu button */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-stone-800 border-b border-stone-700 h-16 flex items-center px-4 backdrop-blur-sm bg-stone-800/95">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-stone-800 border-r-0 w-80 max-w-[80vw] sm:max-w-80">
            <SidebarContent user={user} handleSignOut={handleSignOut} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="ml-4 flex-1">
          <h1 className="text-white font-serif font-bold text-lg">LuxeCustomized</h1>
          <p className="text-stone-400 text-xs">Admin Dashboard</p>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 z-30">
          <SidebarContent user={user} handleSignOut={handleSignOut} />
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 lg:pl-80">
          <main className="flex-1 pt-16 lg:pt-0 px-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
