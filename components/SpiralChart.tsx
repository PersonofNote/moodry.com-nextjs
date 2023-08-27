// Based on https://stackoverflow.com/questions/40533749/d3-spiral-plot
import React, { useRef, useState, useEffect, useMemo } from 'react';
// Check if Next treeshakes this for you
import * as d3 from 'd3';
import { moodColors } from '../constants';
import { startOfWeek, addWeeks, differenceInWeeks, differenceInCalendarMonths, differenceInCalendarDays } from 'date-fns';

// HOOKS
import { useWindowSize } from '../hooks/useWindowSize';
import { useSVGBounds } from '../hooks/useSVGBounds';

// STYLES
import styles from './charts.module.css';

// TODO: Make these types better
export const SpiralChart = ({ data, dateRange} : {data?: any, dateRange?: any}) => {
  const spiralContainer = useRef(null);
  const {wWidth, wHeight} = useWindowSize();

  const getSpiralNumber = () => {
    const firstDate=new Date(data[0].createdAt);
    const lastDate=new Date(data[data.length-1].createdAt);
    const adjustedFirstDate = startOfWeek(firstDate, { weekStartsOn: 0 }); // 0 indicates Sunday
    const adjustedLastDate = startOfWeek(lastDate, { weekStartsOn: 0 });
    // Calculate the number of weeks between the adjusted dates
    return differenceInCalendarMonths(adjustedLastDate, adjustedFirstDate);
  }


  const getDifferenceinDays = () => {
    // Calculate width based on how many entries are in the total
    const firstDate=new Date(data[0].createdAt);
    const lastDate=new Date(data[data.length-1].createdAt);
    return differenceInCalendarDays(lastDate, firstDate)
  }

  var width = wWidth,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = getSpiralNumber();

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    const drawSpiral = (data) => {  if (spiralContainer.current) {
      // If there's a chart, remove it to redraw
      d3.select('#spiral-container-svg').selectAll('*').remove();

      const svg = d3.select(spiralContainer.current).append("svg")
      .attr('id', 'spiral-chart')
      .attr("width", wWidth)
      .attr("height", wWidth)

      const group = svg.append('g')
      
      var points = d3.range(start, end + 0.001, (end - start) / 1000);

      var spiral = d3.lineRadial()
        .curve(d3.curveCardinal)
        .angle(theta)
        .radius(radius);

      var path = group.append("path")
        .datum(points)
        .attr("id", "spiral")
        .attr("d", spiral)
        .style("fill", "none")
        .style("stroke", "lightblue");

      var spiralLength = path.node().getTotalLength(),
          N = getDifferenceinDays(),
          barWidth = (spiralLength / N) - 1

      // Data keeps crapping out for some reason unless I make it this way. TODO: figure out why
      var someData = [];

      for (var i = 0; i < data.length; i ++) {
        someData.push({
          date: new Date(data[i].createdAt),
          value: data[i].value
        });
      }

      // here's our time scale that'll run along the spiral
      var timeScale = d3.scaleTime()
        .domain(d3.extent(someData, function(d){
          return d.date;
        }))
        .range([0, spiralLength]);
      
      // yScale for the bar height
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(someData, function(d){
          return d.value;
        })])
        .range([0, (r / numSpirals) - 30]);

      // append our rects
      group.selectAll("rect")
        .data(someData)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
          
          // placement calculations
          var linePer = timeScale(d.date),
              posOnLine = path.node().getPointAtLength(linePer),
              angleOnLine = path.node().getPointAtLength(linePer - barWidth);
        
          d.linePer = linePer; // % distance are on the spiral
          d.x = posOnLine.x; // x postion on the spiral
          d.y = posOnLine.y; // y position on the spiral
          
          d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 80; //angle at the spiral position. originally was 90 but I don't really know why...

          return d.x;
        })
        .attr("y", function(d){
          return d.y;
        })
        .attr("width", barWidth/4)
        .attr("height", numSpirals*1.4)
        .style("fill", function(d){
          return moodColors[d.value]; // rotate the bar
        })
        .style("stroke", 'gray')
        .attr("transform", function(d){
          return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
        });
      
      // add date labels
      var tF = d3.timeFormat("%b %Y"),
          firstInMonth = {};
      group.selectAll("text")
        .data(someData)
        .enter()
        .append("text")
        .attr("dy", 10)
        .style("text-anchor", "start")
        .style("font", "10px arial")
        .append("textPath")
        // only add for the first of each month
        .filter(function(d){
          var sd = tF(d.date);
          if (!firstInMonth[sd]){
            firstInMonth[sd] = 1;
            return true;
          }
          return false;
        })
        .text(function(d){
          return tF(d.date);
        })
        // place text along spiral
        .attr("xlink:href", "#spiral")
        .style("fill", "grey")
        .attr("startOffset", function(d){
          return ((d.linePer / spiralLength) * 100) + "%";
        })

        // TODO: Deal with larger data sets. Will likely need some math based on the spiral length
        const spiralChart = document.querySelector('#spiral-chart')
        const {xMin, xMax, yMin, yMax} = useSVGBounds(spiralChart);
        // const proportion = ((xMax - xMin) / wWidth) * 10;
        const proportion = (wWidth / (xMax - xMin)) * 0.9
        const viewbox = `${xMin} ${yMin} ${(xMax - xMin) * proportion } ${(xMax - xMin) * proportion}`;
        spiralChart?.setAttribute('viewBox', viewbox)
      }
    }
  useMemo(() => {
      drawSpiral(data)
    },[spiralContainer.current, data]);


    return(
      data?.length ? (
        <svg
            id="spiral-container-svg"
            className={styles['spiral-container-svg']}
            width="100%"
            height={wWidth}
            ref={spiralContainer}
        />
      ) : "no data loaded"
    )
}