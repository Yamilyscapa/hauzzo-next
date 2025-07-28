import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "../ui/alert-dialog";

export default function Nav() {
  return (
    <>
      {/* Spacer to occupy the same space as the navbar */}
      <div className="h-20"></div>

      <nav className="flex fixed bg-background/50 backdrop-blur-sm top-0 left-0 right-0 z-25 items-center justify-between py-4 container mx-auto">
        <Link href="/">
          <Image src="/hauzzo-logo.png" alt="Hauzzo" width={100} height={100} />
        </Link>

        <AlertDialog>
          <AlertDialogTrigger className="flex md:hidden">
            <Menu />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogTrigger className="flex items-center justify-end p-2 cursor-pointer">
              <X />
            </AlertDialogTrigger>

            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>


          </AlertDialogContent>
        </AlertDialog>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link href="/">
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span>Propiedades</span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span>Soy asesor</span>
            </Link>
          </li>
          <li>
            <Button>
              <Link href="/">
                <span>Iniciar sesión</span>
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
}
