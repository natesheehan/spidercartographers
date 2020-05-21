// set the dimensions and margins of the graph
var marginPieCluster4 = {top: 100, right: 0, bottom: 0, left: 0},
    widthPieCluster4 = 460 - marginPieCluster4.left - marginPieCluster4.right,
    heightPieCluster4 = 460 - marginPieCluster4.top - marginPieCluster4.bottom,
    innerRadius = 90,
    outerRadius = Math.min(widthPieCluster4, heightPieCluster4) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svgPieCluster4 = d3.select("#clusterPie4")
  .append("svg")
    .attr("width", widthPieCluster4 + marginPieCluster4.left + marginPieCluster4.right)
    .attr("height", heightPieCluster4 + marginPieCluster4.top + marginPieCluster4.bottom)
  .append("g")
    .attr("transform", "translate(" + (widthPieCluster4 / 2 + marginPieCluster4.left) + "," + (heightPieCluster4 / 2 + marginPieCluster4.top) + ")");

d3.json("http://dev.spatialdatacapture.org:8717/clustermeans/perc/cluster4", function(data) {
console.log(data)

data[0].mode = "WFH (7.1%)"
data[1].mode = "Metro (0.5%)"
data[2].mode = "Train (2.7%)"
data[3].mode = "Bus (10.5%)"
data[4].mode = "Bike (3.2%)"
data[5].mode = "Walk (12.5%)"
data[6].mode = "Car (61.2%)"

  var xPieCluster4 = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.mode; })); // The domain of the X axis is the list of states.
  var yPieCluster4 = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svgPieCluster4.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#fff059")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yPieCluster4(d.cluster4); })
          .startAngle(function(d) { return xPieCluster4(d.mode); })
          .endAngle(function(d) { return xPieCluster4(d.mode) + xPieCluster4.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svgPieCluster4.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (xPieCluster4(d.mode) + xPieCluster4.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xPieCluster4(d.mode) + xPieCluster4.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yPieCluster4(d.cluster4)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.mode)})
        .attr("transform", function(d) { return (xPieCluster4(d.mode) + xPieCluster4.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


                svgPieCluster4.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -10)
                .attr("x", 30)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-360)")
                .text("Profile 5");


});
