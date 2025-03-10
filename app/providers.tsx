"use client";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export function Providers({ children }: ProvidersProps) {
    const router = useRouter();

    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const matcher = window.matchMedia("(prefers-color-scheme: dark)");

        setTheme(matcher.matches ? "dark" : "light");

        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };

        matcher.addEventListener("change", handler);

        return () => matcher.removeEventListener("change", handler);
    }, []);

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <main
                    className={`w-screen h-screen overflow-y-hidden overflow-x-auto text-foreground bg-background ${theme} flex flex-col`}
                >
                    {children}
                </main>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
