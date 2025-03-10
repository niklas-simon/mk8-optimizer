"use client";

import { Select, SelectItem } from "@heroui/select";

import AvatarList from "./AvatarList";

import { Avatar, Part } from "@/data/constants";

export default function PartSelect({
    parts,
    selection,
    onChange,
    label,
}: {
    parts: Map<number, Part>;
    selection: number[];
    onChange: (e: number[]) => void;
    label: string;
}) {
    return (
        <Select
            label={label}
            placeholder="no selection"
            renderValue={(items) => (
                <AvatarList
                    avatars={items.reduce(
                        (p, c) => p.concat(parts.get(Number(c.key))!.avatars),
                        [] as Avatar[],
                    )}
                />
            )}
            selectedKeys={new Set(selection.map(String))}
            selectionMode="multiple"
            onSelectionChange={(e) => {
                onChange(Array.from(e).map(Number));
            }}
        >
            {Array.from(parts.values()).map((part) => (
                <SelectItem
                    key={part.id}
                    textValue={part.avatars.map((a) => a.name).join(", ")}
                >
                    <AvatarList avatars={part.avatars} />
                </SelectItem>
            ))}
        </Select>
    );
}
