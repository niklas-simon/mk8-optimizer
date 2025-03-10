"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { ChartDataset, Point } from "chart.js/auto";
import { useTheme } from "next-themes";
import { Circle } from "react-feather";
import { Scatter } from "react-chartjs-2";
import { DrawerBody, DrawerContent, DrawerHeader } from "@heroui/drawer";

import AvatarList from "./AvatarList";
import { CloseDrawerButton } from "./navigation";

import { Combination } from "@/data/constants";
import { getStat } from "@/data/combinations";
import { Stat } from "@/data/settings";
import Selection from "@/data/selection";

const Radar = dynamic(
    () => import("react-chartjs-2").then((mod) => mod.Radar),
    {
        ssr: false,
    },
);

const borderColors = [
    "#03A9F4", // light blue
    "#F44336", // red
    "#4CAF50", // green
    "#FFEB3B", // yellow
    "#9C27B0", // purple
];

const backgroundColors = borderColors.map((c) => c + "40");

export interface ChartBaseItem {
    x: Stat;
    y: Stat;
    data: Point[];
}

export default function ChartPage({
    combinations,
    chartBase,
    stats,
    isDrawer,
}: {
    combinations: Combination[];
    chartBase: ChartBaseItem[];
    stats: Stat[];
    isDrawer?: boolean;
}) {
    const [selection, setSelection] = useState<number[]>([]);

    const { theme } = useTheme();

    useEffect(() => {
        const handler = (s: number[]) => setSelection(s);

        Selection.getInstance().on(handler);

        return () => Selection.getInstance().off(handler);
    }, []);

    const validSelection = selection.filter((index) => combinations[index]);

    const Container = isDrawer ? DrawerContent : Card;
    const Header = isDrawer ? DrawerHeader : CardHeader;
    const Body = isDrawer ? DrawerBody : CardBody;

    return (
        <Container className="overflow-y-hidden flex-1">
            <Header className="flex flex-col gap-2 items-start relative">
                {isDrawer && (
                    <CloseDrawerButton className="absolut top-[-.5rem] left-[-.5rem]" />
                )}
                {validSelection.length ? (
                    validSelection.map((index, i) => (
                        <div key={i} className="flex flex-row gap-2">
                            <Circle
                                style={{
                                    color: borderColors[i],
                                }}
                            />
                            <AvatarList
                                avatars={[
                                    ...combinations[index].driver.avatars,
                                    ...combinations[index].body.avatars,
                                    ...combinations[index].tire.avatars,
                                    ...combinations[index].glider.avatars,
                                ]}
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center">(empty selection)</div>
                )}
            </Header>
            <Body>
                {
                    <>
                        <Radar
                            className="max-w-[500px] max-h-[500px]"
                            data={{
                                labels: stats.map((s) => s.label),
                                datasets: validSelection.map(
                                    (index, i) =>
                                        ({
                                            data: stats.map((stat) =>
                                                getStat(
                                                    combinations[index],
                                                    stat.key,
                                                ),
                                            ),
                                            borderColor: borderColors[i],
                                            backgroundColor:
                                                backgroundColors[i],
                                        }) satisfies ChartDataset<
                                            "radar",
                                            (number | null)[]
                                        >,
                                ),
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    r: {
                                        ticks: {
                                            display: false,
                                        },
                                        grid: {
                                            color:
                                                theme === "dark"
                                                    ? "#757575"
                                                    : "#BDBDBD",
                                        },
                                        min: 0,
                                        max: 20,
                                    },
                                },
                            }}
                        />
                        {chartBase.map((item) => {
                            return (
                                <Scatter
                                    key={item.x.key + item.y.key}
                                    className="max-w-[500px] max-h-[500px]"
                                    data={{
                                        datasets: [
                                            ...validSelection.map(
                                                (index, i) => {
                                                    return {
                                                        label: String(index),
                                                        data: [
                                                            {
                                                                x: getStat(
                                                                    combinations[
                                                                        index
                                                                    ],
                                                                    item.x.key,
                                                                ),
                                                                y: getStat(
                                                                    combinations[
                                                                        index
                                                                    ],
                                                                    item.y.key,
                                                                ),
                                                            } satisfies Point,
                                                        ],
                                                        borderColor:
                                                            borderColors[i],
                                                        backgroundColor:
                                                            backgroundColors[i],
                                                    };
                                                },
                                            ),
                                            {
                                                label: "all",
                                                data: item.data,
                                                borderColor: "#80808040",
                                                backgroundColor: "#80808020",
                                            },
                                            {
                                                label: "optimal",
                                                data: Array.from(
                                                    new Set(
                                                        combinations.map(
                                                            (combination) =>
                                                                (getStat(
                                                                    combination,
                                                                    item.x.key,
                                                                ) <<
                                                                    6) +
                                                                getStat(
                                                                    combination,
                                                                    item.y.key,
                                                                ),
                                                        ),
                                                    ),
                                                ).map((statNum) => ({
                                                    x: statNum >> 6,
                                                    y:
                                                        statNum %
                                                        ((statNum >> 6) << 6),
                                                })),
                                                borderColor: "#808080",
                                                backgroundColor: "#80808040",
                                            },
                                        ],
                                    }}
                                    options={{
                                        scales: {
                                            x: {
                                                title: {
                                                    text: item.x.label,
                                                    display: true,
                                                },
                                            },
                                            y: {
                                                title: {
                                                    text: item.y.label,
                                                    display: true,
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }}
                                />
                            );
                        })}
                    </>
                }
            </Body>
        </Container>
    );
}
