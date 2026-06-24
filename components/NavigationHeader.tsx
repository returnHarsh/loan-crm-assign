"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users } from "lucide-react";

export const NavigationHeader = () => {
    const pathname = usePathname();
    console.log("pathname is : ", pathname)

    const links = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Applications", href: "/applications", icon: Users },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold text-primary tracking-tight">Loan<span className="text-emerald-500">CRM</span></span>
                    </div>

                    <nav className="flex space-x-1 md:space-x-4">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                                    <span className="hidden sm:inline">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
};
