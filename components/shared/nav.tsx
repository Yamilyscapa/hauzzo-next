import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const menuItems = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Buscar", 
    href: "/search",
  },
  {
    label: "Soy asesor",
    href: "/",
  }
];

export default function Nav() {
  return (
    <>
      {/* Spacer to occupy the same space as the navbar */}
      <div className="h-20"></div>

      <nav className="flex fixed bg-background/50 backdrop-blur-sm top-0 left-0 right-0 z-25 items-center justify-between p-4 container mx-auto">
        <Link href="/">
          <Image src="/hauzzo-logo.png" alt="Hauzzo" width={100} height={100} />
        </Link>

        <Sheet>
          <SheetTrigger className="flex md:hidden p-4 pr-0">
            <Menu />
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader className="p-4 pr-0">
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-6 px-4">
              {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span>{item.label}</span>
                  </Link>
              ))}

              <Button className="mt-4 w-full">
                <Link href="/brokers/login">
                  <span>Iniciar sesión</span>
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <ul className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <span>{item.label}</span>
                  </Link>
              ))}
            <Button>
              <Link href="/brokers/login">
                <span>Iniciar sesión</span>
              </Link>
            </Button>
        </ul>
      </nav>
    </>
  );
}
