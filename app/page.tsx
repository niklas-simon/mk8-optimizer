import { BarChart2, Settings as SettingsIcon } from "react-feather";

import ChartPage from "@/components/ChartPage";
import SettingsPage from "@/components/SettingsPage";
import SettingsLoader from "@/components/SettingsLoader";
import getCombinations, {
    getOptimized,
    getParts,
    getStat,
} from "@/data/combinations";
import { defaultStats, Settings, Stat } from "@/data/settings";
import CombinationsGrid, { PageSettings } from "@/components/CombinationsGrid";
import { Navigation } from "@/components/navigation";

const statsMap = defaultStats.reduce((map, stat) => {
    map.set(stat.key, stat);

    return map;
}, new Map<string, Stat>());

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const search = await searchParams;

    if (!search.settings) {
        return <SettingsLoader />;
    }

    const settings = JSON.parse(atob(search.settings as string)) as Settings;

    const allCombinations = await getCombinations();
    const combinations = await getOptimized(settings);
    const parts = await getParts();

    const pageSettings: PageSettings = {
        page: Number(search.page) || 1,
        total: Math.ceil(combinations.length / 50),
    };

    const paged = combinations.slice(
        (pageSettings.page - 1) * 50,
        pageSettings.page * 50,
    );

    const stats = settings.stats.map((key) => statsMap.get(key)!);

    const chartBase = Array.from(Array(stats.length - 1)).map((_, i) => {
        const xStat = stats[i];
        const yStat = stats[i + 1];

        return {
            x: xStat,
            y: yStat,
            data: Array.from(
                new Set(
                    allCombinations.map(
                        (combination) =>
                            (getStat(combination, xStat.key) << 6) +
                            getStat(combination, yStat.key),
                    ),
                ),
            ).map((statNum) => ({
                x: statNum >> 6,
                y: statNum % ((statNum >> 6) << 6),
            })),
        };
    });

    return (
        <div className="flex flex-col flex-1 overflow-y-hidden">
            <Navigation
                items={[
                    {
                        key: "statistics",
                        icon: <BarChart2 />,
                        className: "flex lg:hidden",
                        content: (
                            <ChartPage
                                isDrawer
                                chartBase={chartBase}
                                combinations={paged}
                                stats={stats}
                            />
                        ),
                    },
                    {
                        key: "settings",
                        icon: <SettingsIcon />,
                        className: "flex xl:hidden",
                        content: <SettingsPage isDrawer parts={parts} />,
                    },
                ]}
            />
            <div className="container mx-auto max-w-7xl p-4 flex-1 overflow-y-hidden flex flex-row gap-4">
                <div className="flex-1 min-w-[300px] flex flex-col overflow-y-hidden">
                    <CombinationsGrid
                        combinations={paged}
                        pagination={pageSettings}
                    />
                </div>
                <div className="hidden lg:flex flex-2 flex-col min-w-[400px] overflow-y-hidden">
                    <ChartPage
                        chartBase={chartBase}
                        combinations={paged}
                        stats={stats}
                    />
                </div>
                <div className="hidden xl:flex flex-2 min-w-[300px] flex-col overflow-y-hidden">
                    <SettingsPage parts={parts} />
                </div>
            </div>
        </div>
    );
}
