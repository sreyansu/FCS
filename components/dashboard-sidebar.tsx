"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, MessageSquare, Settings, Users, BarChart3, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState(false) // This state will be moved to layout

  const isAdmin = session?.user?.role === "admin"

  const userRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Forms",
      icon: FileText,
      href: "/dashboard/forms",
    },
    {
      label: "My Feedback",
      icon: MessageSquare,
      href: "/dashboard/my-feedback",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  const adminRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Form Management",
      icon: FileText,
      href: "/admin/dashboard/form-management",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/dashboard/users",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/dashboard/settings",
    },
  ]

  const routes = isAdmin ? adminRoutes : userRoutes

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-gray-900 border-r">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FeedbackFlow
            </span>
          </Link>

        </div>

        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
