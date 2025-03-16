"use client";

import { paths } from "@/lib/data/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavi() {
    const pathname = usePathname();

    return (
        <nav className="fixed z-40 bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t border-gray-300 dark:border-gray-700 p-2 pb-6"> {/* Added pb-6 for iOS home bar */}
            <div className="flex justify-around items-center">
                {paths.map(({ name, href, icon: Icon }, index) => (
                    <Link
                        key={index}
                        href={href}
                        className={cn(
                            "flex flex-col items-center justify-center py-2 px-4 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400",
                            pathname === href && "text-blue-500 dark:text-blue-400 font-bold"
                        )}
                    >
                        {Icon && <Icon className="w-6 h-6 mb-1" />}
                        <span className="text-xs hidden sm:block">{name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}