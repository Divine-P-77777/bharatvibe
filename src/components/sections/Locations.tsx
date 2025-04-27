"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import SearchBar from "@/components/common/SearchBar";
import FilterDropdown from "@/components/common/FilterDropdown";
import LocationCard from "@/components/common/LocationCard";
import SectionCard from "@/components/parallax/SectionCard";

import { states, dummyLocations } from "@/constants/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LocationsSection() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();

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
                <SectionCard title="Explore Locations" jump_to="/locations" postButtonText="Post your favorite location & earn coins!">
                    <div className="flex flex-col items-center gap-4 mb-10" data-scroll data-scroll-speed="1">
                        <SearchBar />
                        <FilterDropdown items={states} />
                    </div>

                    <div className="overflow-x-auto whitespace-nowrap mb-12 mt-8 pb-4" data-scroll data-scroll-speed="1">
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
