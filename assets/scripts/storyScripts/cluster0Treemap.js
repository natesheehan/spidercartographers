// set the dimensions and margins of the graph
var marginPieCluster0 = {top: 100, right: 0, bottom: 0, left: 0},
    widthPieCluster0 = 460 - marginPieCluster0.left - marginPieCluster0.right,
    heightPieCluster0 = 460 - marginPieCluster0.top - marginPieCluster0.bottom,
    innerRadius = 90,
    outerRadius = Math.min(widthPieCluster0, heightPieCluster0) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svgPieCluster0 = d3.select("#clusterPie0")
  .append("svg")
    .attr("width", widthPieCluster0 + marginPieCluster0.left + marginPieCluster0.right)
    .attr("height", heightPieCluster0 + marginPieCluster0.top + marginPieCluster0.bottom)
  .append("g")
    .attr("transform", "translate(" + (widthPieCluster0 / 2 + marginPieCluster0.left) + "," + (heightPieCluster0 / 2 + marginPieCluster0.top) + ")");

d3.json("http://dev.spatialdatacapture.org:8717/clustermeans/perc/cluster0", function(data) {


data[0].mode = "WFH (11.5%)"
data[1].mode = "Metro (1.4%)"
data[2].mode = "Train (6.5%)"
data[3].mode = "Bus (3.7%)"
data[4].mode = "Bike (1.7%)"
data[5].mode = "Walk (6.6%)"
data[6].mode = "Car (67%)"

  var xPieCluster0 = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.mode; })); // The domain of the X axis is the list of states.
  var yPieCluster0 = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svgPieCluster0.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      .attr("fill", "#ffa372")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yPieCluster0(d.cluster0); })
          .startAngle(function(d) { return xPieCluster0(d.mode); })
          .endAngle(function(d) { return xPieCluster0(d.mode) + xPieCluster0.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))

  // Add the labels
  svgPieCluster0.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (xPieCluster0(d.mode) + xPieCluster0.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((xPieCluster0(d.mode) + xPieCluster0.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yPieCluster0(d.cluster0)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.mode)})
        .attr("transform", function(d) { return (xPieCluster0(d.mode) + xPieCluster0.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


                svgPieCluster0.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", -10)
                .attr("x", 30)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-360)")
                .text("Profile 1");


});
