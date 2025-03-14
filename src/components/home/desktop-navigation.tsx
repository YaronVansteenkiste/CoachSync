"use client";

import { paths } from "@/lib/data/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Navigation() {
    const pathname = usePathname();

    useEffect(() => {
        console.log("Navigation rendered");
        console.log("Pathname: ", pathname);
    });

    return (
        <nav className="navbar h-full w-full fixed top-0 left-0 pt-5">
            <div className="flex items-center py-4 px-12 font-bold text-2xl">
                <Link href="/">CoachSync</Link>
            </div>
            <div className="w-50">
                {paths.map(({ name, href, icon: Icon }, index) => (
                    <Link
                        key={index}
                        href={href}
                        className={cn(
                            "flex items-center py-4 px-12 font-thin hover:bg-gray-700 dark:hover:bg-gray-600",
                            pathname === href && "font-bold"
                        )}
                    >
                        {Icon && <Icon className="w-6 h-6 mr-2" />}
                        {name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}