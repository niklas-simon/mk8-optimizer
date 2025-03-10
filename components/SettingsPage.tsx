"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Slider } from "@heroui/slider";
import { RefreshCcw, RefreshCw } from "react-feather";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { DrawerContent, DrawerHeader, DrawerBody } from "@heroui/drawer";

import OrderableList from "./OrderableList";
import PartSelect from "./PartSelect";
import { closeDrawer, CloseDrawerButton } from "./navigation";

import { Driver, PartsCollection, Body } from "@/data/constants";
import {
    applySettings,
    defaultFilter,
    defaultStats,
    Filter,
    getFilter,
    getOpenGroups,
    getOptions,
    getStats,
    Options,
    saveFilter,
    saveOpenGroups,
    saveOptions,
    saveStats,
    Stat,
} from "@/data/settings";

export default function SettingsPage({
    parts,
    isDrawer,
}: {
    parts: PartsCollection;
    isDrawer?: boolean;
}) {
    const router = useRouter();
    const [stats, setStats] = useState<Stat[] | null>(null);
    const [filter, setFilter] = useState<Filter | null>(null);
    const [options, setOptions] = useState<Options | null>(null);
    const [openGroups, setOpenGroups] = useState<string[] | null>(null);

    useEffect(() => {
        setStats(getStats());
        setFilter(getFilter());
        setOptions(getOptions());
        setOpenGroups(getOpenGroups());
    }, []);

    useEffect(() => {
        if (!stats) return;

        saveStats(stats);
    }, [stats]);

    useEffect(() => {
        if (!filter) return;

        saveFilter(filter);
    }, [filter]);

    useEffect(() => {
        if (!options) return;

        saveOptions(options);
    }, [options]);

    useEffect(() => {
        if (!openGroups) return;

        saveOpenGroups(openGroups);
    }, [openGroups]);

    const apply = () => {
        applySettings(router);

        closeDrawer();
    };

    const Container = isDrawer ? DrawerContent : Card;
    const Header = isDrawer ? DrawerHeader : CardHeader;
    const Body = isDrawer ? DrawerBody : CardBody;

    if (
        stats === null ||
        filter === null ||
        options === null ||
        openGroups === null
    ) {
        return (
            <Container>
                <Header>Settings</Header>
                <Body className="h-[194px] flex flex-col items-center justify-center">
                    <Spinner />
                </Body>
            </Container>
        );
    }

    return (
        <Container className="overflow-y-hidden flex-1">
            <Header className="justify-between">
                <div className="flex flex-row gap-4 items-center">
                    {isDrawer && <CloseDrawerButton />}
                    <span className="text-lg">Settings</span>
                </div>
                <Button color="primary" onPress={apply}>
                    <RefreshCw />
                    Apply
                </Button>
            </Header>
            <Body>
                <Accordion
                    keepContentMounted
                    selectedKeys={openGroups}
                    selectionMode="multiple"
                    onSelectionChange={(sel) =>
                        setOpenGroups(Array.from(sel).map(String))
                    }
                >
                    <AccordionItem
                        key={"0"}
                        classNames={{ content: "flex flex-col gap-4" }}
                        title="Options"
                    >
                        <Switch
                            isSelected={options.simplify}
                            onValueChange={(e) => {
                                setStats(
                                    defaultStats.filter(
                                        (s) =>
                                            typeof s.simple === "undefined" ||
                                            s.simple === e,
                                    ),
                                );
                                setOptions({ ...options, simplify: e });
                            }}
                        >
                            Simplify stats
                        </Switch>
                        <Slider
                            label="Specialization"
                            maxValue={4}
                            minValue={1}
                            step={1}
                            value={options.specialisation}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    specialisation: e as number,
                                })
                            }
                        />
                    </AccordionItem>
                    <AccordionItem
                        key={"1"}
                        classNames={{ content: "flex flex-col gap-4" }}
                        title="Stat Order"
                    >
                        <OrderableList
                            items={stats.filter(
                                (s) =>
                                    typeof s.simple === "undefined" ||
                                    s.simple === options.simplify,
                            )}
                            onChange={setStats}
                        />
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => setStats(defaultStats)}
                        >
                            <RefreshCcw />
                            Reset order
                        </Button>
                    </AccordionItem>
                    <AccordionItem
                        key={"2"}
                        classNames={{ content: "flex flex-col gap-4" }}
                        title="Filter"
                    >
                        <Select
                            label="Driver Class"
                            placeholder="no selection"
                            selectedKeys={new Set(filter.driverClasses)}
                            selectionMode="multiple"
                            onSelectionChange={(e) =>
                                setFilter({
                                    ...filter,
                                    driverClasses: Array.from(
                                        e,
                                    ) as Driver["size"][],
                                })
                            }
                        >
                            {["Small", "Medium", "Large"].map((size) => (
                                <SelectItem key={size} textValue={size}>
                                    {size}
                                </SelectItem>
                            ))}
                        </Select>
                        <PartSelect
                            label="Driver"
                            parts={parts.drivers}
                            selection={filter.drivers}
                            onChange={(s) => {
                                setFilter({
                                    ...filter,
                                    drivers: s,
                                });
                            }}
                        />
                        <Select
                            label="Body Class"
                            placeholder="no selection"
                            selectedKeys={new Set(filter.bodyClasses)}
                            selectionMode="multiple"
                            onSelectionChange={(e) =>
                                setFilter({
                                    ...filter,
                                    bodyClasses: Array.from(
                                        e,
                                    ) as Body["type"][],
                                })
                            }
                        >
                            {[
                                "Kart",
                                "Standard Bike",
                                "Sport Bike",
                                "All-Terrain Vehicle",
                            ].map((type) => (
                                <SelectItem key={type} textValue={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </Select>
                        <PartSelect
                            label="Body"
                            parts={parts.bodies}
                            selection={filter.bodies}
                            onChange={(s) => {
                                setFilter({
                                    ...filter,
                                    bodies: s,
                                });
                            }}
                        />
                        <PartSelect
                            label="Tire"
                            parts={parts.tires}
                            selection={filter.tires}
                            onChange={(s) => {
                                setFilter({
                                    ...filter,
                                    tires: s,
                                });
                            }}
                        />
                        <PartSelect
                            label="Glider"
                            parts={parts.gliders}
                            selection={filter.gliders}
                            onChange={(s) => {
                                setFilter({
                                    ...filter,
                                    gliders: s,
                                });
                            }}
                        />
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => setFilter(defaultFilter)}
                        >
                            <RefreshCcw />
                            Reset filter
                        </Button>
                    </AccordionItem>
                </Accordion>
            </Body>
        </Container>
    );
}
