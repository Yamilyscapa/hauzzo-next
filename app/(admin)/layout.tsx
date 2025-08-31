"use client";
import {
  Home,
  Settings,
  ChevronUp,
  User2,
  Users,
  UserSearch,
  House,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Menu items
const items = [
  {
    title: "Panel de control",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Brokers",
    url: "/dashboard/brokers",
    icon: Users,
  },
  {
    title: "Clientes",
    url: "/dashboard/clients",
    icon: UserSearch,
  },
  {
    title: "Propiedades",
    url: "/dashboard/properties",
    icon: House,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, checking, logout } = useAuth();

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.replace("/brokers/login");
    }
  }, [checking, isAuthenticated, router]);

  return (
    <SidebarProvider>
      <SidebarTrigger className="p-4 ml-4 mt-4" />
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    <span>{user?.name || user?.email || "Usuario"}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {!checking && isAuthenticated ? children : null}
      </SidebarInset>
    </SidebarProvider>
  );
}
