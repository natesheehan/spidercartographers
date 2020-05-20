// set the dimensions and margins of the graph
var marginPieCluster1 = {top: 100, right: 0, bottom: 0, left: 0},
    widthPieCluster1 = 460 - marginPieCluster1.left - marginPieCluster1.right,
    heightPieCluster1 = 460 - marginPieCluster1.top - marginPieCluster1.bottom,
    innerRadius = 90,
    outerRadius = Math.min(widthPieCluster1, heightPieCluster1) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svgPieCluster1 = d3.select("#clusterPie1")
  .append("svg")
    .attr("width", widthPieCluster1 + marginPieCluster1.left + marginPieCluster1.right)
    .attr("height", heightPieCluster1 + marginPieCluster1.top + marginPieCluster1.bottom)
  .append("g")
    .attr("transform", "translate(" + (widthPieCluster1 / 2 + marginPieCluster1.left) + "," + (heightPieCluster1 / 2 + marginPieCluster1.top) + ")");

d3.json("http://dev.spatialdatacapture.org:8717/clustermeans/perc/cluster1", function(data) {
console.log(data)

data[0].mode = "WFH (18%)"
data[1].mode = "Metro (0.17%)"
data[2].mode = "Train (2.4%)"
data[3].mode = "Bus (1.7%)"
data[4].mode = "Bike (1.7%)"
data[5].mode = "Walk (7.1%)"
data[6].mode = "Car (67.3%)"

  var xPieCluster1 = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.mode; })); // The domain of the X axis is the list of states.
  var yPieCluster1 = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svgPieCluster1.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#ed6663")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yPieCluster1(d.cluster1); })
          .startAngle(function(d) { return xPieCluster1(d.mode); })
          .endAngle(function(d) { return xPieCluster1(d.mode) + xPieCluster1.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svgPieCluster1.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (xPieCluster1(d.mode) + xPieCluster1.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xPieCluster1(d.mode) + xPieCluster1.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yPieCluster1(d.cluster1)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.mode)})
        .attr("transform", function(d) { return (xPieCluster1(d.mode) + xPieCluster1.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

        svgPieCluster1.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -10)
        .attr("x", 30)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-360)")
        .text("Cluster 1");


});
