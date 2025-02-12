"use client";

import { paths } from "@/lib/data/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="h-full w-48 fixed top-0 left-0 bg-gray-900 pt-5">
            {paths.map(({name, href}, index) => (
                <Link
                    key={index}
                    href={href}
                    className={cn(
                        "block py-2 px-4 text-white hover:bg-gray-700",
                        pathname === href && "underline",
                    )}
                >
                    {name}
                </Link>
            ))}
        </nav>
    );
};
