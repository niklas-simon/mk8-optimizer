"use client";

import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { applySettings } from "@/data/settings";

export default function SettingsLoader() {
    const router = useRouter();

    useEffect(() => {
        applySettings(router);
    }, []);

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Spinner />
        </div>
    );
}
