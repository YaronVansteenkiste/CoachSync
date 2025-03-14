"use client";

import React from "react";
import { Dumbbell, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
            <motion.div 
                className="absolute w-full h-full opacity-10"
                initial={{ scale: 1 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
                <Dumbbell className="w-full h-full" />
            </motion.div>
            
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <Loader2  className="w-16 h-16 text-blue-500 animate-spin" />
            </motion.div>
            
            <p className="mt-4 text-xl font-semibold">Loading your training...</p>
            
            <div className="w-64 h-2 mt-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>
        </div>
    );
};
