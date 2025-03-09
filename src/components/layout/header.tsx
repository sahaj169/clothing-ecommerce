"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCartStore } from "@/lib/store/cart-store";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Men",
    href: "/men",
    submenu: [
      { name: "T-Shirts", href: "/men/tshirts" },
      { name: "Shirts", href: "/men/shirts" },
      { name: "Jeans", href: "/men/jeans" },
      { name: "Jackets", href: "/men/jackets" },
      { name: "Formal", href: "/men/formal" },
    ],
  },
  {
    name: "Women",
    href: "/women",
    submenu: [
      { name: "Dresses", href: "/women/dresses" },
      { name: "Tops", href: "/women/tops" },
      { name: "Jeans", href: "/women/jeans" },
      { name: "Sarees", href: "/women/sarees" },
      { name: "Ethnic", href: "/women/ethnic" },
    ],
  },
  {
    name: "Kids",
    href: "/kids",
    submenu: [
      { name: "Boys", href: "/kids/boys" },
      { name: "Girls", href: "/kids/girls" },
      { name: "Infants", href: "/kids/infants" },
    ],
  },
  { name: "Sale", href: "/sale" },
  { name: "New Arrivals", href: "/new-arrivals" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const totalItems = useCartStore((state) => state.totalItems());

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold">StyleHub</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`flex items-center text-sm font-semibold leading-6 ${
                    pathname === item.href ||
                    pathname?.startsWith(item.href + "/")
                      ? "text-indigo-600"
                      : "text-gray-900 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-semibold leading-6 ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-900 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                </Link>
              )}

              {/* Dropdown menu */}
              {item.submenu && activeSubmenu === item.name && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setActiveSubmenu(null)}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
          <div className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6 flex-shrink-0 text-gray-400 hover:text-gray-500" />
            </Link>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white">
                {totalItems}
              </span>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <div className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold">StyleHub</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                              pathname === item.href ||
                              pathname?.startsWith(item.href + "/")
                                ? "text-indigo-600"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                activeSubmenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {activeSubmenu === item.name && (
                            <div className="mt-2 space-y-2 pl-7">
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  href={subitem.href}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subitem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                            pathname === item.href
                              ? "text-indigo-600"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/account"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>My Account</span>
                        </div>
                      </Link>
                      <div className="relative inline-block">
                        <Link
                          href="/cart"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Cart</span>
                          </div>
                        </Link>
                        {totalItems > 0 && (
                          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white">
                            {totalItems}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setMobileMenuOpen(false);
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
