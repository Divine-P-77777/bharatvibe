
"use client";
import { motion } from "framer-motion";
import ParallaxWrapper from "./ParallaxWrapper";

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
}

const SectionWrapper = ({ children, id }: SectionWrapperProps) => (
  <motion.section
    data-scroll-section
    id={id}
    className="min-h-screen snap-start relative py-20"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: 0.8 }}
  >
    <ParallaxWrapper variant="content">
      {children}
    </ParallaxWrapper>
  </motion.section>
);

export default SectionWrapper;