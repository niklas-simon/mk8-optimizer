import Image from "next/image";

import { Avatar } from "@/data/constants";

export default function AvatarList({ avatars }: { avatars: Avatar[] }) {
    return (
        <div className="flex flex-row items-center flex-wrap sm:flex-nowrap">
            {avatars.map((avatar: Avatar, i) => (
                <Image
                    key={i}
                    alt={avatar.name}
                    height={24}
                    src={avatar.image}
                    width={24}
                />
            ))}
        </div>
    );
}
