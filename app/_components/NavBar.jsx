"use client";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { GithubIcon, Menu } from "lucide-react";

export const NavBar = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">Pages</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/">Home</Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Link href="/results">Results</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          Project Links
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link
              href="https://github.com/Venu005/backend"
              className="flex items-center justify-center"
            >
              <GithubIcon className="mr-2" /> <span>Github (Backend)</span>
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link
              href="https://github.com"
              className="flex items-center justify-center"
            >
              <GithubIcon className="mr-2" /> <span>Github (Frontend)</span>
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
