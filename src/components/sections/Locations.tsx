"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef } from "react";
import SearchBar from "@/components/common/SearchBar";
import FilterDropdown from "@/components/common/FilterDropdown";
import LocationCard from "@/components/common/LocationCard";
import SectionCard from "@/components/parallax/SectionCard";

import { states, dummyLocations } from "@/constants/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LocationsSection() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const slider = scrollRef.current;
        if (!slider) return;
        slider.dataset.dragging = "true";
        slider.dataset.startX = e.pageX.toString();
        slider.dataset.scrollLeft = slider.scrollLeft.toString();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const slider = scrollRef.current;
        if (!slider || slider.dataset.dragging !== "true") return;
        e.preventDefault();
        const x = e.pageX;
        const walk = x - Number(slider.dataset.startX || 0);
        slider.scrollLeft = Number(slider.dataset.scrollLeft || 0) - walk;
    };

    const handleMouseUp = () => {
        const slider = scrollRef.current;
        if (slider) slider.dataset.dragging = "false";
    };

    return (
        <motion.section

            data-scroll-section

            className="relative min-h-screen py-20 z-20"
            style={{
                background: isDarkMode
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,1))'
                    : 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(236,254,255,1))'
            }}
        >
            <div className="container mx-auto px-4 pt-16">

                <SectionCard
                    title="Explore Locations"
                    category="locations"
                    postButtonText="Post your favorite location & earn coins!"
                >
                    <div className="flex flex-col items-center gap-4 mb-10" data-scroll data-scroll-speed="1">
                        <SearchBar />
                        <FilterDropdown items={states} />
                    </div>

                    <div
                        ref={scrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className={`overflow-x-scroll whitespace-nowrap mb-12 mt-8 py-6 px-4 
    ${isDarkMode ? "scrollbar-dark" : "scrollbar-light"} 
    cursor-grab active:cursor-grabbing select-none`}
                        data-scroll
                        data-scroll-speed="1"
                    >
                        <div className="inline-flex gap-6">
                            {dummyLocations.map((loc, index) => (
                                <motion.div
                                    key={loc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <LocationCard location={loc} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SectionCard>
            </div>
        </motion.section>
    );
}
