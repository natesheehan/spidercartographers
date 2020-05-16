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


d3.json("http://dev.spatialdatacapture.org:8717/averages/mean,min,twenty_five,median,seventy_five,max/box3", function(boxData) {
// Compute summary statistics used for the box:
    console.log(boxData);
var q1 = boxData[0].twenty_five
var median = boxData[0].mean
var q3 = boxData[0].seventy_five
var interQuantileRange = q3 -q1
var min = boxData[0].min
var max = boxData[0].max

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
  .attr("stroke", "#37a583")

// Show the box
svg
  .append("rect")
  .attr("x", centerBox - widthBox / 2)
  .attr("y", y(q3))
  .attr("height", (y(q1) - y(q3)))
  .attr("width", widthBox)
  .attr("stroke", "black")
  .style("fill", "#186da0")

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
  .attr("stroke", "#37a583")
});
