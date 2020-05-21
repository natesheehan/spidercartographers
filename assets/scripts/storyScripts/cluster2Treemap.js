// set the dimensions and margins of the graph
var marginPieCluster2 = {top: 100, right: 0, bottom: 0, left: 0},
    widthPieCluster2 = 460 - marginPieCluster2.left - marginPieCluster2.right,
    heightPieCluster2 = 460 - marginPieCluster2.top - marginPieCluster2.bottom,
    innerRadius = 90,
    outerRadius = Math.min(widthPieCluster2, heightPieCluster2) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svgPieCluster2 = d3.select("#clusterPie2")
  .append("svg")
    .attr("width", widthPieCluster2 + marginPieCluster2.left + marginPieCluster2.right)
    .attr("height", heightPieCluster2 + marginPieCluster2.top + marginPieCluster2.bottom)
  .append("g")
    .attr("transform", "translate(" + (widthPieCluster2 / 2 + marginPieCluster2.left) + "," + (heightPieCluster2 / 2 + marginPieCluster2.top) + ")");

d3.json("http://dev.spatialdatacapture.org:8717/clustermeans/perc/cluster2", function(data) {
console.log(data)

data[0].mode = "WFH (8.7%)"
data[1].mode = "Metro (0.8%)"
data[2].mode = "Train (1.7%)"
data[3].mode = "Bus (6.5%)"
data[4].mode = "Bike (2.5%)"
data[5].mode = "Walk (12.2%)"
data[6].mode = "Car (65.5%)"

  var xPieCluster2 = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.mode; })); // The domain of the X axis is the list of states.
  var yPieCluster2 = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svgPieCluster2.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#37a583")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yPieCluster2(d.cluster2); })
          .startAngle(function(d) { return xPieCluster2(d.mode); })
          .endAngle(function(d) { return xPieCluster2(d.mode) + xPieCluster2.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svgPieCluster2.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (xPieCluster2(d.mode) + xPieCluster2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xPieCluster2(d.mode) + xPieCluster2.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yPieCluster2(d.cluster2)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.mode)})
        .attr("transform", function(d) { return (xPieCluster2(d.mode) + xPieCluster2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


                svgPieCluster2.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -10)
                .attr("x", 30)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-360)")
                .text("Profile 3");


});
