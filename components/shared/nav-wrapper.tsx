"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "./nav";

export default function NavWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Don't render navbar on admin routes and auth routes
  const adminRoutes = ["/dashboard"];
  const isAdminRoute = adminRoutes.some((route) => pathname?.startsWith(route));

  if (isAdminRoute) {
    return null;
  }

  return <Nav />;
}
