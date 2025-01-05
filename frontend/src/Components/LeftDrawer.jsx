import React, { forwardRef } from "react";

const categories = [
    {
        name: "Conference Papers",
        href: "/categories/Conference Papers",
    },
    {
        name: "Journal Papers",
        href: "/categories/Journal Papers",
    },
    {
        name: "Book Chapters",
        href: "/categories/Book Chapters",
    },
    {
        name: "Projects",
        href: "/categories/Projects",
    },
    {
        name: "Search Faculty",
        href: "/categories/Faculty",
    }
];

const LeftDrawer = forwardRef(({ toggleCurrentPage, currentPageName, className }, ref) => {
    return (
        <div className={`max-w-64 min-w-64 min-h-screen border z-10 ${className}`} ref={ref}>
            <div className="bg-slate-400 p-2 text-4xl font-bold text-white text-center">
                Data
            </div>
            <div className="flex flex-col">
                {categories.map((category, index) => (
                    <a
                        href={category.href}
                        key={index}
                        onClick={() => toggleCurrentPage(category.name)}
                        className={`text-xl font-bold text-gray-700 py-3 text-center hover:text-black hover:bg-gray-200 ${
                            currentPageName === category.name ? "bg-gray-200" : ""
                        }`}
                    >
                        <div className="text-lg">{category.name}</div>
                    </a>
                ))}
            </div>
        </div>
    );
});
LeftDrawer.displayName = "LeftDrawer";

export default LeftDrawer;
