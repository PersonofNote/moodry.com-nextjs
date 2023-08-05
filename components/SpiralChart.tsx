// Based on https://stackoverflow.com/questions/40533749/d3-spiral-plot
import React, { useRef, useState, useEffect, useMemo } from 'react';
// Check if Next treeshakes this for you
import * as d3 from 'd3';
import { moodColors } from '../constants'

// HOOKS
import { useWindowSize } from '../hooks/useWindowSize';
import { useSVGBounds } from '../hooks/useSVGBounds';

// STYLES
import styles from './charts.module.css';

// TODO: Make these types better
export const SpiralChart = ({ data, dateRange} : {data?: any, dateRange?: any}) => {

  const spiralContainer = useRef(null);

  var width = 500,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = 4;

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);


  useMemo(() => {
    if (spiralContainer.current) {

      // If there's a chart, remove it to redraw
      d3.select('#spiral-container-svg').selectAll('*').remove();

      const svg = d3.select(spiralContainer.current).append("svg")
      .attr('id', 'spiral-chart')
      .attr("width", width)
      .attr("height", height)

      const group = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      var points = d3.range(start, end + 0.001, (end - start) / 1000);

      var spiral = d3.lineRadial()
        .curve(d3.curveCardinal)
        .angle(theta)
        .radius(radius);

      var path = svg.append("path")
        .datum(points)
        .attr("id", "spiral")
        .attr("d", spiral)
        .style("fill", "none")
        .style("stroke", "none");

      // fudge some data, 2 years of data starting today
      var spiralLength = path.node().getTotalLength(),
          N = 730,
          barWidth = (spiralLength / N) - 1
      var someData = [];
      for (var i = 0; i < N; i++) {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        someData.push({
          date: currentDate,
          value: Math.floor(Math.random() * 3) + 1
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
      svg.selectAll("rect")
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
          
          d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

          return d.x;
        })
        .attr("y", function(d){
          return d.y;
        })
        .attr("width", 8)
        .attr("height", 25)
        .style("fill", function(d){
          return moodColors[d.value]; // rotate the bar
        })
        .style("stroke", "none")
        .attr("transform", function(d){
          return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
        });
      
      // add date labels
      var tF = d3.timeFormat("%b %Y"),
          firstInMonth = {};
      svg.selectAll("text")
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

        const test = document.querySelector('#spiral-chart')
        const {xMin, xMax, yMin, yMax} = useSVGBounds(test);
        const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;
        test.setAttribute('viewBox', viewbox);
      }
    },[spiralContainer.current, data]);


    return(
        <svg
            id="spiral-container-svg"
            className={styles['spiral-container-svg']}
            width='100%'
            height="400px"
            //height={`${height}px`}
            ref={spiralContainer}
        />
    )
}