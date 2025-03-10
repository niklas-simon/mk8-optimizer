"use client";

import { Pagination as PageSettings, Pagination } from "@heroui/pagination";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Key } from "@react-types/shared";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import AvatarList from "./AvatarList";

import { Combination } from "@/data/constants";
import Selection from "@/data/selection";

interface Column {
    key: string;
    text: string;
    draw: (item: Combination) => ReactNode;
}

const columns: Record<string, Column> = {
    driver: {
        key: "driver",
        text: "Driver",
        draw: (item) => <AvatarList avatars={item.driver.avatars} />,
    },
    body: {
        key: "body",
        text: "Body",
        draw: (item) => <AvatarList avatars={item.body.avatars} />,
    },
    tire: {
        key: "tire",
        text: "Tire",
        draw: (item) => <AvatarList avatars={item.tire.avatars} />,
    },
    glider: {
        key: "glider",
        text: "Glider",
        draw: (item) => <AvatarList avatars={item.glider.avatars} />,
    },
};

export interface PageSettings {
    page: number;
    total: number;
}

function Paginator({ pagination }: { pagination: PageSettings }) {
    const router = useRouter();

    return (
        <div className="flex flex-row justify-end gap-4 flex-1">
            <Pagination
                isCompact
                showControls
                page={pagination.page}
                total={pagination.total}
                onChange={(page) => {
                    const url = new URL(window.location.href);

                    url.searchParams.set("page", String(page));

                    router.push(url.toString());
                }}
            />
        </div>
    );
}

export default function CombinationsGrid({
    combinations,
    pagination,
}: {
    combinations: Combination[];
    pagination: PageSettings;
}) {
    const [selected, setSelected] = useState<Set<Key> | null>(null);

    useEffect(() => {
        setSelected(new Set<Key>(["0"]));
    }, []);

    useEffect(() => {
        if (!selected) {
            return;
        }

        Selection.getInstance().set(Array.from(selected).map(Number));
    }, [selected]);

    return (
        <Card className="flex-1 overflow-y-hidden">
            <CardHeader>
                <Paginator pagination={pagination} />
            </CardHeader>
            <CardBody>
                {selected !== null ? (
                    <Table
                        removeWrapper
                        disabledKeys={
                            selected.size >= 5
                                ? combinations
                                      .map((v, i) => String(i))
                                      .filter((i) => !selected.has(i))
                                : []
                        }
                        selectedKeys={selected}
                        selectionMode="multiple"
                        onSelectionChange={(s) => {
                            if (s == "all") {
                                setSelected(new Set(["0"]));
                            } else {
                                setSelected(s);
                            }
                        }}
                    >
                        <TableHeader columns={Object.values(columns)}>
                            {(column) => (
                                <TableColumn key={column.key}>
                                    {column.text}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={combinations.map((c, i) => ({
                                ...c,
                                index: i,
                            }))}
                        >
                            {(item) => (
                                <TableRow key={item.index}>
                                    {(key) => (
                                        <TableCell key={key}>
                                            {columns[key].draw(item)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
