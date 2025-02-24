import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BodyPartData {
    bodyPart: string;
    percentage: number;
}

const data: BodyPartData[] = [
    { bodyPart: "arms", percentage: 20 },
    { bodyPart: "chest", percentage: 20 },
    { bodyPart: "abs", percentage: 20 },
    { bodyPart: "legs", percentage: 20 },
    { bodyPart: "shoulders", percentage: 20 },
];

const maxWidthFactor = 1.5;

const BodyPartChart = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = 400;
        const height = 600;

        svg.attr("width", width).attr("height", height).html("");

        const widthScale = d3
            .scaleLinear()
            .domain([0, 20, 100])
            .range([0.5, 1, maxWidthFactor]);

        const getColor = (d: BodyPartData) => {
            if (d.percentage < 20) return "#ff4d4d"; // Red for undertrained
            if (d.percentage > 20) return "#ffff4d"; // Yellow for overtrained
            return "#4dff4d"; // Green for optimal
        };

        const body = svg.append("g").attr("transform", "translate(200,80)");

        // Head
        body.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 30)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // Shoulders
        const shoulderData = data.find((d) => d.bodyPart === "shoulders")!;
        const shoulderWidth = 60 * widthScale(shoulderData.percentage);
        body.append("path")
            .datum(shoulderData)
            .attr("d", `
                M -${shoulderWidth} 40 
                Q 0 20 ${shoulderWidth} 40
                L ${shoulderWidth - 10} 80
                Q 25 90 0 100
                Q -25 90 -${shoulderWidth - 10} 80
                Z
            `)
            .attr("fill", getColor)
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`)
                    .html(`${d.bodyPart}: ${d.percentage}%`);
            })
            .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

        // Chest
        const chestData = data.find((d) => d.bodyPart === "chest")!;
        const torsoWidth = 40 * widthScale(chestData.percentage);
        body.append("path")
            .datum(chestData)
            .attr("d", `
                M -${torsoWidth} 80 
                L ${torsoWidth} 80
                L ${torsoWidth + 10} 140
                Q 30 160 0 180
                Q -30 160 -${torsoWidth + 10} 140
                Z
            `)
            .attr("fill", getColor)
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`)
                    .html(`${d.bodyPart}: ${d.percentage}%`);
            })
            .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

        // Arms
        const armsData = data.find((d) => d.bodyPart === "arms")!;
        const armPath = (side: number) => {
            const widthFactor = widthScale(armsData.percentage);
            return `
                M ${side * (60 * widthFactor)} 40
                C ${side * (80 * widthFactor)} 60, ${side * (100 * widthFactor)} 100, ${side * (90 * widthFactor)} 140
                L ${side * (80 * widthFactor)} 160
                Q ${side * (70 * widthFactor)} 170, ${side * (60 * widthFactor)} 150
                Z`;
        };

        [1, -1].forEach((side) => {
            body.append("path")
                .datum(armsData)
                .attr("d", armPath(side))
                .attr("fill", getColor)
                .attr("stroke", "#333")
                .on("mouseover", function(event, d) {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`)
                        .html(`${d.bodyPart}: ${d.percentage}%`);
                })
                .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));
        });

        // Legs
        const legsData = data.find((d) => d.bodyPart === "legs")!;
        const legWidth = 30 * widthScale(legsData.percentage);
        const legPath = (side: number) => `
            M ${side * 20} 170 
            L ${side * (legWidth + 20)} 220
            L ${side * legWidth} 370
            Q ${side * legWidth} 370, ${side * (legWidth - 10)} 290
            Z`;

        [1, -1].forEach((side) => {
            body.append("path")
                .datum(legsData)
                .attr("d", legPath(side))
                .attr("fill", getColor)
                .attr("stroke", "#333")
                .on("mouseover", function(event, d) {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`)
                        .html(`${d.bodyPart}: ${d.percentage}%`);
                })
                .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));
        });

    }, []);

    return (
        <div style={{ position: "relative" }}>
            <svg
                ref={ref}
                style={{
                    fontFamily: "Arial",
                    borderRadius: "20px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            />
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    opacity: 0,
                    background: "#fff",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    padding: "8px",
                    pointerEvents: "none",
                    fontFamily: "Arial",
                    transition: "opacity 0.2s",
                }}
            />
        </div>
    );
};

export default BodyPartChart;