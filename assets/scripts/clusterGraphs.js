// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("http://dev.spatialdatacapture.org:8717/data/clusters/average", function(data) {

delete data[0].HH_owning_cars_perc
delete data[0].avg_time_bus
delete data[0].avg_time_car
delete data[0].avg_time_rail
delete data[0].bicycle_perc
delete data[0].bus_perc
delete data[0].car_perc
delete data[0].on_foot_perc
delete data[0].train_perc
delete data[0].underground_metro_perc
delete data[0].work_from_home_perc
data[0].cluster label = "clusterID"

delete data[1].HH_owning_cars_perc
delete data[1].avg_time_bus
delete data[1].avg_time_car
delete data[1].avg_time_rail
delete data[1].bicycle_perc
delete data[1].bus_perc
delete data[1].car_perc
delete data[1].on_foot_perc
delete data[1].train_perc
delete data[1].underground_metro_perc
delete data[1].work_from_home_perc
data[1].cluster label = "clusterID"

delete data[2].HH_owning_cars_perc
delete data[2].avg_time_bus
delete data[2].avg_time_car
delete data[2].avg_time_rail
delete data[2].bicycle_perc
delete data[2].bus_perc
delete data[2].car_perc
delete data[2].on_foot_perc
delete data[2].train_perc
delete data[2].underground_metro_perc
delete data[2].work_from_home_perc
data[2].cluster label = "clusterID"

delete data[3].HH_owning_cars_perc
delete data[3].avg_time_bus
delete data[3].avg_time_car
delete data[3].avg_time_rail
delete data[3].bicycle_perc
delete data[3].bus_perc
delete data[3].car_perc
delete data[3].on_foot_perc
delete data[3].train_perc
delete data[3].underground_metro_perc
delete data[3].work_from_home_perc
data[3].cluster label = "clusterID"

delete data[4].HH_owning_cars_perc
delete data[4].avg_time_bus
delete data[4].avg_time_car
delete data[4].avg_time_rail
delete data[4].bicycle_perc
delete data[4].bus_perc
delete data[4].car_perc
delete data[4].on_foot_perc
delete data[4].train_perc
delete data[4].underground_metro_perc
delete data[4].work_from_home_perc
data[4].cluster label = "clusterID"


console.log(data)


// List of groups = species here = value of the first column called group -> I show them on the X axis
var groups = d3.map(data, function(d){return(d.cluster label)}).keys()

// Add X axis
var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(0));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 40])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Another scale for subgroup position?
var xSubgroup = d3.scaleBand()
  .domain(subgroups)
  .range([0, x.bandwidth()])
  .padding([0.05])

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#e41a1c','#377eb8','#4daf4a'])

// Show the bars
svg.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data)
  .enter()
  .append("g")
    .attr("transform", function(d) { return "translate(" + x(d.clusterID) + ",0)"; })
  .selectAll("rect")
  .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d) { return color(d.key); });
})
