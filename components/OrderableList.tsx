"use client";

import { Card, CardBody } from "@heroui/card";
import { ArrowDown, ArrowUp } from "react-feather";
import { Button, ButtonGroup } from "@heroui/button";

export interface Item {
    key: string;
    label: string;
}

export default function OrderableList({
    items,
    onChange,
}: {
    items: Item[];
    onChange: (items: Item[]) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item, i) => (
                <Card key={item.key} className="bg-default-100">
                    <CardBody className="flex flex-row items-center justify-between py-0 pr-0">
                        <span className="text-nowrap overflow-hidden">
                            {item.label}
                        </span>
                        <ButtonGroup>
                            <Button
                                isIconOnly
                                isDisabled={i === 0}
                                variant="light"
                                onPress={() => {
                                    onChange(
                                        items
                                            .slice(0, i - 1)
                                            .concat(
                                                items[i],
                                                items[i - 1],
                                                items.slice(i + 1),
                                            ),
                                    );
                                }}
                            >
                                <ArrowUp />
                            </Button>
                            <Button
                                isIconOnly
                                isDisabled={i === items.length - 1}
                                variant="light"
                                onPress={() => {
                                    onChange(
                                        items
                                            .slice(0, i)
                                            .concat(
                                                items[i + 1],
                                                items[i],
                                                items.slice(i + 2),
                                            ),
                                    );
                                }}
                            >
                                <ArrowDown />
                            </Button>
                        </ButtonGroup>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
