"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Bell,
  Bookmark,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { label: "Tasks", icon: Home, href: "/tasks" },
  { label: "Projects", icon: Search, href: "/projects" },
  { label: "Completed", icon: Bell, href: "/completed" },
  { label: "Archived", icon: Bookmark, href: "/archived" },
];

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if on mobile for responsive design
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed left-4 top-4 z-40"
          >
            <ChevronRight className="h-6 w-6 text-black dark:text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 bg-white text-black dark:bg-black dark:text-white"
        >
          <div className="h-full flex flex-col justify-between py-4">
            {/* Sidebar Header */}
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between px-4 py-2">
                <SheetTitle className="text-black dark:text-white">
                  Task Wise
                </SheetTitle>
                <SheetClose />
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    pathname === item.href
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      pathname === item.href
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white"
                    }`}
                  />
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Footer: Theme Toggle & User Options */}
            <div className="px-4 space-y-4">
              <Separator />
              <div className="flex flex-col items-center space-y-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 text-black dark:text-white" />
                  ) : (
                    <Moon className="h-6 w-6 text-black dark:text-white" />
                  )}
                </Button>

                {/* User Authentication */}
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <User className="h-6 w-6 text-black dark:text-white" />
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar with collapsible functionality
  return (
    <div
      className={`h-screen fixed left-0 top-0 z-40 flex flex-col justify-between py-4 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } border-r bg-white dark:bg-black dark:border-gray-800`}
    >
      {/* Sidebar Header */}
      <div className="space-y-2 px-2">
        <div className="flex items-center justify-between px-4 py-3">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold flex-1 text-black dark:text-white">
              Task Wise
            </h2>
          )}
          <div
            className={`${isCollapsed && "w-full"} flex ${!isCollapsed ? "justify-end" : "justify-center"}`}
          >
            <Button
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={
                "w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
              }
            >
              {isCollapsed ? (
                <ChevronRight className="h-6 w-6 text-black dark:text-white" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-black dark:text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={isCollapsed ? 300 : 10000}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg w-full ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 ${
                      pathname === item.href
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white"
                    }`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`ml-3 ${
                        pathname === item.href
                          ? "text-white dark:text-black"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer: Theme Toggle & User Options */}
      <div className="px-4 space-y-4">
        <Separator />
        <div className="flex flex-col items-center space-y-4">
          {/* Theme Toggle */}
          <TooltipProvider>
            <Tooltip delayDuration={isCollapsed ? 300 : 10000}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-3 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 text-black dark:text-white" />
                  ) : (
                    <Moon className="h-6 w-6 text-black dark:text-white" />
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* User Authentication */}
          <TooltipProvider>
            <Tooltip delayDuration={isCollapsed ? 300 : 10000}>
              <TooltipTrigger asChild>
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-3 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <User className="h-6 w-6" />
                    </Button>
                  </SignInButton>
                )}
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {isSignedIn ? "Account" : "Sign In"}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
