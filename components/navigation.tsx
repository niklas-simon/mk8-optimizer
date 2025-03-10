"use client";

import { Button } from "@heroui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { ChevronsRight } from "react-feather";

export interface NavigationItem {
    key: string;
    icon: ReactNode;
    content: ReactNode;
    className: string;
}

export const closeDrawer = () =>
    window.dispatchEvent(new CustomEvent("closeDrawer"));

export const CloseDrawerButton = ({ className }: { className?: string }) => (
    <Button
        isIconOnly
        className={className}
        variant="light"
        onPress={closeDrawer}
    >
        <ChevronsRight />
    </Button>
);

export const Navigation = ({ items }: { items: NavigationItem[] }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => setOpenItem(null);

        window.addEventListener("closeDrawer", handler);

        return () => window.removeEventListener("closeDrawer", handler);
    }, []);

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand className="gap-4">
                    <Image alt="Logo" height={48} src="/icon.png" width={48} />
                    MK8 Kart Optimizer
                </NavbarBrand>
                <NavbarContent className="flex xl:hidden" justify="end">
                    {items.map((item) => (
                        <NavbarItem key={item.key} className={item.className}>
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={() => setOpenItem(item.key)}
                            >
                                {item.icon}
                            </Button>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </Navbar>
            {items.map((item) => (
                <Drawer
                    key={item.key}
                    hideCloseButton
                    isOpen={openItem === item.key}
                    onClose={() => setOpenItem(null)}
                    onOpenChange={(o) => setOpenItem(o ? item.key : null)}
                >
                    <DrawerContent>{item.content}</DrawerContent>
                </Drawer>
            ))}
        </>
    );
};
