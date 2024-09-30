"use client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeSwitch } from "../theme-switch";
import { playpenSans } from "@/fonts/fonts";
import { useEffect, useState } from "react";
import Hamburger from "@/assets/Hamburger";
import Logo from "@/assets/Logo";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const scrolledClasses =
  "p-1 bg-background/50 sticky top-0 backdrop-blur border-b z-10";
const unscrolledClasses = "p-3 flex border-b";

interface NavItems {
  slug: string;
  displayStr: string;
  href: string;
}

const navItems: NavItems[] = [
  {
    slug: "home",
    displayStr: "Home",
    href: "/",
  },
  {
    slug: "about",
    displayStr: "About",
    href: "/about",
  },
  {
    slug: "contact",
    displayStr: "Contact Us",
    href: "/contact",
  },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();

  const scrollEffect = () => {
    if (window.scrollY >= 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollEffect);

    return () => {
      window.removeEventListener("scroll", scrollEffect);
    };
  }, []);

  const standardNavItems = (className: string) => {
    return (
      <>
        {navItems.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className={className}
            prefetch={false}
          >
            {item.displayStr}
          </Link>
        ))}

        {session.status === "authenticated" ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                signOut();
              }}
            >
              Signout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="default"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/auth/register")}
            >
              Signup
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <header className={`${scrolled ? scrolledClasses : unscrolledClasses}`}>
      <div className="w-full flex justify-between items-center lg:flex-row flex-row-reverse h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Hamburger className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetTitle className="flex md:hidden font-bold">Quillzo</SheetTitle>
          <SheetContent side="right">
            <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
              <Logo className="h-[50px] w-[50px]" />
              <span className="sr-only">Quillzo</span>
            </Link>
            <div className="grid gap-2 py-6">
              {standardNavItems(
                "flex w-full items-center py-2 text-lg font-semibold"
              )}
              <ThemeSwitch />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex" prefetch={false}>
          <div className="flex justify-center items-center gap-5">
            <Logo className="lg:h-[50px] md:h-[40px] lg:w-[50px] md:w-[40px] h-[55px] w-[55px]" />
            <span
              className={`hidden md:flex ${playpenSans.className} font-bold lg:text-2xl md:text-xl`}
            >
              Quillzo
            </span>
          </div>
        </Link>
        <nav className="ml-auto hidden lg:flex lg:items-center gap-6">
          {standardNavItems(
            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          )}

          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}
