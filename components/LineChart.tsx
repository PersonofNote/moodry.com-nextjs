import React, { useRef, useState, useEffect } from 'react';
// TODO clean up imports
import * as d3 from 'd3';
import { moodColors } from '../constants'
// import '../styles/line-chart.css';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './charts.module.css';


const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

const getDates = (data: any) => {
    return data.map(d => parseDate(d.createdAt))
}

const D3LineChart = ({data, dateRange}) => {

    const { wWidth } = useWindowSize();
    const d3Container = useRef(null);
    const [Tooltip, setTooltip] = useState(null);
    const [showDots, setShowDots] = useState(false);

    const margin = wWidth < 750 ? {top: 10, right: 30, bottom: 30, left: 30} : {top: 10, right: 30, bottom: 30, left: 60};
    const width = wWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const tooltipContent = (val) => {
        const date = parseDate(val.createdAt)
        const formatDate = d3.timeFormat('%d-%m-%y at %H:%m')
        const note = val.note || 'NO NOTE DATA'
        return (
        `   
            <svg width="10" height="10">
                <rect width="10" height="10" style="fill:${moodColors[val.value]}" />
            </svg>
            <div>Date: ${formatDate(date)}</div>
            <div> Note: ${note}</div>
        `
        )
    }

    useEffect(() => {
        const Tooltip = d3.select("#tooltip")
        .append("div")
        setTooltip(Tooltip)
    },[])
    
    useEffect(() => {
        if (data && d3Container.current) {
            Tooltip
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
            
            const mouseover = (d) => {
                Tooltip
                    .style("opacity", 0.8)
                    .style("stroke", "black")
                    .style('color', 'black')
            }
            
            const mousemove = (d, value) => {
                Tooltip
                    .html(tooltipContent(value))
                    .style("left", (d.offsetX + "px"))
                    .style("top", (d.offsetY+ "px"))
            }
            
            const mouseleave = (d) => {
                Tooltip
                    .style("opacity", 0)
                }

            const tickNum = wWidth < 750 ? 3 : 10;
            const fontSize = wWidth < 750 ? 18 : 20;
            const dotSize = showDots ? wWidth < 750 ? 15 : 7 : 0;

            d3.select('#line-chart-svg').selectAll('*').remove();
            
            const domain = dateRange.startDate != null ? [dateRange.startDate, d3.isoParse(dateRange.endDate)] : d3.extent(getDates(data))
            
            const xScale = d3.scaleTime()
                .domain(domain)
                .range([0, width])

            const yScale = d3.scaleLinear()
            //.domain([0, d3.max(data, d => +d.value )])
            .domain([0,3])
            .range([ height, 0 ])

            // grid is made of extended ticklines
            const xAxisGrid = d3.axisBottom(xScale).tickSize(-height).tickFormat('').ticks(tickNum);
            const yAxisGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(tickNum);            

            // attach chart svg
            const svg = d3.select(d3Container.current)
            .append("svg")
                .attr('id', 'line-chart')
                //.attr("width", 'width + margin.left + margin.right')
                .attr("height", height + margin.top + margin.bottom)
                // At larger sizes we need 0 0 1500 560... check on this
                .attr("viewBox", `${margin.right} ${-margin.top} ${width} 560`)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // attach gridlines
            svg.append('g')
            .attr('class', 'x axis-grid')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('opacity', 0.2)
            .call(xAxisGrid);

            svg.append('g')
            .attr('class', 'y axis-grid')
            .attr('opacity', 0.2)
            .call(yAxisGrid);

            var x = d3.scaleTime()
            .domain(domain)
            .range([ 0, width ])

            const xAxis = d3.axisBottom(xScale).ticks(tickNum)

            svg.append("g")
            .attr('id', 'x-axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


            
            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.value )])
            .range([ height, 0 ])

            svg.append("g")
            .call(d3.axisLeft(y).ticks(3));   

            /* GRADIENT STUFF: Needs math 
            var defs = svg.append('defs');
            
            var gradient = defs.append('linearGradient')
                .attr('id', 'svgGradient')
                .attr('x2', '0%')
                .attr('x2', '100%')
                .attr('y1', '0%')
                .attr('y2', '100%');


            for (const d in data) {
                const index = Number(d);
                const nextValue = index < data.length ? index + 1 : data.length;

                gradient.append('stop')
                .attr('class', 'start')
                .attr('offset', '0%') // Need math to spread this out
                .attr('stop-color', moodColors[data[index].value])
                .attr('stop-opacity', 1);
    
                gradient.append('stop')
                .attr('class', 'end')
                .attr('offset', '100%')
                .attr('stop-color', moodColors[nextValue])
                .attr('stop-opacity', 1);
            }
            */
            
            // add line
            svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", 'blue')
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .curve(d3.curveNatural)
            .x((d) => xScale(parseDate(d.createdAt))) 
            .y((d) => yScale(d.value)) 
            )
        
            // add dots
            svg.append('g')
            svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", dotSize)
            .attr("fill", (d) => moodColors[d.value])
            .attr("cx", (d) => xScale(parseDate(d.createdAt)))
            .attr("cy", (d) => yScale(d.value))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

            d3.selectAll('text')
            .attr('font-size', fontSize)
            .attr("transform", "translate(-10,0)rotate(-45)")
        }

        },[data, d3Container.current])

    return (
        <>
            <svg
                id="line-chart-svg"
                className={styles['d3-line-chart']}
                width='100%'
                height='100%'
                ref={d3Container}
            />
            <button onClick={()=> setShowDots(!showDots)}>Toggle Dots</button>
            <div id='tooltip'></div>
        </>
    );
}

export default D3LineChart;