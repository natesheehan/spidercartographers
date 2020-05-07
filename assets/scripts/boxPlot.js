// set the dimensions and marginBoxs of the graph
var marginBox = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 40
  },
  widthBox = 400 - marginBox.left - marginBox.right,
  heightBox = 400 - marginBox.top - marginBox.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz1")
  .append("svg")
  .attr("width", widthBox + marginBox.left + marginBox.right)
  .attr("height", heightBox + marginBox.top + marginBox.bottom)
  .append("g")
  .attr("transform",
    "translate(" + marginBox.left + "," + marginBox.top + ")");

// Compute summary statistics used for the box:
var q1 = 54.50845335
var median = 60.00976374
var q3 = 71.10474827
var interQuantileRange = 65.10757717
var min = 3.051201672
var max = 84.16775885

// Show the Y scale
var y = d3.scaleLinear()
  .domain([0, 90])
  .range([heightBox, 0]);
svg.call(d3.axisLeft(y))

// a few features for the box
var centerBox = 200
var widthBox = 100

// Show the main vertical line
svg
  .append("line")
  .attr("x1", centerBox)
  .attr("x2", centerBox)
  .attr("y1", y(min))
  .attr("y2", y(max))
  .attr("stroke", "black")

// Show the box
svg
  .append("rect")
  .attr("x", centerBox - widthBox / 2)
  .attr("y", y(q3))
  .attr("height", (y(q1) - y(q3)))
  .attr("width", widthBox)
  .attr("stroke", "black")
  .style("fill", "#ffa372")

svg.append("text")
  .attr("x", +190)
  .attr("y", +5)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Car MSOA Box Plot");

// show median, min and max horizontal lines
svg
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
  .attr("x1", centerBox - widthBox / 2)
  .attr("x2", centerBox + widthBox / 2)
  .attr("y1", function(d) {
    return (y(d))
  })
  .attr("y2", function(d) {
    return (y(d))
  })
  .attr("stroke", "black")
