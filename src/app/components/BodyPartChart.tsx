import React, {useRef, useEffect} from "react";
import * as d3 from "d3";

const data = [
    {bodyPart: "arms", percentage: 20},
    {bodyPart: "chest", percentage: 20},
    {bodyPart: "abs", percentage: 20},
    {bodyPart: "legs", percentage: 20},
    {bodyPart: "shoulders", percentage: 10},
];

const BodyPartChart = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = 400;
        const height = 600;

        svg.attr("width", width).attr("height", height);

        // Add gradient definition
        const defs = svg.append("defs");

        // Human body drawing
        const body = svg.append("g").attr("transform", "translate(200,80)");

        // Head
        body.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 30)
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // Shoulders
        body.append("path")
            .attr("d", `
  M -60 40 
  Q 0 20 60 40
  L 50 80
  Q 25 90 0 100
  Q -25 90 -50 80
  Z
`)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .attr("class", "chest");

        // Torso
// Torso (smaller)
        body.append("path")
            .attr("d", `
    M -40 80 
    L 40 80
    L 50 140
    Q 30 160 0 180
    Q -30 160 -50 140
    Z
    `)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("stroke-width", 2);

        // Arms with separated forearm and upper arm
        const armPath = (side: number) => {
            const upperArm = `
                M ${side * 60} 40
                C ${side * 80} 60, ${side * 100} 100, ${side * 90} 140
                L ${side * 80} 160
                Q ${side * 70} 170, ${side * 60} 150
                Z`;

            const forearm = `
                M ${side * 90} 140
                L ${side * 80} 160
                Q ${side * 70} 200, ${side * 50} 210
                L ${side * 40} 200
                Q ${side * 60} 180, ${side * 70} 160
                Z`;

            return {upperArm, forearm};
        };

        // Right arm
        body.append("path")
            .attr("d", armPath(1).upperArm)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "arm");

        body.append("path")
            .attr("d", armPath(1).forearm)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "arm");

        // Left arm
        body.append("path")
            .attr("d", armPath(-1).upperArm)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "arm");

        body.append("path")
            .attr("d", armPath(-1).forearm)
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "arm");

        // Legs
        const legPath = (side: number) => `
            M ${side * 30} 200 
            L ${side * 40} 300
            L ${side * 35} 420
            Q ${side * 30} 350, ${side * 20} 320
            Z`;

        body.append("path")
            .attr("d", legPath(1))
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "leg calf");

        body.append("path")
            .attr("d", legPath(-1))
            .attr("fill", "#000000")
            .attr("stroke", "#333")
            .attr("class", "leg calf");

        // Interactive labels
        data.forEach((part) => {
            const element = svg.append("g")
                .attr("class", "label")
                .attr("transform", () => {
                    switch (part.bodyPart) {
                        case 'arms':
                            return 'translate(290, 200)';
                        case 'chest':
                            return 'translate(150, 120)';
                        case 'abs':
                            return 'translate(150, 260)';
                        case 'legs':
                            return 'translate(200, 450)';
                        case 'shoulders':
                            return 'translate(200, 60)';
                        default:
                            return 'translate(0,0)';
                    }
                })
                .style("cursor", "pointer")
                .on("mouseover", function () {
                    d3.select(this).select("text").transition().style("font-size", "24px");
                    highlightBodyPart(part.bodyPart);
                })
                .on("mouseout", function () {
                    d3.select(this).select("text").transition().style("font-size", "18px");
                    resetHighlight();
                });

            element.append("rect")
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "#ffffff")
                .attr("rx", 10)
                .style("opacity", 0.9)
                .style("filter", "url(#dropShadow)");

            element.append("text")
                .attr("x", 50)
                .attr("y", 25)
                .attr("text-anchor", "middle")
                .style("font-family", "Arial")
                .style("font-size", "18px")
                .style("fill", "#4a90e2")
                .text(`${part.percentage}%`);
        });

        // Add shadow filter
        const filter = defs.append("filter")
            .attr("id", "dropShadow")
            .attr("height", "130%");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 2)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("result", "offsetBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "offsetBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Highlight functions
        const highlightBodyPart = (part: string) => {
            body.selectAll("*").transition().style("opacity", 0.3);
            switch (part) {
                case 'arms':
                    body.selectAll(".arm").transition()
                        .style("opacity", 1).style("fill", "#4a90e2");
                    break;
                case 'chest':
                    body.select("path").transition()
                        .style("opacity", 1).style("fill", "#4a90e2");
                    break;
                case 'abs':
                    body.select("path").transition()
                        .style("opacity", 1).style("fill", "#7c4dff");
                    break;
                case 'legs':
                    body.selectAll(".leg").transition()
                        .style("opacity", 1).style("fill", "#7c4dff");
                    break;
                case 'shoulders':
                    body.selectAll(".shoulder").transition()
                        .style("opacity", 1).style("fill", "#00c853");
                    break;
            }
        };

        const resetHighlight = () => {
            body.selectAll("*")
                .transition()
                .style("opacity", 1)
                .style("fill", "#000000");
        };

    }, []);

    return <svg ref={ref} style={{
        fontFamily: 'Arial',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}/>;
};

export default BodyPartChart;