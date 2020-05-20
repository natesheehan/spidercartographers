// set the dimensions and margins of the graph
var marginPieCluster3 = {top: 100, right: 0, bottom: 0, left: 0},
    widthPieCluster3 = 460 - marginPieCluster3.left - marginPieCluster3.right,
    heightPieCluster3 = 460 - marginPieCluster3.top - marginPieCluster3.bottom,
    innerRadius = 90,
    outerRadius = Math.min(widthPieCluster3, heightPieCluster3) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svgPieCluster3 = d3.select("#clusterPie3")
  .append("svg")
    .attr("width", widthPieCluster3 + marginPieCluster3.left + marginPieCluster3.right)
    .attr("height", heightPieCluster3 + marginPieCluster3.top + marginPieCluster3.bottom)
  .append("g")
    .attr("transform", "translate(" + (widthPieCluster3 / 2 + marginPieCluster3.left) + "," + (heightPieCluster3 / 2 + marginPieCluster3.top) + ")");

d3.json("http://dev.spatialdatacapture.org:8717/clustermeans/perc/cluster3", function(data) {
console.log(data)

data[0].mode = "WFH (9.4%)"
data[1].mode = "Metro (22.7%)"
data[2].mode = "Train (12%)"
data[3].mode = "Bus (15%)"
data[4].mode = "Bike (4.3%)"
data[5].mode = "Walk (9.9%)"
data[6].mode = "Car (24.5%)"

  var xPieCluster3 = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.mode; })); // The domain of the X axis is the list of states.
  var yPieCluster3 = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svgPieCluster3.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#186da0")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yPieCluster3(d.cluster3); })
          .startAngle(function(d) { return xPieCluster3(d.mode); })
          .endAngle(function(d) { return xPieCluster3(d.mode) + xPieCluster3.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svgPieCluster3.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (xPieCluster3(d.mode) + xPieCluster3.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xPieCluster3(d.mode) + xPieCluster3.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yPieCluster3(d.cluster3)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.mode)})
        .attr("transform", function(d) { return (xPieCluster3(d.mode) + xPieCluster3.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


                svgPieCluster3.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -10)
                .attr("x", 30)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-360)")
                .text("Cluster 3");


});
