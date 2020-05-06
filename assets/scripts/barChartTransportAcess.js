// set the dimensions and margins of the graph
var marginBar = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 90
  },
  widthBar = 460 - marginBar.left - marginBar.right,
  heightBar = 400 - marginBar.top - marginBar.bottom;

// append the svg object to the body of the page
var svgBar = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", widthBar + marginBar.left + marginBar.right)
  .attr("height", heightBar + marginBar.top + marginBar.bottom)
  .append("g")
  .attr("transform",
    "translate(" + marginBar.left + "," + marginBar.top + ")");

// Parse the Data
data = [{
    "mode": "Bus Stops",
    "share": 38.47993334
  },
  {
    "mode": "Train Stations",
    "share": 0.320094431
  },
  {
    "mode": "Metro Stations",
    "share": 0.124843772
  }
];

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 40])
  .range([0, widthBar]);
svgBar.append("g")
  .attr("transform", "translate(0," + heightBar + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([0, heightBar])
  .domain(data.map(function(d) {
    return d.mode;
  }))
  .padding(.1);
svgBar.append("g")
  .call(d3.axisLeft(y))

//Bars
svgBar.selectAll("myRect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", x(0))
  .attr("y", function(d) {
    return y(d.mode);
  })
  .attr("width", function(d) {
    return x(d.share);
  })
  .attr("height", y.bandwidth())
  .attr("fill", "#1b262c")

  svgBar.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", widthBar)
    .attr("y", heightBar +35)
    .text("Mean Public Transport Access in MSOA's");

    svgBar.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -80)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Transport Type");
