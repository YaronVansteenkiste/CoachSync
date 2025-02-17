"use client";

import {paths} from "@/lib/data/paths";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect} from "react";

export function Navigation() {
    const pathname = usePathname();

    useEffect(() => {
        console.log("Navigation rendered");
        console.log("Pathname: ", pathname);
    });

    return (
        <nav className="navbar h-full w-full fixed top-0 left-0 pt-5">
            <div className="w-48">
                <div>
                    <h1 className="text-2xl text-center my-10 font-bold text-white">FitTrack</h1>
                </div>
                {paths.map(({name, href}, index) => (
                    <Link
                        key={index}
                        href={href}
                        className={cn(
                            "block py-4 px-12 font-thin hover:bg-gray-700 dark:hover:bg-gray-600",
                            pathname === href && "font-bold",
                        )}
                    >
                        {name}
                    </Link>
                ))}
            </div>
        </nav>
    );
};